import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
  Req,
} from '@nestjs/common';
import { TodoService } from './todo.service';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { JwtAuthGuard } from 'src/auth/jwt.guard';
import { RequestWithUser } from 'src/common/request-with-user';

@UseGuards(JwtAuthGuard)
@Controller('todos')
export class TodoController {
  constructor(private readonly todoService: TodoService) {}

  @Post()
  create(@Body() dto: CreateTodoDto, @Req() req: RequestWithUser) {
    return this.todoService.create(req.user.sub, dto);
  }

  @Get()
  findAll(@Req() req: RequestWithUser) {
    return this.todoService.findAll(req.user.sub);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Req() req: RequestWithUser) {
    return this.todoService.findOne(req.user.sub, id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateTodoDto,
    @Req() req: RequestWithUser,
  ) {
    return this.todoService.update(req.user.sub, id, dto);
  }

  @Delete(':id')
  delete(@Param('id') id: string, @Req() req: RequestWithUser) {
    return this.todoService.delete(req.user.sub, id);
  }
}
