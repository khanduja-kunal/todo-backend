import { Controller, Get, Patch, UseGuards, Req, Body, UseInterceptors, UploadedFile } from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserResponse } from './types/user-response.interface';
import { JwtAuthGuard } from 'src/auth/jwt.guard';
import { RequestWithUser } from 'src/common/request-with-user';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerConfig } from 'src/config/multer.config';

@UseGuards(JwtAuthGuard)
@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get('me')
  getProfile(@Req() req: RequestWithUser): Promise<UserResponse | null> {
    return this.userService.getMe(req.user.sub);
  }

  @Patch('me')
  @UseInterceptors(FileInterceptor('avatar', multerConfig))
  updateProfile(
    @Req() req: RequestWithUser,
    @UploadedFile() file: Express.Multer.File,
    @Body() dto: UpdateUserDto,
  ): Promise<UserResponse> {
    return this.userService.updateMe(req.user.sub, dto, file);
  }
}
