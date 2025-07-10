import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { TodoResponse } from './types/todo-response.interface';

@Injectable()
export class TodoService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, dto: CreateTodoDto): Promise<TodoResponse> {
    return this.prisma.todo.create({
      data: {
        ...dto,
        userId,
        dueDate: new Date(dto.dueDate),
      },
    });
  }

  async findAll(userId: string): Promise<TodoResponse[]> {
    return this.prisma.todo.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(userId: string, id: string): Promise<TodoResponse> {
    const todo = await this.prisma.todo.findFirst({
      where: { id, userId },
    });

    if (!todo) throw new NotFoundException('Todo not found');
    return todo;
  }

  async update(userId: string, id: string, dto: UpdateTodoDto): Promise<TodoResponse> {
    await this.findOne(userId, id); // ensure exists

    return this.prisma.todo.update({
      where: { id },
      data: {
        ...dto,
        dueDate: dto.dueDate ? new Date(dto.dueDate) : undefined,
      },
    });
  }

  async delete(userId: string, id: string): Promise<{ message: string }> {
    await this.findOne(userId, id); // ensure exists

    await this.prisma.todo.delete({ where: { id } });
    return { message: 'Todo deleted successfully' };
  }
}
