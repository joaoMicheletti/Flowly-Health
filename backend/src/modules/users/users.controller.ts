
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';

import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @Roles('ADMIN')
  findAll(@Request() req: any) {
    return this.usersService.findAll(req.user.clinicId);
  }

  @Post()
  @Roles('ADMIN')
  create(
    @Body() data: CreateUserDto,
    @Request() req: any,
  ) {
    return this.usersService.create({
      ...data,
      clinicId: req.user.clinicId,
    });
  }

  @Get(':id')
  @Roles('ADMIN')
  findOne(
    @Param('id') id: string,
    @Request() req: any,
  ) {
    return this.usersService.findOne(id, req.user.clinicId);
  }

  @Patch(':id')
  @Roles('ADMIN')
  update(
    @Param('id') id: string,
    @Body() data: UpdateUserDto,
    @Request() req: any,
  ) {
    return this.usersService.update(id, data, req.user.clinicId);
  }

  @Delete(':id')
  @Roles('ADMIN')
  remove(
    @Param('id') id: string,
    @Request() req: any,
  ) {
    return this.usersService.remove(id, req.user.clinicId);
  }
}
