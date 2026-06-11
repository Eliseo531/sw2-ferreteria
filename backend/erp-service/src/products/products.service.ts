import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductInput } from './dto/create-product.input';
import { UpdateProductInput } from './dto/update-product.input';

@Injectable()
export class ProductsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.producto.findMany({
      orderBy: { idProducto: 'asc' },
    });
  }

  async findOne(idProducto: number) {
    const product = await this.prisma.producto.findUnique({
      where: { idProducto },
    });

    if (!product) {
      throw new NotFoundException('Producto no encontrado');
    }

    return product;
  }

  private async validateRelations(input: {
    idCategoria?: number;
    idMarca?: number;
    idUnidad?: number;
    idUbicacion?: number;
  }) {
    if (input.idCategoria) {
      const category = await this.prisma.categoria.findUnique({
        where: { idCategoria: input.idCategoria },
      });

      if (!category) {
        throw new BadRequestException('La categoría no existe');
      }
    }

    if (input.idMarca) {
      const brand = await this.prisma.marca.findUnique({
        where: { idMarca: input.idMarca },
      });

      if (!brand) {
        throw new BadRequestException('La marca no existe');
      }
    }

    if (input.idUnidad) {
      const unit = await this.prisma.unidadMedida.findUnique({
        where: { idUnidad: input.idUnidad },
      });

      if (!unit) {
        throw new BadRequestException('La unidad de medida no existe');
      }
    }

    if (input.idUbicacion) {
      const location = await this.prisma.ubicacionAlmacen.findUnique({
        where: { idUbicacion: input.idUbicacion },
      });

      if (!location) {
        throw new BadRequestException('La ubicación de almacén no existe');
      }
    }
  }

  async create(input: CreateProductInput) {
    await this.validateRelations(input);

    if (input.codigoBarras) {
      const existingProduct = await this.prisma.producto.findUnique({
        where: { codigoBarras: input.codigoBarras },
      });

      if (existingProduct) {
        throw new BadRequestException(
          'Ya existe un producto con ese código de barras',
        );
      }
    }

    return this.prisma.producto.create({
      data: {
        idCategoria: input.idCategoria,
        idMarca: input.idMarca,
        idUnidad: input.idUnidad,
        idUbicacion: input.idUbicacion,
        codigoBarras: input.codigoBarras,
        nombre: input.nombre,
        descripcion: input.descripcion,
        precioVenta: input.precioVenta,
        precioCompraReferencia: input.precioCompraReferencia,
        stockActual: input.stockActual ?? 0,
        stockMinimo: input.stockMinimo ?? 0,
      },
    });
  }

  async update(input: UpdateProductInput) {
    await this.findOne(input.idProducto);
    await this.validateRelations(input);

    return this.prisma.producto.update({
      where: { idProducto: input.idProducto },
      data: {
        idCategoria: input.idCategoria,
        idMarca: input.idMarca,
        idUnidad: input.idUnidad,
        idUbicacion: input.idUbicacion,
        codigoBarras: input.codigoBarras,
        nombre: input.nombre,
        descripcion: input.descripcion,
        precioVenta: input.precioVenta,
        precioCompraReferencia: input.precioCompraReferencia,
        stockActual: input.stockActual,
        stockMinimo: input.stockMinimo,
      },
    });
  }

  async deactivate(idProducto: number) {
    await this.findOne(idProducto);

    return this.prisma.producto.update({
      where: { idProducto },
      data: {
        estado: 'INACTIVO',
      },
    });
  }
}
