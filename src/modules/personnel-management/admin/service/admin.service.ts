import * as argon2 from 'argon2';
import {
  ConflictException,
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Admin } from '../entity/admin.entity';
import { User } from '../../user/entity/user.entity';
import { Role } from '../../role/entity/role.entity';
import { Repository } from 'typeorm';
import { CloudinaryService } from 'src/core/upload/service/cloudinary.service';
import { AdminProfileDto } from '../dto/admin-profile.dto';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(Admin)
    private adminRepository: Repository<Admin>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Role)
    private roleRepository: Repository<Role>,
    private cloudinaryService: CloudinaryService,
  ) {}

  async getProfile(userId: number): Promise<AdminProfileDto> {
    const admin = await this.adminRepository.findOne({
      where: { userId },
      relations: ['user', 'role', 'role.permissions'],
    });

    if (!admin) {
      throw new NotFoundException('Admin profile not found');
    }

    return {
      id: admin.id,
      email: admin.user.email,
      firstName: admin.user.firstName,
      lastName: admin.user.lastName,
      phone: admin.user.phone,
      role: {
        id: admin.role.id,
        name: admin.role.name,
        permissions: admin.role.permissions.map((p) => p.displayName),
      },
      department: admin.department,
      employeeNumber: admin.employeeNumber,
      image: admin.user.image,
      lastLoginAt: admin.user.lastLoginAt,
      joinedAt: admin.createdAt,
    };
  }

  async updateProfile(
    userId: number,
    dto: Partial<AdminProfileDto>,
  ): Promise<AdminProfileDto> {
    const admin = await this.adminRepository.findOne({
      where: { userId },
      relations: ['user', 'role', 'role.permissions'],
    });

    if (!admin) {
      throw new NotFoundException('Admin profile not found');
    }

    // Update user fields
    if (dto.firstName) admin.user.firstName = dto.firstName;
    if (dto.lastName) admin.user.lastName = dto.lastName;
    if (dto.phone) admin.user.phone = dto.phone;

    // Update admin fields
    if (dto.department) admin.department = dto.department;
    if (dto.employeeNumber) admin.employeeNumber = dto.employeeNumber;

    await this.userRepository.save(admin.user);
    await this.adminRepository.save(admin);

    return this.getProfile(userId);
  }
}
