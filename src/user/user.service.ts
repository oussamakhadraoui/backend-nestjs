import { PrismaService } from './../prisma/prisma.service';
import {
  Injectable,
  BadRequestException,
  InternalServerErrorException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';
import { QueryDto } from './dto/query.dto';
import { User } from './entities/user.entity';
@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}
  async create(createUserDto: CreateUserDto) {
    try {
      const { name, email } = createUserDto;
      if (createUserDto.password !== createUserDto.confirmPassword) {
        throw new BadRequestException('Confirmation password is not correct!');
      }
      const salt = await bcrypt.genSalt();
      console.log(salt);
      const password = await bcrypt.hash(createUserDto.password, salt);
      const user = await this.prisma.users.create({
        data: { email, salt, password, name, role: 'USER' },
      });
      delete user.passResetExpire;
      delete user.passResetToken;
      return user;
    } catch (error) {
      if ((error.code = 'p2002')) {
        console.log(error);
        throw new BadRequestException('This email is already in use');
      } else throw new InternalServerErrorException();
    }
  }

  async findAll(QueryDto: QueryDto): Promise<User[]> {
    const users = await this.prisma.users.findMany({
      where: { name: { contains: QueryDto.search } },
    });
    return users;
  }

  async findOne(id: number) {
    const user = await this.prisma.users.findUnique({ where: { id } });
    if (!user) {
      throw new HttpException(
        'there is no user with this id',
        HttpStatus.NOT_FOUND,
      );
    }
    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const { email, name } = updateUserDto;
    const oldArticle = await this.findOne(id);
    if (!oldArticle) {
      throw new HttpException(
        'there is no user with this id',
        HttpStatus.NOT_FOUND,
      );
    }
    return await this.prisma.users.update({
      where: { id },
      data: { email: email || oldArticle.email, name: name || oldArticle.name },
    });
  }

  async remove(id: number) {
    const userToDelete = await this.prisma.users.delete({ where: { id } });
    if (!userToDelete) {
      throw new HttpException(
        'there is no user with this id',
        HttpStatus.NOT_FOUND,
      );
    }
    return userToDelete;
  }
}
