import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBlockchainRecordInput } from './dto/create-blockchain-record.input';
import { MarkBlockchainRecordInput } from './dto/mark-blockchain-record.input';

@Injectable()
export class BlockchainService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.registroBlockchain.findMany({
      orderBy: {
        idRegistro: 'desc',
      },
    });
  }

  async findOne(idRegistro: number) {
    const record = await this.prisma.registroBlockchain.findUnique({
      where: { idRegistro },
    });

    if (!record) {
      throw new NotFoundException('Registro blockchain no encontrado');
    }

    return record;
  }

  async create(input: CreateBlockchainRecordInput) {
    return this.prisma.registroBlockchain.create({
      data: {
        tipoDocumento: input.tipoDocumento,
        idReferencia: input.idReferencia,
        hashDocumento: input.hashDocumento,
        redBlockchain: input.redBlockchain,
        txHash: input.txHash,
        estado: input.txHash ? 'REGISTRADO' : 'PENDIENTE',
      },
    });
  }

  async markAsRegistered(input: MarkBlockchainRecordInput) {
    await this.findOne(input.idRegistro);

    return this.prisma.registroBlockchain.update({
      where: {
        idRegistro: input.idRegistro,
      },
      data: {
        redBlockchain: input.redBlockchain,
        txHash: input.txHash,
        estado: 'REGISTRADO',
      },
    });
  }

  async markAsError(idRegistro: number) {
    await this.findOne(idRegistro);

    return this.prisma.registroBlockchain.update({
      where: {
        idRegistro,
      },
      data: {
        estado: 'ERROR',
      },
    });
  }
}
