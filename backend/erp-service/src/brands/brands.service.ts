import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBrandInput } from './dto/create-brand.input';
import { UpdateBrandInput } from './dto/update-brand.input';

@Injectable()
export class BrandsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.marca.findMany({
      orderBy: {
        idMarca: 'asc',
      },
    });
  }

  async findOne(idMarca: number) {
    const brand = await this.prisma.marca.findUnique({
      where: { idMarca },
    });

    if (!brand) {
      throw new NotFoundException('Marca no encontrada');
    }

    return brand;
  }

  async create(input: CreateBrandInput) {
    const existingBrand = await this.prisma.marca.findUnique({
      where: { nombre: input.nombre },
    });

    if (existingBrand) {
      throw new BadRequestException('Ya existe una marca con ese nombre');
    }

    return this.prisma.marca.create({
      data: {
        nombre: input.nombre,
        descripcion: input.descripcion,
      },
    });
  }

  async update(input: UpdateBrandInput) {
    await this.findOne(input.idMarca);

    return this.prisma.marca.update({
      where: { idMarca: input.idMarca },
      data: {
        nombre: input.nombre,
        descripcion: input.descripcion,
      },
    });
  }

  async deactivate(idMarca: number) {
    await this.findOne(idMarca);

    return this.prisma.marca.update({
      where: { idMarca },
      data: {
        estado: 'INACTIVO',
      },
    });
  }
}
