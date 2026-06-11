import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateDocumentInput } from './dto/create-document.input';
import { UpdateDocumentInput } from './dto/update-document.input';

@Injectable()
export class DocumentsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.documento.findMany({
      orderBy: {
        idDocumento: 'desc',
      },
    });
  }

  async findOne(idDocumento: number) {
    const document = await this.prisma.documento.findUnique({
      where: { idDocumento },
    });

    if (!document) {
      throw new NotFoundException('Documento no encontrado');
    }

    return document;
  }

  async findByProduct(idProducto: number) {
    const product = await this.prisma.producto.findUnique({
      where: { idProducto },
    });

    if (!product) {
      throw new NotFoundException('Producto no encontrado');
    }

    return this.prisma.documento.findMany({
      where: {
        idProducto,
        estado: 'ACTIVO',
      },
      orderBy: {
        idDocumento: 'desc',
      },
    });
  }

  async findBySupplier(idProveedor: number) {
    const supplier = await this.prisma.proveedor.findUnique({
      where: { idProveedor },
    });

    if (!supplier) {
      throw new NotFoundException('Proveedor no encontrado');
    }

    return this.prisma.documento.findMany({
      where: {
        idProveedor,
        estado: 'ACTIVO',
      },
      orderBy: {
        idDocumento: 'desc',
      },
    });
  }

  async create(input: CreateDocumentInput) {
    if (!input.idProducto && !input.idProveedor) {
      throw new BadRequestException(
        'El documento debe estar relacionado a un producto o a un proveedor',
      );
    }

    if (input.idProducto) {
      const product = await this.prisma.producto.findUnique({
        where: { idProducto: input.idProducto },
      });

      if (!product) {
        throw new NotFoundException('Producto no encontrado');
      }
    }

    if (input.idProveedor) {
      const supplier = await this.prisma.proveedor.findUnique({
        where: { idProveedor: input.idProveedor },
      });

      if (!supplier) {
        throw new NotFoundException('Proveedor no encontrado');
      }
    }

    return this.prisma.documento.create({
      data: {
        idProducto: input.idProducto,
        idProveedor: input.idProveedor,
        nombre: input.nombre,
        tipoDocumento: input.tipoDocumento as any,
        urlArchivo: input.urlArchivo,
        fechaVencimiento: input.fechaVencimiento
          ? new Date(input.fechaVencimiento)
          : undefined,
      },
    });
  }

  async update(input: UpdateDocumentInput) {
    await this.findOne(input.idDocumento);

    if (input.idProducto) {
      const product = await this.prisma.producto.findUnique({
        where: { idProducto: input.idProducto },
      });

      if (!product) {
        throw new NotFoundException('Producto no encontrado');
      }
    }

    if (input.idProveedor) {
      const supplier = await this.prisma.proveedor.findUnique({
        where: { idProveedor: input.idProveedor },
      });

      if (!supplier) {
        throw new NotFoundException('Proveedor no encontrado');
      }
    }

    return this.prisma.documento.update({
      where: {
        idDocumento: input.idDocumento,
      },
      data: {
        idProducto: input.idProducto,
        idProveedor: input.idProveedor,
        nombre: input.nombre,
        tipoDocumento: input.tipoDocumento as any,
        urlArchivo: input.urlArchivo,
        fechaVencimiento: input.fechaVencimiento
          ? new Date(input.fechaVencimiento)
          : undefined,
      },
    });
  }

  async deactivate(idDocumento: number) {
    await this.findOne(idDocumento);

    return this.prisma.documento.update({
      where: {
        idDocumento,
      },
      data: {
        estado: 'INACTIVO',
      },
    });
  }
}
