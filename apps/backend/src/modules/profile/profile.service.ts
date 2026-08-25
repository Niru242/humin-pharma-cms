import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../auth/entities/user.entity';
import { RequestUser } from '../auth/decorators/current-user.decorator';

@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  /** Get current user's full profile. */
  async getMyProfile(userId: string) {
    const user = await this.userRepo.findOne({
      where: { id: userId, isActive: true },
      relations: ['userRoles', 'userRoles.role', 'dataScopes'],
    });
    if (!user) throw new NotFoundException('User not found');

    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      employeeCode: user.employeeCode,
      mfaEnabled: user.mfaEnabled,
      mustChangePassword: user.mustChangePassword,
      lastLoginAt: user.lastLoginAt,
      passwordChangedAt: user.passwordChangedAt,
      privacyPolicyVersionAccepted: user.privacyPolicyVersionAccepted,
      roles: (user.userRoles || []).map((ur) => ({
        code: ur.role?.code,
        name: ur.role?.name,
        effectiveFrom: ur.effectiveFrom,
        effectiveTo: ur.effectiveTo,
      })),
      dataScopes: (user.dataScopes || []).map((ds) => ({
        type: ds.scopeType,
        entityId: ds.scopeEntityId,
        label: ds.scopeEntityLabel,
      })),
    };
  }

  /** Update profile (limited fields — name only for self-service). */
  async updateMyProfile(userId: string, data: { firstName?: string; lastName?: string }) {
    const user = await this.userRepo.findOneBy({ id: userId });
    if (!user) throw new NotFoundException('User not found');

    if (data.firstName) user.firstName = data.firstName;
    if (data.lastName) user.lastName = data.lastName;

    return this.userRepo.save(user);
  }

  /** Accept privacy policy. */
  async acceptPrivacyPolicy(userId: string, version: string) {
    await this.userRepo.update(userId, {
      privacyPolicyVersionAccepted: version,
      privacyPolicyAcceptedAt: new Date(),
    });
    return { message: 'Privacy policy accepted', version };
  }
}
