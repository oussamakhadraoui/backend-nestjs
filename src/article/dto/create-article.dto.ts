import { IsNotEmpty, Min, Max } from 'class-validator';
import { Article } from '../entities/article.entity';

export class CreateArticleDto implements Article {
  @IsNotEmpty()
  description: string;
  id: number;
  @IsNotEmpty()
  name: string;
  published: boolean;
  @IsNotEmpty()
  @Min(1)
  @Max(5)
  rating: number;
}
