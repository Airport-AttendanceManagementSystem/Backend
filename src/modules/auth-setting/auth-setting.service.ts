import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { CreateAsslUserRepository } from '../user-settings/repositories/create-assl-user.repository';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthSettingService {
  constructor(
    private readonly userRepository: CreateAsslUserRepository,
    private readonly jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto) {
    // find user
    const user = await this.userRepository.findByUsername(loginDto.username);

    if (!user) {
      throw new UnauthorizedException('Invalid username or password');
    }

    // match password
    const isPasswordValid = await bcrypt.compare(
      loginDto.password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid username or password');
    }

    // Is user active
    if (user.userStatus === 0) {
      throw new UnauthorizedException(
        'Your account is inactive. Please contact Admin.',
      );
    }

    // desc for token
    const payload = {
      username: user.username,
      role: user.userType, // Admin or user
    };

    // creat token
    return {
      success: true,
      access_token: this.jwtService.sign(payload),
      user: {
        username: user.username,
        role: user.userType,
      },
    };
  }
}
