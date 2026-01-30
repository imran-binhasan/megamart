import {
  IsString,
  IsNumber,
  IsOptional,
  Min,
  IsNotEmpty,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateInventoryDto {
  @ApiProperty({
    description: 'Product ID to track inventory for',
    example: 10,
    type: Number,
  })
  @IsNumber()
  @IsNotEmpty()
  productId: number;

  @ApiProperty({
    description: 'Initial stock quantity',
    example: 100,
    minimum: 0,
    type: Number,
  })
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  initialStock: number;

  @ApiPropertyOptional({
    description: 'Reorder level - minimum stock before reorder alert',
    example: 20,
    minimum: 0,
    type: Number,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  reorderLevel?: number;

  @ApiPropertyOptional({
    description: 'Storage location of inventory',
    example: 'Warehouse A, Shelf 5',
    type: String,
  })
  @IsOptional()
  @IsString()
  location?: string;

  @ApiPropertyOptional({
    description: 'Reason for inventory creation',
    example: 'Initial stock from supplier',
    type: String,
  })
  @IsOptional()
  @IsString()
  reason?: string;
}
