import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePurchaseInput } from './dto/create-purchase.input';
import { CancelPurchaseInput } from './dto/cancel-purchase.input';

@Injectable()
export class PurchasesService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.compra.findMany({
      orderBy: {
        idCompra: 'desc',
      },
      include: {
        detalles: true,
      },
    });
  }

  async findOne(idCompra: number) {
    const purchase = await this.prisma.compra.findUnique({
      where: { idCompra },
      include: {
        detalles: true,
      },
    });

    if (!purchase) {
      throw new NotFoundException('Compra no encontrada');
    }

    return purchase;
  }

  async create(input: CreatePurchaseInput) {
    const supplier = await this.prisma.proveedor.findUnique({
      where: { idProveedor: input.idProveedor },
    });

    if (!supplier) {
      throw new NotFoundException('Proveedor no encontrado');
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
    }

    const total = input.detalles.reduce((sum, detail) => {
      return sum + detail.cantidad * detail.precioUnitario;
    }, 0);

    return this.prisma.$transaction(async (tx) => {
      const purchase = await tx.compra.create({
        data: {
          idProveedor: input.idProveedor,
          idUsuario: input.idUsuario,
          total,
          observacion: input.observacion,
        },
      });

      for (const detail of input.detalles) {
        const subtotal = detail.cantidad * detail.precioUnitario;

        await tx.detalleCompra.create({
          data: {
            idCompra: purchase.idCompra,
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
        const stockNuevo = stockAnterior + detail.cantidad;

        await tx.producto.update({
          where: { idProducto: detail.idProducto },
          data: {
            stockActual: stockNuevo,
            precioCompraReferencia: detail.precioUnitario,
          },
        });

        await tx.movimientoInventario.create({
          data: {
            idProducto: detail.idProducto,
            idUsuario: input.idUsuario,
            tipoMovimiento: 'ENTRADA_COMPRA',
            cantidad: detail.cantidad,
            stockAnterior,
            stockNuevo,
            motivo: `Compra registrada #${purchase.idCompra}`,
          },
        });
      }

      return tx.compra.findUnique({
        where: {
          idCompra: purchase.idCompra,
        },
        include: {
          detalles: true,
        },
      });
    });
  }

  async cancel(input: CancelPurchaseInput) {
    const purchase = await this.prisma.compra.findUnique({
      where: { idCompra: input.idCompra },
      include: {
        detalles: true,
      },
    });

    if (!purchase) {
      throw new NotFoundException('Compra no encontrada');
    }

    if (purchase.estado === 'ANULADA') {
      throw new BadRequestException('La compra ya está anulada');
    }

    return this.prisma.$transaction(async (tx) => {
      for (const detail of purchase.detalles) {
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
            `No se puede anular la compra. Stock insuficiente para el producto ${product.nombre}`,
          );
        }

        await tx.producto.update({
          where: { idProducto: detail.idProducto },
          data: {
            stockActual: stockNuevo,
          },
        });

        await tx.movimientoInventario.create({
          data: {
            idProducto: detail.idProducto,
            idUsuario: purchase.idUsuario,
            tipoMovimiento: 'AJUSTE_NEGATIVO',
            cantidad: detail.cantidad,
            stockAnterior,
            stockNuevo,
            motivo: input.motivo || `Anulación de compra #${purchase.idCompra}`,
          },
        });
      }

      await tx.compra.update({
        where: { idCompra: input.idCompra },
        data: {
          estado: 'ANULADA',
          observacion: input.motivo || purchase.observacion,
        },
      });

      return tx.compra.findUnique({
        where: { idCompra: input.idCompra },
        include: {
          detalles: true,
        },
      });
    });
  }
}
