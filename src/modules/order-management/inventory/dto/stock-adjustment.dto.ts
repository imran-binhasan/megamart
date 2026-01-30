import {
  IsString,
  IsNumber,
  IsOptional,
  IsEnum,
  IsNotEmpty,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { TransactionType } from '../entity/inventory-transaction.entity';

export class StockAdjustmentDto {
  @ApiProperty({
    description: 'Type of stock adjustment (IN, OUT, ADJUSTMENT)',
    enum: TransactionType,
    example: TransactionType.ADJUSTMENT,
  })
  @IsEnum(TransactionType)
  type: TransactionType;

  @ApiProperty({
    description: 'Quantity to adjust',
    example: 10,
    minimum: 0,
    type: Number,
  })
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  quantity: number;

  @ApiPropertyOptional({
    description: 'Reason for adjustment (e.g., damage, recount, return)',
    example: 'Stock recount discrepancy',
    type: String,
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  reason?: string;

  @ApiPropertyOptional({
    description: 'Reference ID (order ID, return ID, etc.)',
    example: 123,
    type: Number,
  })
  @IsOptional()
  @IsNumber()
  referenceId?: number;
}

// src/inventory/dto/inventory-query.dto.ts
