import 'dotenv/config';

import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../src/generated/prisma/client';

import {
  MetodoPago,
  EstadoVenta,
  TipoMovimientoInventario,
  TipoCliente,
} from '../src/generated/prisma/enums';

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({
  adapter,
});

function randomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomItem<T>(items: T[]): T {
  return items[Math.floor(Math.random() * items.length)];
}

function toDecimal(value: number) {
  return Number(value.toFixed(2));
}

const categories = [
  'Construcción',
  'Herramientas',
  'Pinturas',
  'Electricidad',
  'Plomería',
  'Ferretería general',
];

const units = [
  { nombre: 'Unidad', abreviatura: 'u' },
  { nombre: 'Bolsa', abreviatura: 'bol' },
  { nombre: 'Metro', abreviatura: 'm' },
  { nombre: 'Litro', abreviatura: 'lt' },
  { nombre: 'Kilogramo', abreviatura: 'kg' },
];

const brands = [
  'Tramontina',
  'Bosch',
  'Stanley',
  'Fancesa',
  'Monopol',
  'Tigre',
  'Genérica',
];

const productTemplates = [
  {
    nombre: 'Cemento IP-30',
    categoria: 'Construcción',
    unidad: 'bol',
    precio: 58,
    compra: 49,
    stockMinimo: 25,
    tipo: 'ALTA',
  },
  {
    nombre: 'Arena fina',
    categoria: 'Construcción',
    unidad: 'm',
    precio: 35,
    compra: 25,
    stockMinimo: 20,
    tipo: 'ALTA',
  },
  {
    nombre: 'Arena gruesa',
    categoria: 'Construcción',
    unidad: 'm',
    precio: 32,
    compra: 24,
    stockMinimo: 20,
    tipo: 'ALTA',
  },
  {
    nombre: 'Ladrillo 6 huecos',
    categoria: 'Construcción',
    unidad: 'u',
    precio: 1.5,
    compra: 1,
    stockMinimo: 500,
    tipo: 'ALTA',
  },
  {
    nombre: 'Fierro corrugado 1/2',
    categoria: 'Construcción',
    unidad: 'u',
    precio: 48,
    compra: 40,
    stockMinimo: 30,
    tipo: 'ALTA',
  },
  {
    nombre: 'Pintura látex blanca 18L',
    categoria: 'Pinturas',
    unidad: 'lt',
    precio: 260,
    compra: 210,
    stockMinimo: 10,
    tipo: 'MEDIA',
  },
  {
    nombre: 'Pintura esmalte azul 1L',
    categoria: 'Pinturas',
    unidad: 'lt',
    precio: 45,
    compra: 33,
    stockMinimo: 12,
    tipo: 'MEDIA',
  },
  {
    nombre: 'Brocha 2 pulgadas',
    categoria: 'Pinturas',
    unidad: 'u',
    precio: 18,
    compra: 11,
    stockMinimo: 20,
    tipo: 'MEDIA',
  },
  {
    nombre: 'Rodillo profesional',
    categoria: 'Pinturas',
    unidad: 'u',
    precio: 35,
    compra: 24,
    stockMinimo: 15,
    tipo: 'MEDIA',
  },
  {
    nombre: 'Cable eléctrico 2.5mm',
    categoria: 'Electricidad',
    unidad: 'm',
    precio: 4.5,
    compra: 3,
    stockMinimo: 200,
    tipo: 'ALTA',
  },
  {
    nombre: 'Tomacorriente doble',
    categoria: 'Electricidad',
    unidad: 'u',
    precio: 22,
    compra: 14,
    stockMinimo: 25,
    tipo: 'MEDIA',
  },
  {
    nombre: 'Interruptor simple',
    categoria: 'Electricidad',
    unidad: 'u',
    precio: 16,
    compra: 10,
    stockMinimo: 25,
    tipo: 'MEDIA',
  },
  {
    nombre: 'Tubo PVC 1/2',
    categoria: 'Plomería',
    unidad: 'u',
    precio: 18,
    compra: 12,
    stockMinimo: 30,
    tipo: 'ALTA',
  },
  {
    nombre: 'Codo PVC 1/2',
    categoria: 'Plomería',
    unidad: 'u',
    precio: 5,
    compra: 3,
    stockMinimo: 50,
    tipo: 'MEDIA',
  },
  {
    nombre: 'Llave de paso',
    categoria: 'Plomería',
    unidad: 'u',
    precio: 38,
    compra: 27,
    stockMinimo: 15,
    tipo: 'MEDIA',
  },
  {
    nombre: 'Martillo carpintero',
    categoria: 'Herramientas',
    unidad: 'u',
    precio: 55,
    compra: 38,
    stockMinimo: 8,
    tipo: 'BAJA',
  },
  {
    nombre: 'Destornillador plano',
    categoria: 'Herramientas',
    unidad: 'u',
    precio: 22,
    compra: 14,
    stockMinimo: 15,
    tipo: 'MEDIA',
  },
  {
    nombre: 'Taladro eléctrico',
    categoria: 'Herramientas',
    unidad: 'u',
    precio: 420,
    compra: 330,
    stockMinimo: 4,
    tipo: 'BAJA',
  },
  {
    nombre: 'Amoladora angular',
    categoria: 'Herramientas',
    unidad: 'u',
    precio: 380,
    compra: 295,
    stockMinimo: 4,
    tipo: 'BAJA',
  },
  {
    nombre: 'Clavos 2 pulgadas',
    categoria: 'Ferretería general',
    unidad: 'kg',
    precio: 18,
    compra: 12,
    stockMinimo: 40,
    tipo: 'ALTA',
  },
  {
    nombre: 'Tornillos drywall',
    categoria: 'Ferretería general',
    unidad: 'kg',
    precio: 28,
    compra: 19,
    stockMinimo: 30,
    tipo: 'MEDIA',
  },
];

async function main() {
  console.log('Iniciando seed ML...');

  const adminRole = await prisma.rol.upsert({
    where: { nombre: 'ADMINISTRADOR' },
    update: {},
    create: {
      nombre: 'ADMINISTRADOR',
      descripcion: 'Administrador del sistema',
    },
  });

  const vendedorRole = await prisma.rol.upsert({
    where: { nombre: 'VENDEDOR' },
    update: {},
    create: { nombre: 'VENDEDOR', descripcion: 'Responsable de ventas' },
  });

  const almaceneroRole = await prisma.rol.upsert({
    where: { nombre: 'ALMACENERO' },
    update: {},
    create: { nombre: 'ALMACENERO', descripcion: 'Responsable de almacén' },
  });

  const usuario = await prisma.usuario.upsert({
    where: { email: 'admin@ferreteria.com' },
    update: {},
    create: {
      nombre: 'Admin',
      apellido: 'Sistema',
      email: 'admin@ferreteria.com',
      password: '123456',
      telefono: '70000001',
    },
  });

  await prisma.usuarioRol.upsert({
    where: {
      idUsuario_idRol: {
        idUsuario: usuario.idUsuario,
        idRol: adminRole.idRol,
      },
    },
    update: {},
    create: {
      idUsuario: usuario.idUsuario,
      idRol: adminRole.idRol,
    },
  });

  const vendedor = await prisma.usuario.upsert({
    where: { email: 'vendedor@ferreteria.com' },
    update: {},
    create: {
      nombre: 'Carlos',
      apellido: 'Vendedor',
      email: 'vendedor@ferreteria.com',
      password: '123456',
      telefono: '70000002',
    },
  });

  await prisma.usuarioRol.upsert({
    where: {
      idUsuario_idRol: {
        idUsuario: vendedor.idUsuario,
        idRol: vendedorRole.idRol,
      },
    },
    update: {},
    create: {
      idUsuario: vendedor.idUsuario,
      idRol: vendedorRole.idRol,
    },
  });

  await prisma.usuarioRol.upsert({
    where: {
      idUsuario_idRol: {
        idUsuario: usuario.idUsuario,
        idRol: almaceneroRole.idRol,
      },
    },
    update: {},
    create: {
      idUsuario: usuario.idUsuario,
      idRol: almaceneroRole.idRol,
    },
  });

  const categoryMap = new Map<string, number>();
  for (const name of categories) {
    const c = await prisma.categoria.upsert({
      where: { nombre: name },
      update: {},
      create: { nombre: name, descripcion: `Categoría ${name}` },
    });
    categoryMap.set(name, c.idCategoria);
  }

  const brandMap = new Map<string, number>();
  for (const name of brands) {
    const b = await prisma.marca.upsert({
      where: { nombre: name },
      update: {},
      create: { nombre: name },
    });
    brandMap.set(name, b.idMarca);
  }

  const unitMap = new Map<string, number>();
  for (const u of units) {
    const unit = await prisma.unidadMedida.upsert({
      where: { abreviatura: u.abreviatura },
      update: {},
      create: u,
    });
    unitMap.set(u.abreviatura, unit.idUnidad);
  }

  const almacen = await prisma.almacen.create({
    data: {
      nombre: `Almacén ML ${Date.now()}`,
      direccion: 'Zona Plan 3000',
      descripcion: 'Almacén para datos históricos de prueba',
    },
  });

  const ubicacion = await prisma.ubicacionAlmacen.create({
    data: {
      idAlmacen: almacen.idAlmacen,
      pasillo: 'A',
      estante: '1',
      nivel: '1',
      descripcion: 'Ubicación general',
    },
  });

  const clientes: any[] = [];
  for (let i = 1; i <= 40; i++) {
    const cliente = await prisma.cliente.create({
      data: {
        nombre: `Cliente ${i}`,
        apellido: `Prueba`,
        telefono: `70010${String(i).padStart(3, '0')}`,
        tipoCliente: randomItem([
          'MINORISTA',
          'CONSTRUCTOR',
          'ELECTRICISTA',
          'MAYORISTA',
          'EMPRESA',
        ] as any),
      },
    });
    clientes.push(cliente);
  }

  const productos: any[] = [];
  for (let i = 0; i < 100; i++) {
    const base = productTemplates[i % productTemplates.length];
    const nombre =
      i < productTemplates.length
        ? base.nombre
        : `${base.nombre} Var. ${i + 1}`;
    const stockActual =
      base.tipo === 'ALTA'
        ? randomInt(5, 80)
        : base.tipo === 'MEDIA'
          ? randomInt(20, 120)
          : randomInt(40, 200);

    const producto = await prisma.producto.create({
      data: {
        idCategoria: categoryMap.get(base.categoria)!,
        idMarca: randomItem([...brandMap.values()]),
        idUnidad: unitMap.get(base.unidad)!,
        idUbicacion: ubicacion.idUbicacion,
        codigoBarras: `ML-${Date.now()}-${i}`,
        nombre,
        descripcion: `Producto generado para entrenamiento ML: ${nombre}`,
        precioVenta: toDecimal(base.precio + randomInt(-5, 20)),
        precioCompraReferencia: toDecimal(base.compra),
        stockActual,
        stockMinimo: base.stockMinimo,
      },
    });

    productos.push({ ...producto, tipoMl: base.tipo });
  }

  const startDate = new Date();
  startDate.setMonth(startDate.getMonth() - 24);

  let ventasCreadas = 0;
  let detallesCreados = 0;

  for (let month = 0; month < 24; month++) {
    const monthDate = new Date(startDate);
    monthDate.setMonth(startDate.getMonth() + month);

    const salesThisMonth = randomInt(80, 180);

    for (let s = 0; s < salesThisMonth; s++) {
      const saleDate = new Date(monthDate);
      saleDate.setDate(randomInt(1, 28));
      saleDate.setHours(randomInt(8, 20), randomInt(0, 59), 0);

      const detailCount = randomInt(1, 5);
      const selectedProducts = Array.from({ length: detailCount }, () =>
        randomItem(productos),
      );

      let total = 0;
      const detallesData = selectedProducts.map((p: any) => {
        let cantidad: number;

        if (p.tipoMl === 'ALTA') cantidad = randomInt(8, 35);
        else if (p.tipoMl === 'MEDIA') cantidad = randomInt(2, 12);
        else cantidad = randomInt(1, 4);

        const precioUnitario = Number(p.precioVenta);
        const subtotal = cantidad * precioUnitario;
        total += subtotal;

        return {
          idProducto: p.idProducto,
          cantidad,
          precioUnitario: toDecimal(precioUnitario),
          subtotal: toDecimal(subtotal),
        };
      });

      await prisma.venta.create({
        data: {
          idCliente: randomItem(clientes).idCliente,
          idUsuario: vendedor.idUsuario,
          fechaVenta: saleDate,
          total: toDecimal(total),
          metodoPago: randomItem([
            'EFECTIVO',
            'QR',
            'TARJETA',
            'TRANSFERENCIA',
          ] as MetodoPago[]),
          estado: EstadoVenta.REGISTRADA,
          observacion: 'Venta histórica generada para ML',
          detalles: {
            create: detallesData,
          },
        },
      });

      ventasCreadas++;
      detallesCreados += detallesData.length;
    }
  }

  for (const p of productos as any[]) {
    await prisma.movimientoInventario.create({
      data: {
        idProducto: p.idProducto,
        idUsuario: usuario.idUsuario,
        tipoMovimiento: TipoMovimientoInventario.ENTRADA_COMPRA,
        cantidad: randomInt(50, 300),
        stockAnterior: 0,
        stockNuevo: p.stockActual,
        motivo: 'Carga inicial de inventario para entrenamiento ML',
      },
    });
  }

  console.log('Seed ML finalizado.');
  console.log(`Productos creados: ${productos.length}`);
  console.log(`Ventas creadas: ${ventasCreadas}`);
  console.log(`Detalles de venta creados: ${detallesCreados}`);
}

main()
  .catch((e) => {
    console.error('Error en seed ML:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
