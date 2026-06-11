import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSupplierInput } from './dto/create-supplier.input';
import { UpdateSupplierInput } from './dto/update-supplier.input';

@Injectable()
export class SuppliersService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.proveedor.findMany({
      orderBy: {
        idProveedor: 'asc',
      },
    });
  }

  async findOne(idProveedor: number) {
    const supplier = await this.prisma.proveedor.findUnique({
      where: { idProveedor },
    });

    if (!supplier) {
      throw new NotFoundException('Proveedor no encontrado');
    }

    return supplier;
  }

  async create(input: CreateSupplierInput) {
    return this.prisma.proveedor.create({
      data: {
        nombre: input.nombre,
        nit: input.nit,
        telefono: input.telefono,
        email: input.email,
        direccion: input.direccion,
      },
    });
  }

  async update(input: UpdateSupplierInput) {
    await this.findOne(input.idProveedor);

    return this.prisma.proveedor.update({
      where: { idProveedor: input.idProveedor },
      data: {
        nombre: input.nombre,
        nit: input.nit,
        telefono: input.telefono,
        email: input.email,
        direccion: input.direccion,
      },
    });
  }

  async deactivate(idProveedor: number) {
    await this.findOne(idProveedor);

    return this.prisma.proveedor.update({
      where: { idProveedor },
      data: {
        estado: 'INACTIVO',
      },
    });
  }
}
