import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Address, AddressOwnerType } from '../entity/address.entity';
import { UpdateAddressDto } from '../dto/update-address.dto';
import { AddressQueryDto } from '../dto/query-address.dto';
import { PaginatedServiceResponse } from 'src/shared/interface/api-response.interface';
import { Customer } from '../../customer/entity/customer.entity';
import { Vendor } from '../../vendor/entity/vendor.entity';
import { CreateAddressDto } from '../dto/create-address.dto';

@Injectable()
export class AddressService {
  constructor(
    @InjectRepository(Address)
    private readonly addressRepository: Repository<Address>,
    @InjectRepository(Customer)
    private readonly customerRepository: Repository<Customer>,
    @InjectRepository(Vendor)
    private readonly vendorRepository: Repository<Vendor>,
  ) {}

  async create(createAddressDto: CreateAddressDto): Promise<Address> {
    const { userId, ownerType, isDefault, ...restData } = createAddressDto;

    // Validate that userId is provided
    if (!userId) {
      throw new BadRequestException('userId must be provided');
    }

    // Validate that ownerType is provided
    if (!ownerType) {
      throw new BadRequestException('ownerType must be provided');
    }

    // Validate owner exists (customer or vendor)
    if (ownerType === AddressOwnerType.CUSTOMER) {
      const customer = await this.customerRepository.findOne({
        where: { user: { id: userId } },
      });
      if (!customer) {
        throw new NotFoundException(`Customer with userId ${userId} not found`);
      }
    } else if (ownerType === AddressOwnerType.VENDOR) {
      const vendor = await this.vendorRepository.findOne({
        where: { user: { id: userId } },
      });
      if (!vendor) {
        throw new NotFoundException(`Vendor with userId ${userId} not found`);
      }
    }

    // If this is going to be the default address, unset other defaults
    if (isDefault) {
      await this.unsetDefaultAddresses(ownerType, userId);
    }

    // Create address
    const addressPayload: Partial<Address> = {
      ...restData,
      ownerType,
      userId,
      isDefault: isDefault || false,
    };

    const address = this.addressRepository.create(addressPayload);
    const savedAddress = await this.addressRepository.save(address);
    return this.findOne(savedAddress.id);
  }

  async findAll(
    query: AddressQueryDto,
  ): Promise<PaginatedServiceResponse<Address>> {
    const { page = 1, limit = 10, search, customerId, type, isDefault } = query;

    // Validate pagination parameters
    if (page < 1 || limit < 1 || limit > 100) {
      throw new BadRequestException('Invalid pagination parameters');
    }

    const queryBuilder = this.addressRepository
      .createQueryBuilder('address')
      .leftJoinAndSelect('address.customer', 'customer')
      .select([
        'address.id',
        'address.street',
        'address.city',
        'address.state',
        'address.postalCode',
        'address.addressLine',
        'address.type',
        'address.country',
        'address.isDefault',
        'address.createdAt',
        'address.updatedAt',
        'customer.id',
        'customer.firstName',
        'customer.lastName',
        'customer.email',
      ]);

    // Apply filters
    if (search?.trim()) {
      queryBuilder.andWhere(
        '(address.street ILIKE :search OR address.city ILIKE :search OR address.state ILIKE :search OR address.addressLine ILIKE :search)',
        { search: `%${search.trim()}%` },
      );
    }

    if (customerId) {
      queryBuilder.andWhere('customer.id = :customerId', { customerId });
    }

    if (type) {
      queryBuilder.andWhere('address.type = :type', { type });
    }

    if (isDefault !== undefined) {
      queryBuilder.andWhere('address.isDefault = :isDefault', { isDefault });
    }

    // Apply pagination and ordering
    const [items, total] = await queryBuilder
      .skip((page - 1) * limit)
      .take(limit)
      .orderBy('address.isDefault', 'DESC')
      .addOrderBy('address.createdAt', 'DESC')
      .getManyAndCount();

    return {
      items,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: number): Promise<Address> {
    const address = await this.addressRepository.findOne({
      where: { id },
      relations: ['user'],
    });

    if (!address) {
      throw new NotFoundException(`Address with ID ${id} not found`);
    }

    return address;
  }

  async findByCustomer(customerId: number): Promise<Address[]> {
    const customer = await this.customerRepository.findOne({
      where: { id: customerId },
      relations: ['user'],
    });

    if (!customer) {
      throw new NotFoundException(`Customer with ID ${customerId} not found`);
    }

    return this.addressRepository.find({
      where: {
        ownerType: AddressOwnerType.CUSTOMER,
        userId: customer.userId,
      },
      relations: ['user'],
      order: { isDefault: 'DESC', createdAt: 'DESC' },
    });
  }

  async findByVendor(vendorId: number): Promise<Address[]> {
    const vendor = await this.vendorRepository.findOne({
      where: { id: vendorId },
      relations: ['user'],
    });

    if (!vendor) {
      throw new NotFoundException(`Vendor with ID ${vendorId} not found`);
    }

    return this.addressRepository.find({
      where: {
        ownerType: AddressOwnerType.VENDOR,
        userId: vendor.userId,
      },
      relations: ['user'],
      order: { isDefault: 'DESC', createdAt: 'DESC' },
    });
  }

  async findDefaultAddress(customerId: number): Promise<Address | null> {
    const customer = await this.customerRepository.findOne({
      where: { id: customerId },
      relations: ['user'],
    });

    if (!customer) {
      throw new NotFoundException(`Customer with ID ${customerId} not found`);
    }

    return this.addressRepository.findOne({
      where: {
        ownerType: AddressOwnerType.CUSTOMER,
        userId: customer.userId,
        isDefault: true,
      },
      relations: ['user'],
    });
  }

  async findDefaultVendorAddress(vendorId: number): Promise<Address | null> {
    const vendor = await this.vendorRepository.findOne({
      where: { id: vendorId },
      relations: ['user'],
    });

    if (!vendor) {
      throw new NotFoundException(`Vendor with ID ${vendorId} not found`);
    }

    return this.addressRepository.findOne({
      where: {
        ownerType: AddressOwnerType.VENDOR,
        userId: vendor.userId,
        isDefault: true,
      },
      relations: ['user'],
    });
  }

  async update(
    id: number,
    updateAddressDto: UpdateAddressDto,
  ): Promise<Address> {
    const existingAddress = await this.addressRepository.findOne({
      where: { id },
      relations: ['user'],
    });

    if (!existingAddress) {
      throw new NotFoundException(`Address with ID ${id} not found`);
    }

    // If setting as default, unset other defaults for the same owner
    if (updateAddressDto.isDefault) {
      await this.unsetDefaultAddresses(
        existingAddress.ownerType,
        existingAddress.userId,
      );
    }

    // Update address
    await this.addressRepository.update(id, updateAddressDto);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const address = await this.addressRepository.findOne({
      where: { id },
    });

    if (!address) {
      throw new NotFoundException(`Address with ID ${id} not found`);
    }

    await this.addressRepository.remove(address);
  }

  async setAsDefault(id: number): Promise<Address> {
    const address = await this.addressRepository.findOne({
      where: { id },
      relations: ['user'],
    });

    if (!address) {
      throw new NotFoundException(`Address with ID ${id} not found`);
    }

    // Unset other defaults for the same owner
    await this.unsetDefaultAddresses(address.ownerType, address.userId);

    // Set this address as default
    await this.addressRepository.update(id, { isDefault: true });
    return this.findOne(id);
  }

  async restore(id: number): Promise<Address> {
    const address = await this.addressRepository.findOne({
      where: { id },
      withDeleted: true,
    });

    if (!address) {
      throw new NotFoundException(`Address with ID ${id} not found`);
    }

    if (!address.deletedAt) {
      throw new BadRequestException('Address is not deleted');
    }

    await this.addressRepository.restore(id);
    return this.findOne(id);
  }

  async getAddressesCount(customerId: number): Promise<number> {
    const customer = await this.customerRepository.findOne({
      where: { id: customerId },
      relations: ['user'],
    });

    if (!customer) {
      throw new NotFoundException(`Customer with ID ${customerId} not found`);
    }

    return this.addressRepository.count({
      where: {
        ownerType: AddressOwnerType.CUSTOMER,
        userId: customer.userId,
      },
    });
  }

  async getVendorAddressesCount(vendorId: number): Promise<number> {
    const vendor = await this.vendorRepository.findOne({
      where: { id: vendorId },
      relations: ['user'],
    });

    if (!vendor) {
      throw new NotFoundException(`Vendor with ID ${vendorId} not found`);
    }

    return this.addressRepository.count({
      where: {
        ownerType: AddressOwnerType.VENDOR,
        userId: vendor.userId,
      },
    });
  }

  // Private helper methods
  private async unsetDefaultAddresses(
    ownerType: AddressOwnerType,
    userId: number,
  ): Promise<void> {
    await this.addressRepository.update(
      { ownerType, userId },
      { isDefault: false },
    );
  }
}
