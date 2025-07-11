import { IsString, IsEnum, IsDate, Validate, IsNotEmpty } from 'class-validator';
import { Priority, Category } from '@prisma/client';
import { IsFutureDate } from 'src/validators/due-date.validator';
import { Type } from 'class-transformer';

export class CreateTodoDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsEnum(Priority)
  priority: Priority;

  @IsEnum(Category)
  category: Category;

  @Type(() => Date)
  @IsDate()
  @Validate(IsFutureDate)
  dueDate: Date;
}
