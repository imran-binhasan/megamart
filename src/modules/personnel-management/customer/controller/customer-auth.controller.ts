import { Body, Controller, Post } from '@nestjs/common';
import { CustomerAuthService } from '../service/customer-auth.service';
import { CustomerOAuthService } from '../service/customer-oauth.service';
import { CustomerRegisterDto } from '../dto/customer-register.dto';
import { CustomerLoginDto } from '../dto/customer-login.dto';
import { CustomerAuthResponseDto } from '../dto/customer-auth-response.dto';
import { Public } from 'src/core/auth/decorator/auth.decorator';
import { RefreshTokenDto } from 'src/core/auth/dto/refresh-token.dto';
import { TokenService } from 'src/core/auth/service/token-service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Auth - Customer')
@Controller({ path: 'auth/customer', version: '1' })
export class CustomerAuthController {
  constructor(
    private customerAuthService: CustomerAuthService,
    private customerOAuthService: CustomerOAuthService,
    private tokenService: TokenService,
  ) {}

  @Post('register')
  @Public()
  @ApiOperation({ summary: 'Register new customer account' })
  @ApiResponse({
    status: 201,
    description: 'Customer registered successfully',
    schema: {
      properties: {
        tokens: {
          type: 'object',
          properties: {
            accessToken: { type: 'string' },
            refreshToken: { type: 'string' },
            tokenType: { type: 'string', example: 'Bearer' },
            expiresIn: { type: 'number' },
          },
        },
        user: {
          type: 'object',
          properties: {
            id: { type: 'number' },
            email: { type: 'string' },
            firstName: { type: 'string' },
            lastName: { type: 'string' },
            phone: { type: 'string' },
            rewardPoints: { type: 'number' },
            tier: { type: 'string' },
          },
        },
        userType: { type: 'string', example: 'customer' },
      },
    },
  })
  async register(
    @Body() dto: CustomerRegisterDto,
  ): Promise<CustomerAuthResponseDto> {
    return this.customerAuthService.register(dto);
  }

  @Post('login')
  @Public()
  @ApiOperation({ summary: 'Customer login' })
  @ApiResponse({
    status: 200,
    description: 'Customer logged in successfully',
    schema: {
      properties: {
        tokens: {
          type: 'object',
          properties: {
            accessToken: { type: 'string' },
            refreshToken: { type: 'string' },
            tokenType: { type: 'string', example: 'Bearer' },
            expiresIn: { type: 'number' },
          },
        },
        user: {
          type: 'object',
          properties: {
            id: { type: 'number' },
            email: { type: 'string' },
            firstName: { type: 'string' },
            lastName: { type: 'string' },
            phone: { type: 'string' },
            rewardPoints: { type: 'number' },
            tier: { type: 'string' },
          },
        },
        userType: { type: 'string', example: 'customer' },
      },
    },
  })
  async login(@Body() dto: CustomerLoginDto): Promise<CustomerAuthResponseDto> {
    return this.customerAuthService.login(dto);
  }

  @Post('google')
  @Public()
  @ApiOperation({ summary: 'Google OAuth authentication for customers' })
  @ApiResponse({
    status: 200,
    description: 'Customer authenticated via Google',
  })
  @ApiResponse({ status: 400, description: 'Invalid Google token' })
  async googleAuth(@Body('idToken') idToken: string) {
    return this.customerOAuthService.googleAuth(idToken);
  }

  @Post('facebook')
  @Public()
  @ApiOperation({ summary: 'Facebook OAuth authentication for customers' })
  @ApiResponse({
    status: 200,
    description: 'Customer authenticated via Facebook',
  })
  @ApiResponse({ status: 400, description: 'Invalid Facebook token' })
  async facebookAuth(@Body('accessToken') accessToken: string) {
    return this.customerOAuthService.facebookAuth(accessToken);
  }

  @Post('refresh')
  @Public()
  @ApiOperation({ summary: 'Refresh customer access token' })
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
    });
    return {
      accessToken: tokens.access_token,
      refreshToken: tokens.refresh_token,
      tokenType: 'Bearer',
      expiresIn: tokens.expires_in,
    };
  }
}
