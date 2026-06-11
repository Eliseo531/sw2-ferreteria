import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrderInput } from './dto/create-order.input';
import { UpdateOrderStatusInput } from './dto/update-order-status.input';

@Injectable()
export class OrdersService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.pedido.findMany({
      orderBy: {
        idPedido: 'desc',
      },
      include: {
        detalles: true,
      },
    });
  }

  async findOne(idPedido: number) {
    const order = await this.prisma.pedido.findUnique({
      where: { idPedido },
      include: {
        detalles: true,
      },
    });

    if (!order) {
      throw new NotFoundException('Pedido no encontrado');
    }

    return order;
  }

  async create(input: CreateOrderInput) {
    if (input.idCliente) {
      const customer = await this.prisma.cliente.findUnique({
        where: { idCliente: input.idCliente },
      });

      if (!customer) {
        throw new NotFoundException('Cliente no encontrado');
      }
    }

    if (input.idUsuarioRegistro) {
      const user = await this.prisma.usuario.findUnique({
        where: { idUsuario: input.idUsuarioRegistro },
      });

      if (!user) {
        throw new NotFoundException('Usuario no encontrado');
      }
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

    const totalEstimado = input.detalles.reduce((sum, detail) => {
      return sum + detail.cantidad * detail.precioEstimado;
    }, 0);

    return this.prisma.$transaction(async (tx) => {
      const order = await tx.pedido.create({
        data: {
          idCliente: input.idCliente,
          idUsuarioRegistro: input.idUsuarioRegistro,
          origen: input.origen as any,
          totalEstimado,
          observacion: input.observacion,
        },
      });

      for (const detail of input.detalles) {
        const subtotal = detail.cantidad * detail.precioEstimado;

        await tx.detallePedido.create({
          data: {
            idPedido: order.idPedido,
            idProducto: detail.idProducto,
            cantidad: detail.cantidad,
            precioEstimado: detail.precioEstimado,
            subtotal,
          },
        });
      }

      return tx.pedido.findUnique({
        where: {
          idPedido: order.idPedido,
        },
        include: {
          detalles: true,
        },
      });
    });
  }

  async updateStatus(input: UpdateOrderStatusInput) {
    await this.findOne(input.idPedido);

    return this.prisma.pedido.update({
      where: {
        idPedido: input.idPedido,
      },
      data: {
        estado: input.estado as any,
      },
      include: {
        detalles: true,
      },
    });
  }

  async cancel(idPedido: number) {
    await this.findOne(idPedido);

    return this.prisma.pedido.update({
      where: {
        idPedido,
      },
      data: {
        estado: 'CANCELADO',
      },
      include: {
        detalles: true,
      },
    });
  }
}
