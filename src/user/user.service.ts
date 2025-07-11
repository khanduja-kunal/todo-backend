import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserResponse } from './types/user-response.interface';
import { UpdateUserDto } from './dto/update-user.dto';
import { join } from 'path';
import * as fs from 'fs';
import { Express } from 'express';

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

    if (file) {
      if (user.avatar?.includes('uploads/avatars/')) {
        const baseUrl = process.env.BASE_URL || 'http://localhost:3000';
        const relativePath = user.avatar.replace(`${baseUrl}/`, '');
        const oldPath = join(__dirname, '../../', relativePath);
        if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      }
    
      const baseUrl = process.env.BASE_URL || 'http://localhost:3000';
      const imagePath = `uploads/avatars/${file.filename}`;
      dto = { ...dto, avatar: `${baseUrl}/${imagePath}` };
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
