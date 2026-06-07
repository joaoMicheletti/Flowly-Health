import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ExceptionFilter,
  NotFoundException,
} from '@nestjs/common';

import { Prisma } from '@prisma/client';

@Catch(
  Prisma.PrismaClientKnownRequestError,
)
export class PrismaExceptionFilter
  implements ExceptionFilter
{
  catch(
    exception: Prisma.PrismaClientKnownRequestError,
    host: ArgumentsHost,
  ) {
    const ctx =
      host.switchToHttp();

    const response =
      ctx.getResponse();

    switch (exception.code) {
      case 'P2002':
        throw new BadRequestException(
          'Registro já existe',
        );

      case 'P2025':
        throw new NotFoundException(
          'Registro não encontrado',
        );

      default:
        throw exception;
    }
  }
}