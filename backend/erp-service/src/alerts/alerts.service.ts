import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAlertInput } from './dto/create-alert.input';

@Injectable()
export class AlertsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.alerta.findMany({
      orderBy: {
        idAlerta: 'desc',
      },
    });
  }

  async findPending() {
    return this.prisma.alerta.findMany({
      where: {
        estado: 'PENDIENTE',
      },
      orderBy: {
        idAlerta: 'desc',
      },
    });
  }

  async create(input: CreateAlertInput) {
    if (input.idProducto) {
      const product = await this.prisma.producto.findUnique({
        where: { idProducto: input.idProducto },
      });

      if (!product) {
        throw new NotFoundException('Producto no encontrado');
      }
    }

    return this.prisma.alerta.create({
      data: {
        idProducto: input.idProducto,
        tipoAlerta: input.tipoAlerta as any,
        mensaje: input.mensaje,
      },
    });
  }

  async generateStockAlerts() {
    const products = await this.prisma.producto.findMany({
      where: {
        estado: 'ACTIVO',
      },
    });

    const createdAlerts: any[] = [];

    for (const product of products) {
      if (product.stockActual <= product.stockMinimo) {
        const existingAlert = await this.prisma.alerta.findFirst({
          where: {
            idProducto: product.idProducto,
            tipoAlerta: 'STOCK_BAJO',
            estado: 'PENDIENTE',
          },
        });

        if (!existingAlert) {
          const alert = await this.prisma.alerta.create({
            data: {
              idProducto: product.idProducto,
              tipoAlerta: 'STOCK_BAJO',
              mensaje: `El producto "${product.nombre}" tiene stock bajo. Stock actual: ${product.stockActual}, stock mínimo: ${product.stockMinimo}.`,
            },
          });

          createdAlerts.push(alert);
        }
      }
    }

    return createdAlerts;
  }

  async attend(idAlerta: number) {
    const alert = await this.prisma.alerta.findUnique({
      where: { idAlerta },
    });

    if (!alert) {
      throw new NotFoundException('Alerta no encontrada');
    }

    return this.prisma.alerta.update({
      where: { idAlerta },
      data: {
        estado: 'ATENDIDA',
        fechaAtencion: new Date(),
      },
    });
  }

  async ignore(idAlerta: number) {
    const alert = await this.prisma.alerta.findUnique({
      where: { idAlerta },
    });

    if (!alert) {
      throw new NotFoundException('Alerta no encontrada');
    }

    return this.prisma.alerta.update({
      where: { idAlerta },
      data: {
        estado: 'IGNORADA',
        fechaAtencion: new Date(),
      },
    });
  }
}
