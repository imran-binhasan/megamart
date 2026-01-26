import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AdminAuthService } from '../service/admin-auth.service';
import { AdminRegisterDto } from '../dto/admin-register.dto';
import { AdminLoginDto } from '../dto/admin-login.dto';
import { AdminAuthResponseDto } from '../dto/admin-auth-response.dto';
import { Public } from 'src/core/auth/decorator/auth.decorator';
import { AdminGuard } from 'src/core/auth/guard/admin.guard';
import { ScopePermissionGuard } from 'src/core/auth/guard/scope-permission.guard';
import { JwtAuthGuard } from 'src/core/auth/guard/jwt-auth-guard';
import { RequirePermission } from 'src/core/auth/decorator/permission.decorator';
import { CurrentUser } from 'src/core/auth/decorator/current-user.decorator';
import { RefreshTokenDto } from 'src/core/auth/dto/refresh-token.dto';
import { TokenService } from 'src/core/auth/service/token-service';
import {
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { IsEmail, IsString, MinLength, IsOptional } from 'class-validator';

// DTOs
class ResetAdminPasswordDto {
  @IsEmail()
  targetAdminEmail: string;

  @IsString()
  @MinLength(8)
  newPassword: string;

  @IsOptional()
  @IsString()
  verificationNote?: string;
}

@ApiTags('Auth - Admin')
@Controller({ path: 'auth/admin', version: '1' })
export class AdminAuthController {
  constructor(
    private adminAuthService: AdminAuthService,
    private tokenService: TokenService,
  ) {}

  // ========== AUTHENTICATION ==========

  @Post('login')
  @Public()
  @ApiOperation({ summary: 'Admin login' })
  @ApiResponse({
    status: 200,
    description: 'Admin logged in successfully',
  })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  async login(@Body() dto: AdminLoginDto): Promise<AdminAuthResponseDto> {
    return this.adminAuthService.login(dto);
  }

  @Post('create')
  @UseGuards(AdminGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Create new admin account (Admin only)',
    description:
      'Super-admin can create new admin accounts with specified roles',
  })
  @ApiResponse({
    status: 201,
    description: 'Admin created successfully',
  })
  @ApiResponse({ status: 403, description: 'Insufficient permissions' })
  @ApiResponse({ status: 409, description: 'Email or phone already exists' })
  async create(@Body() dto: AdminRegisterDto): Promise<AdminAuthResponseDto> {
    return this.adminAuthService.register(dto);
  }

  // ========== ADMIN MANAGEMENT (Super-admin only) ==========

  /**
   * Reset another admin's password (Super-admin only)
   *
   * Enterprise security: Admin passwords can only be reset by super-admins
   * with proper verification. This prevents self-service password reset
   * which could be exploited if an admin's email is compromised.
   *
   * @security Requires: 'manage:admins' permission with 'all' scope
   */
  @Post('reset-password')
  @UseGuards(JwtAuthGuard, AdminGuard, ScopePermissionGuard)
  @ApiBearerAuth()
  @RequirePermission({
    action: 'manage',
    resource: 'admins',
    allowedScopes: ['all'],
  })
  @ApiOperation({
    summary: 'Reset another admin password (Super-admin only)',
  })
  @ApiResponse({
    status: 200,
    description: 'Admin password reset successfully',
  })
  @ApiResponse({ status: 403, description: 'Insufficient permissions' })
  async resetAdminPassword(
    @CurrentUser('id') superAdminId: number,
    @Body() dto: ResetAdminPasswordDto,
  ) {
    return this.adminAuthService.resetAdminPassword(
      superAdminId,
      dto.targetAdminEmail,
      dto.newPassword,
      dto.verificationNote,
    );
  }

  @Post('refresh')
  @Public()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Refresh admin access token' })
  @ApiResponse({
    status: 200,
    description: 'New tokens generated',
  })
  @ApiResponse({ status: 401, description: 'Invalid refresh token' })
  refreshToken(@Body() dto: RefreshTokenDto) {
    const payload = this.tokenService.verifyRefreshToken(dto.refreshToken);
    const tokens = this.tokenService.generateTokenPair({
      sub: payload.sub,
      email: payload.email,
      type: payload.type,
      ...(payload.type === 'admin' && {
        roleId: payload.roleId,
        permissions: payload.permissions,
      }),
    });
    return {
      accessToken: tokens.access_token,
      refreshToken: tokens.refresh_token,
      tokenType: 'Bearer',
      expiresIn: tokens.expires_in,
    };
  }
}
