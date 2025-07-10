import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserResponse } from './types/user-response.interface';
import { UpdateUserDto } from './dto/update-user.dto';
import { join } from 'path';
import * as fs from 'fs';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async getMe(userId: string): Promise<UserResponse | null>{
    return this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
        avatar: true,
        bio: true
      },
    });
  }

  async updateMe(userId: string, dto: UpdateUserDto, file?: Express.Multer.File): Promise<UserResponse> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId }
    });

    if(!user) throw new NotFoundException('User not found.');

    if(file) {
      if (user.avatar) {
        const oldPath = join(__dirname, '../../uploads', user.avatar);
        if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      }

      const avatarPath = `${file.filename}`;
      dto = { ...dto, avatar: avatarPath };
    }

    const updated = await this.prisma.user.update({
      where: { id: userId },
      data: dto,
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
        avatar: true,
        bio: true,
      },
    });
    return updated;
  }
}
