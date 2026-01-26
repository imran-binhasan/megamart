import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Role } from '../../role/entity/role.entity';
import { User } from '../../user/entity/user.entity';
import { CloudinaryService } from 'src/core/upload/service/cloudinary.service';
import { Admin } from '../entity/admin.entity';
import { AdminController } from '../controller/admin.controller';
import { AdminAuthController } from '../controller/admin-auth.controller';
import { AdminProfileController } from '../controller/admin-profile.controller';
import { AdminService } from '../service/admin.service';
import { AdminAuthService } from '../service/admin-auth.service';
import { AuthModule } from 'src/core/auth/module/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([Admin, User, Role]), AuthModule],
  controllers: [AdminController, AdminAuthController, AdminProfileController],
  providers: [AdminService, AdminAuthService, CloudinaryService],
  exports: [AdminService, AdminAuthService],
})
export class AdminModule {}
