import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Inventory } from '../entity/inventory.entity';
import { InventoryTransaction } from '../entity/inventory-transaction.entity';
import { AuthModule } from 'src/core/auth/module/auth.module';
import { InventoryController } from '../controller/inventory.controller';
import { InventoryService } from '../service/inventory.service';
import { Product } from 'src/modules/product-management/product/entity/product.entity';
import { User } from 'src/modules/personnel-management/user/entity/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Inventory, InventoryTransaction, Product, User]),
    AuthModule,
  ],
  controllers: [InventoryController],
  providers: [InventoryService],
  exports: [InventoryService],
})
export class InventoryModule {}
