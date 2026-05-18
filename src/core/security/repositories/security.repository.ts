import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../prisma/prisma.service';
import {
  UserWithAuthorization,
  userWithAuthorizationInclude,
} from '../../database/includes/user-with-authorization.include';

@Injectable()
export class SecurityRepository {
  constructor(private readonly prisma: PrismaService) {}

  /** User -> Roles[] -> Permissions[] */
  async findByIdWithAuthorization(
    id: string,
  ): Promise<UserWithAuthorization | null> {
    return this.prisma.user.findUnique({
      where: {
        id: id,
      },
      include: userWithAuthorizationInclude,
    });
  }

  /** User -> Roles[] -> Permissions[] */
  async findByEmailWithAuthorization(
    email: string,
  ): Promise<UserWithAuthorization | null> {
    return this.prisma.user.findUnique({
      where: {
        email: email,
      },
      include: userWithAuthorizationInclude,
    });
  }
}
