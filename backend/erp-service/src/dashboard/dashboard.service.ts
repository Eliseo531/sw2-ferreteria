import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DashboardService {
  constructor(private readonly prisma: PrismaService) {}

  async getSummary() {
    const [
      totalProductos,
      totalClientes,
      totalProveedores,
      totalVentas,
      totalCompras,
      pedidosPendientes,
      entregasPendientes,
      alertasPendientes,
      ventasAggregate,
      comprasAggregate,
    ] = await Promise.all([
      this.prisma.producto.count({
        where: { estado: 'ACTIVO' },
      }),
      this.prisma.cliente.count({
        where: { estado: 'ACTIVO' },
      }),
      this.prisma.proveedor.count({
        where: { estado: 'ACTIVO' },
      }),
      this.prisma.venta.count({
        where: { estado: 'REGISTRADA' },
      }),
      this.prisma.compra.count({
        where: { estado: 'REGISTRADA' },
      }),
      this.prisma.pedido.count({
        where: { estado: 'PENDIENTE' },
      }),
      this.prisma.entrega.count({
        where: { estado: 'PENDIENTE' },
      }),
      this.prisma.alerta.count({
        where: { estado: 'PENDIENTE' },
      }),
      this.prisma.venta.aggregate({
        where: { estado: 'REGISTRADA' },
        _sum: { total: true },
      }),
      this.prisma.compra.aggregate({
        where: { estado: 'REGISTRADA' },
        _sum: { total: true },
      }),
    ]);

    return {
      totalProductos,
      totalClientes,
      totalProveedores,
      totalVentas,
      totalCompras,
      pedidosPendientes,
      entregasPendientes,
      alertasPendientes,
      montoTotalVentas: Number(ventasAggregate._sum.total || 0),
      montoTotalCompras: Number(comprasAggregate._sum.total || 0),
    };
  }

  async getLowStockProducts() {
    const products = await this.prisma.producto.findMany({
      where: {
        estado: 'ACTIVO',
      },
      orderBy: {
        stockActual: 'asc',
      },
    });

    return products
      .filter((product) => product.stockActual <= product.stockMinimo)
      .map((product) => ({
        idProducto: product.idProducto,
        nombre: product.nombre,
        stockActual: product.stockActual,
        stockMinimo: product.stockMinimo,
      }));
  }

  async getTopSellingProducts() {
    const details = await this.prisma.detalleVenta.findMany({
      include: {
        producto: true,
      },
    });

    const grouped = new Map<
      number,
      {
        idProducto: number;
        nombre: string;
        cantidadVendida: number;
        totalVendido: number;
      }
    >();

    for (const detail of details) {
      const current = grouped.get(detail.idProducto) || {
        idProducto: detail.idProducto,
        nombre: detail.producto.nombre,
        cantidadVendida: 0,
        totalVendido: 0,
      };

      current.cantidadVendida += detail.cantidad;
      current.totalVendido += Number(detail.subtotal);

      grouped.set(detail.idProducto, current);
    }

    return Array.from(grouped.values())
      .sort((a, b) => b.cantidadVendida - a.cantidadVendida)
      .slice(0, 5);
  }
}
