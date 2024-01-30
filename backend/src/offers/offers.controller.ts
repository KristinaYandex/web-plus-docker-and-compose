import {
  Controller,
  Get,
  Post,
  Req,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { OffersService } from './offers.service';
import { CreateOfferDto } from './dto/create-offer.dto';

@UseGuards(JwtAuthGuard)
@Controller('offers')
export class OffersController {
  constructor(private readonly offersService: OffersService) {}

  // Создать offer
  @Post()
  async create(@Req() req, @Body() createOfferDto: CreateOfferDto) {
    return await this.offersService.create(req.user, createOfferDto);
  }

  //Найти все предложения
  @Get()
  async findAll() {
    return this.offersService.findAll();
  }

  //Найти offer по id
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.offersService.findOne(+id);
  }
}
