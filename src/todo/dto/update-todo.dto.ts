import { IsOptional, IsString, IsEnum, IsDate, IsBoolean, Validate } from 'class-validator';
import { Priority, Category } from '@prisma/client';
import { IsFutureDate } from 'src/validators/due-date.validator';
import { Type } from 'class-transformer';
export class UpdateTodoDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsEnum(Priority)
  priority?: Priority;

  @IsOptional()
  @IsEnum(Category)
  category?: Category;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  @Validate(IsFutureDate)
  dueDate?: Date;

  @IsOptional()
  @IsBoolean()
  completed?: boolean;
}
