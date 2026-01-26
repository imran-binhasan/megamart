import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Vendor } from '../entity/vendor.entity';
import { User } from '../../user/entity/user.entity';
import { VendorProfileDto } from '../dto/vendor-profile.dto';

@Injectable()
export class VendorService {
  constructor(
    @InjectRepository(Vendor)
    private vendorRepository: Repository<Vendor>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async getProfile(userId: number): Promise<VendorProfileDto> {
    const vendor = await this.vendorRepository.findOne({
      where: { userId },
      relations: ['user'],
    });

    if (!vendor) {
      throw new NotFoundException('Vendor profile not found');
    }

    return {
      id: vendor.id,
      email: vendor.user.email,
      firstName: vendor.user.firstName,
      lastName: vendor.user.lastName,
      phone: vendor.user.phone,
      shopName: vendor.shopName,
      shopSlug: vendor.shopSlug,
      shopDescription: vendor.shopDescription,
      businessEmail: vendor.businessEmail,
      businessPhone: vendor.businessPhone,
      image: vendor.user.image,
      status: vendor.status,
      ratings: {
        averageRating: vendor.averageRating || 0,
        totalReviews: vendor.totalReviews,
      },
      joinedAt: vendor.createdAt,
    };
  }

  async updateProfile(
    userId: number,
    dto: Partial<VendorProfileDto>,
  ): Promise<VendorProfileDto> {
    const vendor = await this.vendorRepository.findOne({
      where: { userId },
      relations: ['user'],
    });

    if (!vendor) {
      throw new NotFoundException('Vendor profile not found');
    }

    // Update user fields
    if (dto.firstName) vendor.user.firstName = dto.firstName;
    if (dto.lastName) vendor.user.lastName = dto.lastName;
    if (dto.phone) vendor.user.phone = dto.phone;

    // Update vendor fields
    if (dto.shopDescription) vendor.shopDescription = dto.shopDescription;
    if (dto.businessEmail) vendor.businessEmail = dto.businessEmail;
    if (dto.businessPhone) vendor.businessPhone = dto.businessPhone;

    await this.userRepository.save(vendor.user);
    await this.vendorRepository.save(vendor);

    return this.getProfile(userId);
  }
}
