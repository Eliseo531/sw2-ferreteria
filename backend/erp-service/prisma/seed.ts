import { PrismaClient } from '../src/generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import 'dotenv/config';

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Iniciando seed...');

  await prisma.rol.createMany({
    data: [
      { nombre: 'ADMINISTRADOR', descripcion: 'Acceso completo al sistema' },
      { nombre: 'VENDEDOR', descripcion: 'Gestión de ventas y clientes' },
      { nombre: 'ALMACENERO', descripcion: 'Gestión de inventario y almacén' },
      { nombre: 'REPARTIDOR', descripcion: 'Gestión de entregas y ubicación' },
    ],
    skipDuplicates: true,
  });

  await prisma.categoria.createMany({
    data: [
      {
        nombre: 'Herramientas',
        descripcion: 'Herramientas manuales y eléctricas',
      },
      { nombre: 'Construcción', descripcion: 'Materiales de construcción' },
      { nombre: 'Electricidad', descripcion: 'Productos eléctricos' },
      { nombre: 'Pinturas', descripcion: 'Pinturas, brochas y accesorios' },
      { nombre: 'Plomería', descripcion: 'Tubos, conexiones y accesorios' },
    ],
    skipDuplicates: true,
  });

  await prisma.marca.createMany({
    data: [
      {
        nombre: 'Tramontina',
        descripcion: 'Marca de herramientas y accesorios',
      },
      { nombre: 'Bosch', descripcion: 'Herramientas eléctricas' },
      {
        nombre: 'Makita',
        descripcion: 'Herramientas eléctricas profesionales',
      },
      { nombre: 'Pretul', descripcion: 'Herramientas económicas' },
      { nombre: 'Stanley', descripcion: 'Herramientas manuales' },
    ],
    skipDuplicates: true,
  });

  await prisma.unidadMedida.createMany({
    data: [
      { nombre: 'Unidad', abreviatura: 'UND' },
      { nombre: 'Bolsa', abreviatura: 'BOL' },
      { nombre: 'Metro', abreviatura: 'M' },
      { nombre: 'Litro', abreviatura: 'L' },
      { nombre: 'Caja', abreviatura: 'CAJ' },
    ],
    skipDuplicates: true,
  });

  const almacen = await prisma.almacen.upsert({
    where: { idAlmacen: 1 },
    update: {},
    create: {
      nombre: 'Almacén Central',
      direccion: 'Sucursal principal',
      descripcion: 'Almacén principal de la ferretería',
    },
  });

  await prisma.ubicacionAlmacen.createMany({
    data: [
      {
        idAlmacen: almacen.idAlmacen,
        pasillo: '1',
        estante: 'A',
        nivel: '1',
        descripcion: 'Herramientas manuales',
      },
      {
        idAlmacen: almacen.idAlmacen,
        pasillo: '2',
        estante: 'B',
        nivel: '1',
        descripcion: 'Materiales de construcción',
      },
      {
        idAlmacen: almacen.idAlmacen,
        pasillo: '3',
        estante: 'C',
        nivel: '1',
        descripcion: 'Productos eléctricos',
      },
      {
        idAlmacen: almacen.idAlmacen,
        pasillo: '4',
        estante: 'D',
        nivel: '1',
        descripcion: 'Pinturas y accesorios',
      },
    ],
  });

  console.log('Seed ejecutado correctamente');
}

main()
  .catch((error) => {
    console.error('Error ejecutando seed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
