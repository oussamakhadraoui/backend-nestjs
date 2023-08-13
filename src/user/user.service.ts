import { PrismaService } from './../prisma/prisma.service';
import {
  Injectable,
  BadRequestException,
  InternalServerErrorException,
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
      const password = await bcrypt.hash(createUserDto.password, salt);
      const user = await this.prisma.users.create({
        data: { email, salt, password, name },
      });
      return user;
    } catch (error) {
      if ((error.code = 'p2002')) {
        throw new BadRequestException('This email is already in use');
      }
      throw new InternalServerErrorException();
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
      throw new BadRequestException('there is no user with that id');
    }
    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const oldArticle = await this.findOne(id);
    if (updateUserDto.password || updateUserDto.confirmPassword) {
      throw new BadRequestException(
        'If you want to change the pass use this url',
      );
    }
    return await this.prisma.users.update({
      where: { id },
      data: { ...oldArticle, ...updateUserDto },
    });
  }

  async remove(id: number) {
    const userToDelete = await this.prisma.users.delete({ where: { id } });
    if (!userToDelete) {
      throw new BadRequestException('there is no user with this id');
    }
    return userToDelete;
  }
  async findOn(email: string): Promise<User | undefined> {
    return this.prisma.users.findUnique({ where: { email } });
  }
}
