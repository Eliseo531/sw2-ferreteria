import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateDeliveryInput } from './dto/create-delivery.input';
import { UpdateDeliveryStatusInput } from './dto/update-delivery-status.input';
import { AssignDeliveryDriverInput } from './dto/assign-delivery-driver.input';

@Injectable()
export class DeliveriesService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.entrega.findMany({
      orderBy: {
        idEntrega: 'desc',
      },
    });
  }

  async findOne(idEntrega: number) {
    const delivery = await this.prisma.entrega.findUnique({
      where: { idEntrega },
    });

    if (!delivery) {
      throw new NotFoundException('Entrega no encontrada');
    }

    return delivery;
  }

  async findByOrder(idPedido: number) {
    const order = await this.prisma.pedido.findUnique({
      where: { idPedido },
    });

    if (!order) {
      throw new NotFoundException('Pedido no encontrado');
    }

    const delivery = await this.prisma.entrega.findUnique({
      where: { idPedido },
    });

    if (!delivery) {
      throw new NotFoundException('El pedido no tiene entrega registrada');
    }

    return delivery;
  }

  async create(input: CreateDeliveryInput) {
    const order = await this.prisma.pedido.findUnique({
      where: { idPedido: input.idPedido },
    });

    if (!order) {
      throw new NotFoundException('Pedido no encontrado');
    }

    const existingDelivery = await this.prisma.entrega.findUnique({
      where: { idPedido: input.idPedido },
    });

    if (existingDelivery) {
      throw new BadRequestException(
        'Este pedido ya tiene una entrega registrada',
      );
    }

    if (input.idRepartidor) {
      const driver = await this.prisma.usuario.findUnique({
        where: { idUsuario: input.idRepartidor },
      });

      if (!driver) {
        throw new NotFoundException('Repartidor no encontrado');
      }
    }

    return this.prisma.$transaction(async (tx) => {
      const delivery = await tx.entrega.create({
        data: {
          idPedido: input.idPedido,
          idRepartidor: input.idRepartidor,
          direccionEntrega: input.direccionEntrega,
          latitudEntrega: input.latitudEntrega,
          longitudEntrega: input.longitudEntrega,
          observacion: input.observacion,
        },
      });

      await tx.pedido.update({
        where: { idPedido: input.idPedido },
        data: {
          estado: 'CONFIRMADO',
        },
      });

      return delivery;
    });
  }

  async assignDriver(input: AssignDeliveryDriverInput) {
    await this.findOne(input.idEntrega);

    const driver = await this.prisma.usuario.findUnique({
      where: { idUsuario: input.idRepartidor },
    });

    if (!driver) {
      throw new NotFoundException('Repartidor no encontrado');
    }

    return this.prisma.entrega.update({
      where: { idEntrega: input.idEntrega },
      data: {
        idRepartidor: input.idRepartidor,
      },
    });
  }

  async updateStatus(input: UpdateDeliveryStatusInput) {
    const delivery = await this.findOne(input.idEntrega);

    const updateData: any = {
      estado: input.estado as any,
      latitudEntrega: input.latitudEntrega,
      longitudEntrega: input.longitudEntrega,
      fotoEvidenciaUrl: input.fotoEvidenciaUrl,
      observacion: input.observacion,
    };

    if (input.estado === 'EN_CAMINO') {
      updateData.fechaSalida = new Date();
    }

    if (input.estado === 'ENTREGADA') {
      updateData.fechaEntrega = new Date();
    }

    return this.prisma.$transaction(async (tx) => {
      const updatedDelivery = await tx.entrega.update({
        where: {
          idEntrega: input.idEntrega,
        },
        data: updateData,
      });

      if (input.estado === 'EN_CAMINO') {
        await tx.pedido.update({
          where: {
            idPedido: delivery.idPedido,
          },
          data: {
            estado: 'EN_REPARTO',
          },
        });
      }

      if (input.estado === 'ENTREGADA') {
        await tx.pedido.update({
          where: {
            idPedido: delivery.idPedido,
          },
          data: {
            estado: 'ENTREGADO',
          },
        });
      }

      if (input.estado === 'FALLIDA') {
        await tx.pedido.update({
          where: {
            idPedido: delivery.idPedido,
          },
          data: {
            estado: 'CANCELADO',
          },
        });
      }

      return updatedDelivery;
    });
  }
}
