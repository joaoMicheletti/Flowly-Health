import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { PrismaService } from '../../prisma/prisma.service';
import { UsersService } from '../users/users.service';

import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { RegisterClinicDto } from './dto/register-clinic.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private prisma: PrismaService,
  ) {}

  async registerClinic(data: RegisterClinicDto) {
    const userAlreadyExists =
      await this.usersService.findByEmail(data.email);

    if (userAlreadyExists) {
      throw new BadRequestException(
        'User email already exists',
      );
    }

    const hashedPassword = await bcrypt.hash(
      data.password,
      10,
    );

    const clinic = await this.prisma.clinic.create({
      data: {
        name: data.clinicName,
        email: data.clinicEmail,
        phone: data.clinicPhone,
        users: {
          create: {
            name: data.name,
            email: data.email,
            password: hashedPassword,
            role: 'ADMIN',
          },
        },
      },
      select: {
        id: true,
        name: true,
        subscriptionStatus: true,
        users: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
      },
    });

    return {
      message: 'Clinic registered successfully',
      clinic: {
        id: clinic.id,
        name: clinic.name,
        subscriptionStatus: clinic.subscriptionStatus,
      },
      user: clinic.users[0],
    };
  }

  async register(data: RegisterDto, clinicId: string) {
    const userAlreadyExists =
      await this.usersService.findByEmail(data.email);

    if (userAlreadyExists) {
      throw new BadRequestException(
        'User email already exists',
      );
    }

    const user = await this.usersService.create({
      name: data.name,
      email: data.email,
      password: data.password,
      role: 'RECEPTIONIST',
      clinicId,
    });

    return {
      message: 'User created successfully',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    };
  }

  async login(data: LoginDto) {
    const user = await this.usersService.findByEmail(
      data.email,
    );

    if (!user) {
      throw new UnauthorizedException(
        'Invalid credentials',
      );
    }

    const passwordMatch = await bcrypt.compare(
      data.password,
      user.password,
    );

    if (!passwordMatch) {
      throw new UnauthorizedException(
        'Invalid credentials',
      );
    }

    const token = await this.jwtService.signAsync({
      sub: user.id,
      email: user.email,
      role: user.role,
      clinicId: user.clinicId,
    });

    return {
      access_token: token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        clinicId: user.clinicId,
      },
    };
  }

  async me(userId: string) {
    return this.usersService.findById(userId);
  }
}