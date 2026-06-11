import { Injectable, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    const users = await this.prisma.usuario.findMany({
      orderBy: {
        idUsuario: 'asc',
      },
      include: {
        roles: {
          include: {
            rol: true,
          },
        },
      },
    });

    return users.map((user) => ({
      ...user,
      roles: user.roles.map((userRole) => ({
        idRol: userRole.rol.idRol,
        nombre: userRole.rol.nombre,
        descripcion: userRole.rol.descripcion,
      })),
    }));
  }

  async findOne(idUsuario: number) {
    return this.findOneWithRoles(idUsuario);
  }

  async findByEmail(email: string) {
    return this.prisma.usuario.findUnique({
      where: { email },
      include: {
        roles: {
          include: {
            rol: true,
          },
        },
      },
    });
  }

  async create(input: CreateUserInput) {
    const hashedPassword = await bcrypt.hash(input.password, 10);

    return this.prisma.usuario.create({
      data: {
        nombre: input.nombre,
        apellido: input.apellido,
        email: input.email,
        password: hashedPassword,
        telefono: input.telefono,
      },
    });
  }

  async update(input: UpdateUserInput) {
    await this.findOne(input.idUsuario);

    return this.prisma.usuario.update({
      where: { idUsuario: input.idUsuario },
      data: {
        nombre: input.nombre,
        apellido: input.apellido,
        email: input.email,
        telefono: input.telefono,
      },
    });
  }

  async deactivate(idUsuario: number) {
    await this.findOne(idUsuario);

    return this.prisma.usuario.update({
      where: { idUsuario },
      data: {
        estado: 'INACTIVO',
      },
    });
  }

  async assignRoleToUser(idUsuario: number, idRol: number) {
    await this.findOne(idUsuario);

    const role = await this.prisma.rol.findUnique({
      where: { idRol },
    });

    if (!role) {
      throw new NotFoundException('Rol no encontrado');
    }

    await this.prisma.usuarioRol.upsert({
      where: {
        idUsuario_idRol: {
          idUsuario,
          idRol,
        },
      },
      update: {},
      create: {
        idUsuario,
        idRol,
      },
    });

    return this.findOneWithRoles(idUsuario);
  }

  async findOneWithRoles(idUsuario: number) {
    const user = await this.prisma.usuario.findUnique({
      where: { idUsuario },
      include: {
        roles: {
          include: {
            rol: true,
          },
        },
      },
    });

    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    return {
      ...user,
      roles: user.roles.map((userRole) => ({
        idRol: userRole.rol.idRol,
        nombre: userRole.rol.nombre,
        descripcion: userRole.rol.descripcion,
      })),
    };
  }
}
