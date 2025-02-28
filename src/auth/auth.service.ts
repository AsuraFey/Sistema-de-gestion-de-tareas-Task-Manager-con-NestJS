import {BadRequestException, Injectable, UnauthorizedException} from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { PrismaService } from 'src/prisma.service';
import * as bcrypt from 'bcrypt';
import {LoginDto} from "./dto/login.dto";
import {JwtService} from "@nestjs/jwt";

@Injectable()
export class AuthService {
  constructor(
      private prisma: PrismaService,
      private jwtService: JwtService
  ) {}

  async register(userData: RegisterDto) {
    // check if email is in use
    const emailInUse = await this.prisma.user.findUnique({
      where: {
        email: userData.email,
      },
    });

    //check username is unique
    const usernameInUse = await this.prisma.user.findUnique({
      where: {
        username: userData.username,
      }
    });

    if (usernameInUse){
      throw new BadRequestException("Username taken")
    } else if (emailInUse){
      throw new BadRequestException("Email already in use")
    }

    // hash password
    const hashedPassword = await bcrypt.hash(userData.password, 10)

    //create user and save in db
    await this.prisma.user.create({
      data: {
        username: userData.username,
        email: userData.email,
        password: hashedPassword,
      },
    })

  }

  async login(credentials: LoginDto){
    // find user by email
    const user = await this.prisma.user.findUnique({
      where: {
        email: credentials.email
      }
    })

    if (!user){
      throw new UnauthorizedException("Wrong credentials")
    }

    //check password
    const passwordsMatch = await bcrypt.compare(credentials.password, user.password)

    if (!passwordsMatch){
      throw new UnauthorizedException("Wrond Credentials")
    }
    //generate JWT

    return this.generateUserToken(user.id)

  }

  async generateUserToken(userId){
    const accessToken = this.jwtService.sign({userId}, {expiresIn: "1h"})

    return {accessToken};
  }

}
