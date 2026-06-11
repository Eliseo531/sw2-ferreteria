import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateRoleInput } from './dto/create-role.input';
import { UpdateRoleInput } from './dto/update-role.input';

@Injectable()
export class RolesService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.rol.findMany({
      orderBy: {
        idRol: 'asc',
      },
    });
  }

  async findOne(idRol: number) {
    const role = await this.prisma.rol.findUnique({
      where: { idRol },
    });

    if (!role) {
      throw new NotFoundException('Rol no encontrado');
    }

    return role;
  }

  async create(input: CreateRoleInput) {
    return this.prisma.rol.create({
      data: {
        nombre: input.nombre,
        descripcion: input.descripcion,
      },
    });
  }

  async update(input: UpdateRoleInput) {
    await this.findOne(input.idRol);

    return this.prisma.rol.update({
      where: { idRol: input.idRol },
      data: {
        nombre: input.nombre,
        descripcion: input.descripcion,
      },
    });
  }

  async delete(idRol: number) {
    await this.findOne(idRol);

    return this.prisma.rol.delete({
      where: { idRol },
    });
  }
}
