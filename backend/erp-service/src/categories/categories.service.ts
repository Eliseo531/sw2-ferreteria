import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCategoryInput } from './dto/create-category.input';
import { UpdateCategoryInput } from './dto/update-category.input';

@Injectable()
export class CategoriesService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.categoria.findMany({
      orderBy: {
        idCategoria: 'asc',
      },
    });
  }

  async findOne(idCategoria: number) {
    const category = await this.prisma.categoria.findUnique({
      where: { idCategoria },
    });

    if (!category) {
      throw new NotFoundException('Categoría no encontrada');
    }

    return category;
  }

  async create(input: CreateCategoryInput) {
    return this.prisma.categoria.create({
      data: {
        nombre: input.nombre,
        descripcion: input.descripcion,
      },
    });
  }

  async update(input: UpdateCategoryInput) {
    await this.findOne(input.idCategoria);

    return this.prisma.categoria.update({
      where: { idCategoria: input.idCategoria },
      data: {
        nombre: input.nombre,
        descripcion: input.descripcion,
      },
    });
  }

  async deactivate(idCategoria: number) {
    await this.findOne(idCategoria);

    return this.prisma.categoria.update({
      where: { idCategoria },
      data: {
        estado: 'INACTIVO',
      },
    });
  }
}
