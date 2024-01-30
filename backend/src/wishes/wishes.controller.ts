import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Req,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { WishesService } from './wishes.service';
import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';

@Controller('wishes')
export class WishesController {
  constructor(private readonly wishesService: WishesService) {}

  // Создать новый подарок
  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Req() req, @Body() сreateWishDto: CreateWishDto) {
    return await this.wishesService.create(req.user, сreateWishDto);
  }

  //Получить последние 40 подарков
  @Get('last')
  async findLastWishes() {
    return await this.wishesService.lastWishes();
  }

  //Получить 20 подарков, которые копируют чаще всего
  @Get('top')
  async findTopWishes() {
    return await this.wishesService.topWishes();
  }

  //Получить подарок по id
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.wishesService.findOne(+id);
  }

  //Обновить подарок по id
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async updateOne(
    @Req() req,
    @Param('id') wishId: string,
    @Body() updateWishDto: UpdateWishDto,
  ) {
    return await this.wishesService.updateOne(
      +wishId,
      updateWishDto,
      req.user.id,
    );
  }

  //Удалить подарок по id
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Req() req, @Param('id') wishId: string) {
    return await this.wishesService.removeOne(+wishId, req.user.id);
  }

  //Копировать понравившийся подарок
  @UseGuards(JwtAuthGuard)
  @Post(':id/copy')
  async copyWish(@Req() req, @Param('id') wishId: string) {
    return await this.wishesService.copyWish(+wishId, req.user);
  }
}
