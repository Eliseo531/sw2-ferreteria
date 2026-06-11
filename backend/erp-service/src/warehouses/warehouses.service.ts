import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateWarehouseInput } from './dto/create-warehouse.input';
import { UpdateWarehouseInput } from './dto/update-warehouse.input';
import { CreateLocationInput } from './dto/create-location.input';
import { UpdateLocationInput } from './dto/update-location.input';

@Injectable()
export class WarehousesService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.almacen.findMany({
      orderBy: {
        idAlmacen: 'asc',
      },
      include: {
        ubicaciones: true,
      },
    });
  }

  async findOne(idAlmacen: number) {
    const warehouse = await this.prisma.almacen.findUnique({
      where: { idAlmacen },
      include: {
        ubicaciones: true,
      },
    });

    if (!warehouse) {
      throw new NotFoundException('Almacén no encontrado');
    }

    return warehouse;
  }

  async create(input: CreateWarehouseInput) {
    return this.prisma.almacen.create({
      data: {
        nombre: input.nombre,
        direccion: input.direccion,
        descripcion: input.descripcion,
      },
      include: {
        ubicaciones: true,
      },
    });
  }

  async update(input: UpdateWarehouseInput) {
    await this.findOne(input.idAlmacen);

    return this.prisma.almacen.update({
      where: { idAlmacen: input.idAlmacen },
      data: {
        nombre: input.nombre,
        direccion: input.direccion,
        descripcion: input.descripcion,
      },
      include: {
        ubicaciones: true,
      },
    });
  }

  async deactivate(idAlmacen: number) {
    await this.findOne(idAlmacen);

    return this.prisma.almacen.update({
      where: { idAlmacen },
      data: {
        estado: 'INACTIVO',
      },
      include: {
        ubicaciones: true,
      },
    });
  }

  async createLocation(input: CreateLocationInput) {
    await this.findOne(input.idAlmacen);

    return this.prisma.ubicacionAlmacen.create({
      data: {
        idAlmacen: input.idAlmacen,
        pasillo: input.pasillo,
        estante: input.estante,
        nivel: input.nivel,
        descripcion: input.descripcion,
      },
    });
  }

  async updateLocation(input: UpdateLocationInput) {
    const location = await this.prisma.ubicacionAlmacen.findUnique({
      where: { idUbicacion: input.idUbicacion },
    });

    if (!location) {
      throw new NotFoundException('Ubicación no encontrada');
    }

    return this.prisma.ubicacionAlmacen.update({
      where: { idUbicacion: input.idUbicacion },
      data: {
        pasillo: input.pasillo,
        estante: input.estante,
        nivel: input.nivel,
        descripcion: input.descripcion,
      },
    });
  }

  async deleteLocation(idUbicacion: number) {
    const location = await this.prisma.ubicacionAlmacen.findUnique({
      where: { idUbicacion },
    });

    if (!location) {
      throw new NotFoundException('Ubicación no encontrada');
    }

    return this.prisma.ubicacionAlmacen.delete({
      where: { idUbicacion },
    });
  }
}
