import { IsNotEmpty } from 'class-validator';
import { Article } from '../entities/article.entity';

export class CreateArticleDto implements Article {
  // createdAt: Date;
  @IsNotEmpty()
  description: string;
  id: number;
  @IsNotEmpty()
  name: string;
  published: boolean;
  // userId: number;
  // updatedAt: Date;
}
