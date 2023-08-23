import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ArticleService } from './article.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { User } from 'src/user/entities/user.entity';
import { getUser } from 'src/auth/decorator/get-user.decorator';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guard/rbac.guard';
import { Roles } from 'src/auth/decorator/roles.decorator';

@UseGuards(JwtAuthGuard, RolesGuard)
@UsePipes(ValidationPipe)
@Controller('article')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}
  @Roles('ADMIN', 'USER') //with this two guards we can set the authorization
  @Post()
  create(@Body() createArticleDto: CreateArticleDto, @getUser() user: User) {
    return this.articleService.create(createArticleDto, user);
  }
  @Roles('ADMIN', 'USER')
  @Get()
  findAll(@getUser() user: User) {
    return this.articleService.findAll(user);
  }
  @Roles('ADMIN', 'USER')
  @Get(':id')
  findOne(@Param('id') id: string, @getUser() user: User) {
    return this.articleService.findOne(+id, user);
  }
  @Roles('ADMIN')
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateArticleDto: UpdateArticleDto,
    @getUser() user: User,
  ) {
    return this.articleService.update(+id, updateArticleDto, user);
  }
  @Roles('ADMIN')
  @Delete(':id')
  remove(@Param('id') id: string, @getUser() user: User) {
    return this.articleService.remove(+id, user);
  }
}
