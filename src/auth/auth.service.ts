//import {
//  Injectable,
//  BadRequestException,
//  UnauthorizedException,
//} from '@nestjs/common';
//import { JwtService } from '@nestjs/jwt';
//import { PrismaService } from 'src/prisma/prisma.service';
//import { RegisterDto } from './dto/register.dto';
//import { SignupResponse } from './types/signup-response.interface';
//import * as bcrypt from 'bcrypt';
//import { LoginDto } from './dto/login.dto';
//
//@Injectable()
//export class AuthService {
//  constructor(
//    private prisma: PrismaService,
//    private jwt: JwtService,
//  ) {}
//
//  async register(dto: RegisterDto): Promise<SignupResponse> {
//    const existingUser = await this.prisma.user.findUnique({
//      where: { email: dto.email },
//    });
//
//    if (existingUser) {
//      throw new BadRequestException('Email already exists', {
//        cause: new Error(),
//        description: 'This email is already registered.',
//      });
//    }
//
//    const hashedPassword = await bcrypt.hash(dto.password, 10);
//
//    const user = await this.prisma.user.create({
//      data: {
//        email: dto.email,
//        name: dto.name,
//        password: hashedPassword,
//      },
//      select: {
//        id: true,
//        email: true,
//      },
//    });
//
//    return user;
//  }
//
//  async login(dto: LoginDto): Promise<{ access_token: string }> {
//    const user = await this.prisma.user.findUnique({
//      where: { email: dto.email },
//    });
//
//    if (!user) throw new UnauthorizedException('Invalid credentials.');
//
//    const valid = await bcrypt.compare(dto.password, user.password);
//
//    if (!valid) throw new UnauthorizedException('Invalid credentials.');
//
//    const payload = { sub: user.id, email: user.email };
//    const token = await this.jwt.signAsync(payload, {
//      expiresIn: '1h',
//    });
//
//    return { access_token: token };
//  }
//}

import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async validateGoogleUser(email?: string, name?: string, avatar?: string): Promise<User> {
    if (!email) {
      throw new UnauthorizedException('Google account has no email');
    }

    let user = await this.prisma.user.findUnique({ where: { email } });

    if (!user) {
      user = await this.prisma.user.create({
        data: {
          email,
          name: name || 'Unnamed User',
          avatar,
          password: '', // Prisma must allow null or optional password
        },
      });
    }

    return user;
  }

  async loginWithGoogle(user: User) {
    const payload = {
      sub: user.id,
      email: user.email,
    };

    const token = this.jwtService.sign(payload);

    return {
      access_token: token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        avatar: user.avatar,
      },
    };
  }
}
