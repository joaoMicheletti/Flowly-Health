import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';

import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@UseGuards(
  JwtAuthGuard,
  RolesGuard,
)
@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
  ) {}

  @Get()
  @Roles('ADMIN')
  findAll() {
    return this.usersService.findAll();
  }

  @Post()
  @Roles('ADMIN')
  create(
    @Body()
    data: CreateUserDto,
  ) {
    return this.usersService.create(data);
  }

  @Get(':id')
  @Roles('ADMIN')
  findOne(
    @Param('id')
    id: string,
  ) {
    return this.usersService.findOne(
      id,
    );
  }

  @Patch(':id')
  @Roles('ADMIN')
  update(
    @Param('id')
    id: string,

    @Body()
    data: UpdateUserDto,
  ) {
    return this.usersService.update(
      id,
      data,
    );
  }

  @Delete(':id')
  @Roles('ADMIN')
  remove(
    @Param('id')
    id: string,
  ) {
    return this.usersService.remove(
      id,
    );
  }
}