import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

import { JwtService } from '@nestjs/jwt';

import * as bcrypt from 'bcrypt';

import { UsersService } from '../users/users.service';

import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,

    private jwtService: JwtService,
  ) {}

  async register(data: RegisterDto) {
    const userAlreadyExists = await this.usersService.findByEmail(
      data.email,
    );
    console.log('date of request:',userAlreadyExists);

    if (userAlreadyExists) {
      throw new BadRequestException('User already exists');
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);
    console.log("cript Password:", hashedPassword);

    const user = await this.usersService.create({
      name: data.name,
      email: data.email,
      password: hashedPassword,
    });
    console.log('data to database:', user);

    return {
      message: 'User created successfully',

      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    };
  }

  async login(data: LoginDto) {
    const user = await this.usersService.findByEmail(data.email);
    console.log("find User:", user)

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const passwordMatch = await bcrypt.compare(
      data.password,
      user.password,
    );
    console.log("password on database:", user.password);
    console.log("password on data:", data.password);
    console.log("compare:", passwordMatch);

    if (!passwordMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const token = await this.jwtService.signAsync({
      sub: user.id,
      email: user.email,
      role: user.role,
    });

    return {
      access_token: token,

      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    };
  }
}