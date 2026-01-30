import { IsString, IsNumber, IsOptional, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateInventoryDto {
  @ApiPropertyOptional({
    description: 'Update reorder level - minimum stock before reorder alert',
    example: 25,
    minimum: 0,
    type: Number,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  reorderLevel?: number;

  @ApiPropertyOptional({
    description: 'Update storage location',
    example: 'Warehouse B, Shelf 3',
    type: String,
  })
  @IsOptional()
  @IsString()
  location?: string;
}
