import {BadRequestException, Injectable} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { PrismaService } from 'src/prisma.service';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async register(userData: CreateUserDto) {
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


  findAll() {
    return `This action returns all users`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
