import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSaleInput } from './dto/create-sale.input';
import { CancelSaleInput } from './dto/cancel-sale.input';

@Injectable()
export class SalesService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.venta.findMany({
      orderBy: {
        idVenta: 'desc',
      },
      include: {
        detalles: true,
      },
    });
  }

  async findOne(idVenta: number) {
    const sale = await this.prisma.venta.findUnique({
      where: { idVenta },
      include: {
        detalles: true,
      },
    });

    if (!sale) {
      throw new NotFoundException('Venta no encontrada');
    }

    return sale;
  }

  async create(input: CreateSaleInput) {
    if (input.idCliente) {
      const customer = await this.prisma.cliente.findUnique({
        where: { idCliente: input.idCliente },
      });

      if (!customer) {
        throw new NotFoundException('Cliente no encontrado');
      }
    }

    const user = await this.prisma.usuario.findUnique({
      where: { idUsuario: input.idUsuario },
    });

    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    for (const detail of input.detalles) {
      const product = await this.prisma.producto.findUnique({
        where: { idProducto: detail.idProducto },
      });

      if (!product) {
        throw new NotFoundException(
          `Producto con ID ${detail.idProducto} no encontrado`,
        );
      }

      if (product.stockActual < detail.cantidad) {
        throw new BadRequestException(
          `Stock insuficiente para el producto ${product.nombre}`,
        );
      }
    }

    const total = input.detalles.reduce((sum, detail) => {
      return sum + detail.cantidad * detail.precioUnitario;
    }, 0);

    return this.prisma.$transaction(async (tx) => {
      const sale = await tx.venta.create({
        data: {
          idCliente: input.idCliente,
          idUsuario: input.idUsuario,
          metodoPago: input.metodoPago as any,
          total,
          observacion: input.observacion,
        },
      });

      for (const detail of input.detalles) {
        const subtotal = detail.cantidad * detail.precioUnitario;

        await tx.detalleVenta.create({
          data: {
            idVenta: sale.idVenta,
            idProducto: detail.idProducto,
            cantidad: detail.cantidad,
            precioUnitario: detail.precioUnitario,
            subtotal,
          },
        });

        const product = await tx.producto.findUnique({
          where: { idProducto: detail.idProducto },
        });

        if (!product) {
          throw new NotFoundException(
            `Producto con ID ${detail.idProducto} no encontrado`,
          );
        }

        const stockAnterior = product.stockActual;
        const stockNuevo = stockAnterior - detail.cantidad;

        if (stockNuevo < 0) {
          throw new BadRequestException(
            `Stock insuficiente para el producto ${product.nombre}`,
          );
        }

        await tx.producto.update({
          where: {
            idProducto: detail.idProducto,
          },
          data: {
            stockActual: stockNuevo,
          },
        });

        await tx.movimientoInventario.create({
          data: {
            idProducto: detail.idProducto,
            idUsuario: input.idUsuario,
            tipoMovimiento: 'SALIDA_VENTA',
            cantidad: detail.cantidad,
            stockAnterior,
            stockNuevo,
            motivo: `Venta registrada #${sale.idVenta}`,
          },
        });
      }

      return tx.venta.findUnique({
        where: {
          idVenta: sale.idVenta,
        },
        include: {
          detalles: true,
        },
      });
    });
  }

  async cancel(input: CancelSaleInput) {
    const sale = await this.prisma.venta.findUnique({
      where: { idVenta: input.idVenta },
      include: {
        detalles: true,
      },
    });

    if (!sale) {
      throw new NotFoundException('Venta no encontrada');
    }

    if (sale.estado === 'ANULADA') {
      throw new BadRequestException('La venta ya está anulada');
    }

    return this.prisma.$transaction(async (tx) => {
      for (const detail of sale.detalles) {
        const product = await tx.producto.findUnique({
          where: { idProducto: detail.idProducto },
        });

        if (!product) {
          throw new NotFoundException(
            `Producto con ID ${detail.idProducto} no encontrado`,
          );
        }

        const stockAnterior = product.stockActual;
        const stockNuevo = stockAnterior + detail.cantidad;

        await tx.producto.update({
          where: {
            idProducto: detail.idProducto,
          },
          data: {
            stockActual: stockNuevo,
          },
        });

        await tx.movimientoInventario.create({
          data: {
            idProducto: detail.idProducto,
            idUsuario: sale.idUsuario,
            tipoMovimiento: 'AJUSTE_POSITIVO',
            cantidad: detail.cantidad,
            stockAnterior,
            stockNuevo,
            motivo: input.motivo || `Anulación de venta #${sale.idVenta}`,
          },
        });
      }

      await tx.venta.update({
        where: {
          idVenta: input.idVenta,
        },
        data: {
          estado: 'ANULADA',
          observacion: input.motivo || sale.observacion,
        },
      });

      return tx.venta.findUnique({
        where: {
          idVenta: input.idVenta,
        },
        include: {
          detalles: true,
        },
      });
    });
  }
}
