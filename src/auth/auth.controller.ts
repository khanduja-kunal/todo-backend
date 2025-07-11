//import { Body, Controller, Post } from '@nestjs/common';
//import { AuthService } from './auth.service';
//import { RegisterDto } from './dto/register.dto';
//import { SignupResponse } from './types/signup-response.interface';
//import { LoginDto } from './dto/login.dto';
//
//@Controller('auth')
//export class AuthController {
//  constructor(private readonly authService: AuthService) {}
//
//  @Post('register')
//  register(@Body() dto: RegisterDto): Promise<SignupResponse> {
//    return this.authService.register(dto);
//  }
//
//  @Post('login')
//  login(@Body() dto: LoginDto): Promise<{ access_token: string }> {
//    return this.authService.login(dto);
//  }
//}

import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { Request } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // Step 1: Redirect to Google OAuth screen
  @Get('google')
  @UseGuards(AuthGuard('google'))
  googleAuth() {
    // Redirect handled automatically by Passport
  }

  // Step 2: Handle callback and return JWT + user info
  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(@Req() req: Request) {
    const user = req.user;
    return this.authService.loginWithGoogle(user as any); // add type if needed
  }
}

