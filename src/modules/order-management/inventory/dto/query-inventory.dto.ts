import { IsOptional, IsString, IsBoolean, IsNumber } from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { PaginationQuery } from 'src/shared/dto/pagination_query.dto';

export class InventoryQueryDto extends PaginationQuery {
  @ApiPropertyOptional({
    description: 'Filter inventory by product ID',
    example: 10,
    type: Number,
  })
  @IsOptional()
  @Transform(({ value }) => value && Number(value))
  @IsNumber()
  productId?: number;

  @ApiPropertyOptional({
    description: 'Filter inventory by storage location',
    example: 'Warehouse A, Shelf 5',
    type: String,
  })
  @IsOptional()
  @IsString()
  location?: string;

  @ApiPropertyOptional({
    description: 'Filter only low stock items (below reorder level)',
    example: true,
    type: Boolean,
  })
  @IsOptional()
  @Transform(({ value }) => {
    if (value === 'true') return true;
    if (value === 'false') return false;
    return undefined;
  })
  @IsBoolean()
  lowStock?: boolean;
}
