import { Module } from '@nestjs/common';
import { CloudinaryService } from '../service/cloudinary.service';
import { UploadService } from '../service/upload.service';
import { UploadValidationService } from '../service/upload-validation.service';
import { ImageOptimizationService } from '../service/image-optimization.service';
import { UploadController } from '../controller/upload.controller';
import { RedisModule } from '../../redis/module/redis.module';
import { AuthModule } from '../../auth/module/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/modules/personnel-management/user/entity/user.entity';

@Module({
  imports: [RedisModule, AuthModule, TypeOrmModule.forFeature([User])],
  controllers: [UploadController],
  providers: [
    CloudinaryService,
    UploadService,
    UploadValidationService,
    ImageOptimizationService,
  ],
  exports: [
    CloudinaryService,
    UploadService,
    UploadValidationService,
    ImageOptimizationService,
  ],
})
export class UploadModule {}
