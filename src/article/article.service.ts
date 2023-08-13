import { PrismaService } from './../prisma/prisma.service';
import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { User } from 'src/user/entities/user.entity';
import { Article } from './entities/article.entity';
@Injectable()
export class ArticleService {
  constructor(private Prisma: PrismaService) {}
  async create(
    createArticleDto: CreateArticleDto,
    user: User,
  ): Promise<Article> {
    const article = await this.Prisma.articles.create({
      data: { ...createArticleDto, userId: user.id, rating: 1 },
    });
    return article;
  }

  async findAll(user: User): Promise<Article[]> {
    const articles: Article[] = await this.Prisma.articles.findMany({
      where: { userId: user.id },
    });
    return articles;
  }

  async findOne(id: number, user: User): Promise<Article> {
    const article = await this.Prisma.articles.findUnique({
      where: { id, AND: { userId: user.id } },
    });
    if (!article) {
      throw new BadRequestException('there is no article with tis id');
    }
    return article;
  }

  async update(
    id: number,
    updateArticleDto: UpdateArticleDto,
    user: User,
  ): Promise<Article> {
    const { description, name, published = true } = updateArticleDto;
    const article = await this.findOne(id, user);
    if (!article) {
      throw new BadRequestException('there is no article with that id');
    }
    const articleToUpdate = await this.Prisma.articles.update({
      where: { id, AND: { userId: user.id } },
      data: { name, description, published },
    });

    return articleToUpdate;
  }

  async remove(id: number, user: User): Promise<Article> {
    const article = await this.findOne(id, user);
    if (!article) {
      throw new BadRequestException(`there is no article with this id: ${id}`);
    }
    const articleToRemove = await this.Prisma.articles.delete({
      where: { id, AND: { userId: user.id } },
    });

    return articleToRemove;
  }
}
