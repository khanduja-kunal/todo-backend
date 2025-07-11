import { Module } from '@nestjs/common';
import { TodoService } from './todo.service';
import { TodoController } from './todo.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { IsFutureDate } from 'src/validators/due-date.validator';

@Module({
  controllers: [TodoController],
  providers: [TodoService, PrismaService, IsFutureDate],
})
export class TodoModule {}
