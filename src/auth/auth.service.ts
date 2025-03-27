import {BadRequestException, Injectable, UnauthorizedException} from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import {LoginDto} from "./dto/login.dto";
import {JwtService} from "@nestjs/jwt";
import {v4 as uuidv4} from 'uuid';
import {RolesService} from "../roles/roles.service";


@Injectable()
export class AuthService {
  constructor(
      private prisma: PrismaService,
      private jwtService: JwtService,
      private rolesService: RolesService
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
    const createdUser = await this.prisma.user.create({
      data: {
        username: userData.username,
        email: userData.email,
        password: hashedPassword,
        roleId: 2,
      },
    })
    return {
        id: createdUser.id,
        username: createdUser.username,
        email: createdUser.email,
    }
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
      throw new UnauthorizedException("Wrong Credentials")
    }
    //generate JWT
    const  tokens = await this.generateUserToken(user.id);

    return {
      ...tokens,
      userId: user.id,
    }

  }

  async refreshTokens(refreshToken: string, userId){
    const token = await this.prisma.refreshToken.findFirst({
      where:{
        userId: userId,
        token: refreshToken,
        expiresAt: { gte: new Date() }
      }
    })

    if (!token){
      throw new UnauthorizedException("Refresh Token invalid")
    }

    return this.generateUserToken(token.userId);
  }


  async generateUserToken(userId){
    const accessToken = this.jwtService.sign({userId}, {expiresIn: "1h"})
    const refreshToken = uuidv4()

    await this.storeRefreshToken(refreshToken, userId);
    return {
      accessToken,
      refreshToken,
    };
  }

  async storeRefreshToken(token: string, userId: number){

    const expiresAt = new Date();
    expiresAt.setDate((expiresAt.getDate() + 1));

    await this.prisma.refreshToken.upsert({
      where: {
        userId: userId,
      },
      update: {
        token: token,
      },
      create: {
          token: token,
          userId: userId,
          expiresAt: expiresAt
      }
    });
  }

  async logout(userId: number){
    await this.prisma.user.deleteMany({where: {id: userId,}});
  }


  async getUserPermissions(userId: number){
    const user = await this.prisma.user.findUnique({where:{id:userId}});

    if (!user){
      throw new BadRequestException("User not found")
    }

    const role = await this.rolesService.getRoleById(user.roleId)

    if (!role) {
      throw new BadRequestException('Role not found');
    }

    return role.permissions;
  }
}
