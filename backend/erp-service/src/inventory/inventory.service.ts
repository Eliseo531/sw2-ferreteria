import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateInventoryMovementInput } from './dto/create-inventory-movement.input';

@Injectable()
export class InventoryService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.movimientoInventario.findMany({
      orderBy: {
        idMovimiento: 'desc',
      },
    });
  }

  async findByProduct(idProducto: number) {
    const product = await this.prisma.producto.findUnique({
      where: { idProducto },
    });

    if (!product) {
      throw new NotFoundException('Producto no encontrado');
    }

    return this.prisma.movimientoInventario.findMany({
      where: { idProducto },
      orderBy: {
        idMovimiento: 'desc',
      },
    });
  }

  async create(input: CreateInventoryMovementInput) {
    const product = await this.prisma.producto.findUnique({
      where: { idProducto: input.idProducto },
    });

    if (!product) {
      throw new NotFoundException('Producto no encontrado');
    }

    const user = await this.prisma.usuario.findUnique({
      where: { idUsuario: input.idUsuario },
    });

    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    const stockAnterior = product.stockActual;

    let stockNuevo = stockAnterior;

    if (
      input.tipoMovimiento === 'ENTRADA_COMPRA' ||
      input.tipoMovimiento === 'AJUSTE_POSITIVO'
    ) {
      stockNuevo = stockAnterior + input.cantidad;
    }

    if (
      input.tipoMovimiento === 'SALIDA_VENTA' ||
      input.tipoMovimiento === 'SALIDA_PEDIDO' ||
      input.tipoMovimiento === 'AJUSTE_NEGATIVO'
    ) {
      stockNuevo = stockAnterior - input.cantidad;
    }

    if (stockNuevo < 0) {
      throw new BadRequestException(
        'No hay stock suficiente para realizar la salida',
      );
    }

    return this.prisma.$transaction(async (tx) => {
      const movement = await tx.movimientoInventario.create({
        data: {
          idProducto: input.idProducto,
          idUsuario: input.idUsuario,
          tipoMovimiento: input.tipoMovimiento as any,
          cantidad: input.cantidad,
          stockAnterior,
          stockNuevo,
          motivo: input.motivo,
        },
      });

      await tx.producto.update({
        where: {
          idProducto: input.idProducto,
        },
        data: {
          stockActual: stockNuevo,
        },
      });

      return movement;
    });
  }
}
