import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BrandService } from '../service/brand.service';
import { BrandController } from '../controller/brand.controller';
import { Brand } from '../entity/brand.entity';
import { CloudinaryService } from 'src/core/upload/service/cloudinary.service';
import { AuthModule } from 'src/core/auth/module/auth.module';
import { User } from 'src/modules/personnel-management/user/entity/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Brand, User]), AuthModule],
  controllers: [BrandController],
  providers: [BrandService, CloudinaryService],
  exports: [BrandService],
})
export class BrandModule {}
