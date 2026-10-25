
import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { UserRole } from '@prisma/client';
import * as bcrypt from 'bcrypt';

import { PrismaService } from '@/prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  async create(data: {
    name: string;
    email: string;
    password: string;
    role: UserRole;
    clinicId: string;
  }) {
    const hashedPassword = await bcrypt.hash(data.password, 10);

    return this.prisma.user.create({
      data: {
        ...data,
        password: hashedPassword,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        clinicId: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async findById(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        clinicId: true,
      },
    });
  }

  async findAll(clinicId: string) {
    return this.prisma.user.findMany({
      where: { clinicId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        clinicId: true,
      },
    });
  }

  async findOne(id: string, clinicId: string) {
    const user = await this.prisma.user.findFirst({
      where: { id, clinicId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        clinicId: true,
        createdAt: true,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async update(id: string, data: any, clinicId: string) {
    await this.findOne(id, clinicId);

    // Nunca permitir alterar a clínica pelo corpo da requisição.
    const {
      clinicId: ignoredClinicId,
      id: ignoredId,
      createdAt: ignoredCreatedAt,
      updatedAt: ignoredUpdatedAt,
      ...safeData
    } = data;

    if (safeData.password) {
      safeData.password = await bcrypt.hash(safeData.password, 10);
    }

    return this.prisma.user.update({
      where: { id },
      data: safeData,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        clinicId: true,
        updatedAt: true,
      },
    });
  }

  async remove(id: string, clinicId: string) {
    await this.findOne(id, clinicId);

    return this.prisma.user.delete({
      where: { id },
    });
  }
}
