import { Field, InputType, Int } from '@nestjs/graphql';
import {
  IsDateString,
  IsIn,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

@InputType()
export class CreateDocumentInput {
  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsInt()
  idProducto?: number;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsInt()
  idProveedor?: number;

  @Field()
  @IsNotEmpty()
  @IsString()
  nombre!: string;

  @Field()
  @IsIn([
    'MANUAL_TECNICO',
    'FICHA_SEGURIDAD',
    'CERTIFICADO_CALIDAD',
    'GARANTIA',
    'CONTRATO_PROVEEDOR',
    'FACTURA_ESCANEADA',
    'COMPROBANTE_ENTREGA',
  ])
  tipoDocumento!: string;

  @Field()
  @IsNotEmpty()
  @IsString()
  urlArchivo!: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsDateString()
  fechaVencimiento?: string;
}
