import { IsString, IsEnum, IsDateString } from 'class-validator';
import { Priority, Category } from '@prisma/client';

export class CreateTodoDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsEnum(Priority)
  priority: Priority;

  @IsEnum(Category)
  category: Category;

  @IsDateString()
  dueDate: string; // date string like '2025-07-22'
}
