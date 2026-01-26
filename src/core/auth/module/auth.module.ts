import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';

import { TokenService } from '../service/token-service';
import { PermissionCacheService } from '../service/permission-cache.service';
import { JwtAuthGuard } from '../guard/jwt-auth-guard';
import { DynamicRbacGuard } from '../guard/dynamic-rbac.guard';
import { ScopePermissionGuard } from '../guard/scope-permission.guard';
import { CustomerGuard } from '../guard/customer.guard';
import { VendorGuard } from '../guard/vendor.guard';
import { AdminGuard } from '../guard/admin.guard';
import { User } from 'src/modules/personnel-management/user/entity/user.entity';
import { Admin } from 'src/modules/personnel-management/admin/entity/admin.entity';
import { Customer } from 'src/modules/personnel-management/customer/entity/customer.entity';
import { Vendor } from 'src/modules/personnel-management/vendor/entity/vendor.entity';
import { VendorKYC } from 'src/modules/personnel-management/vendor/entity/vendor-kyc.entity';
import { VendorBankInfo } from 'src/modules/personnel-management/vendor/entity/vendor-bank-info.entity';
import { Role } from 'src/modules/personnel-management/role/entity/role.entity';
import { Permission } from 'src/modules/personnel-management/permission/entity/permission.entity';
import { PermissionService } from 'src/modules/personnel-management/permission/service/permission.service';
import { RoleService } from 'src/modules/personnel-management/role/service/role.service';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([
      User,
      Admin,
      Customer,
      Vendor,
      VendorKYC,
      VendorBankInfo,
      Role,
      Permission,
    ]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: configService.get<string>('JWT_ACCESS_EXPIRES_IN', '15m'),
        },
      }),
    }),
  ],
  controllers: [],
  providers: [
    TokenService,
    PermissionCacheService,
    PermissionService,
    RoleService,
    JwtAuthGuard,
    CustomerGuard,
    VendorGuard,
    AdminGuard,
    DynamicRbacGuard,
    ScopePermissionGuard,
  ],
  exports: [
    TokenService,
    JwtAuthGuard,
    CustomerGuard,
    VendorGuard,
    AdminGuard,
    DynamicRbacGuard,
    ScopePermissionGuard,
    PermissionService,
    RoleService,
    PermissionCacheService,
  ],
})
export class AuthModule {}
