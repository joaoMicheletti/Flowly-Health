import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';

import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { RegisterClinicDto } from './dto/register-clinic.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
  ) {}

  // Cadastro público de clínica e primeiro administrador
  @Post('register-clinic')
  registerClinic(@Body() body: RegisterClinicDto) {
    return this.authService.registerClinic(body);
  }

  @Post('login')
  login(@Body() body: LoginDto) {
    return this.authService.login(body);
  }

  // Somente ADMIN autenticado pode cadastrar usuários na clínica
  @UseGuards(JwtAuthGuard)
  @Post('register')
  register(
    @Body() body: RegisterDto,
    @Request() req: any,
  ) {
    if (req.user.role !== 'ADMIN') {
      throw new ForbiddenException(
        'Only clinic administrators can register users',
      );
    }

    return this.authService.register(
      body,
      req.user.clinicId,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  me(@Request() req: any) {
    return this.authService.me(req.user.userId);
  }
}