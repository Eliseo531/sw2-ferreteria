import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUnitInput } from './dto/create-unit.input';
import { UpdateUnitInput } from './dto/update-unit.input';

@Injectable()
export class UnitsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.unidadMedida.findMany({
      orderBy: {
        idUnidad: 'asc',
      },
    });
  }

  async findOne(idUnidad: number) {
    const unit = await this.prisma.unidadMedida.findUnique({
      where: { idUnidad },
    });

    if (!unit) {
      throw new NotFoundException('Unidad de medida no encontrada');
    }

    return unit;
  }

  async create(input: CreateUnitInput) {
    const existingUnit = await this.prisma.unidadMedida.findUnique({
      where: { abreviatura: input.abreviatura },
    });

    if (existingUnit) {
      throw new BadRequestException('Ya existe una unidad con esa abreviatura');
    }

    return this.prisma.unidadMedida.create({
      data: {
        nombre: input.nombre,
        abreviatura: input.abreviatura,
      },
    });
  }

  async update(input: UpdateUnitInput) {
    await this.findOne(input.idUnidad);

    return this.prisma.unidadMedida.update({
      where: { idUnidad: input.idUnidad },
      data: {
        nombre: input.nombre,
        abreviatura: input.abreviatura,
      },
    });
  }

  async delete(idUnidad: number) {
    await this.findOne(idUnidad);

    return this.prisma.unidadMedida.delete({
      where: { idUnidad },
    });
  }
}
