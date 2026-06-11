import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCustomerInput } from './dto/create-customer.input';
import { UpdateCustomerInput } from './dto/update-customer.input';

@Injectable()
export class CustomersService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.cliente.findMany({
      orderBy: {
        idCliente: 'asc',
      },
    });
  }

  async findOne(idCliente: number) {
    const customer = await this.prisma.cliente.findUnique({
      where: { idCliente },
    });

    if (!customer) {
      throw new NotFoundException('Cliente no encontrado');
    }

    return customer;
  }

  async create(input: CreateCustomerInput) {
    return this.prisma.cliente.create({
      data: {
        nombre: input.nombre,
        apellido: input.apellido,
        nitCi: input.nitCi,
        telefono: input.telefono,
        email: input.email,
        direccion: input.direccion,
        tipoCliente: (input.tipoCliente as any) || 'MINORISTA',
      },
    });
  }

  async update(input: UpdateCustomerInput) {
    await this.findOne(input.idCliente);

    return this.prisma.cliente.update({
      where: { idCliente: input.idCliente },
      data: {
        nombre: input.nombre,
        apellido: input.apellido,
        nitCi: input.nitCi,
        telefono: input.telefono,
        email: input.email,
        direccion: input.direccion,
        tipoCliente: input.tipoCliente as any,
      },
    });
  }

  async deactivate(idCliente: number) {
    await this.findOne(idCliente);

    return this.prisma.cliente.update({
      where: { idCliente },
      data: {
        estado: 'INACTIVO',
      },
    });
  }
}
