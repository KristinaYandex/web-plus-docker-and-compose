import {
  Controller,
  Get,
  Post,
  Patch,
  Req,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { UsersService } from './users.service';
import { UpdateUsertDto } from './dto/update-user.dto';
import { FindUserDto } from './dto/find-user.dto';
import { User } from './entities/user.entity';
import { Wish } from '../wishes/entities/wish.entity';

@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  //Просмотр своего профиля
  @Get('me')
  async findMe(@Req() req): Promise<User> {
    return await this.usersService.findById(req.user.id);
  }

  //Изменение своего профиля
  @Patch('me')
  async updateOne(@Req() req, @Body() updateUsertDto: UpdateUsertDto) {
    return await this.usersService.updateOne(req.user.id, updateUsertDto);
  }

  //Все подарки, созданные мной
  @Get('me/wishes')
  async findMyWishes(@Req() req): Promise<Wish[]> {
    return await this.usersService.findUserWishes(req.user.id);
  }

  //Поиск пользователя по имени
  @Get(':username')
  async findByUserName(@Param('username') username: string): Promise<User> {
    const user = await this.usersService.findByUserName(username);
    return user;
  }

  //Поиск подарков пользователя
  @Get(':username/wishes')
  async getUserWishes(@Param('username') username: string): Promise<Wish[]> {
    const user = await this.usersService.findByUserName(username);
    return await this.usersService.findUserWishes(user.id);
  }

  //Поиск пользователя по email
  @Post('find')
  async findByMany(@Body() findUsertDto: FindUserDto): Promise<User[]> {
    return await this.usersService.findMany(findUsertDto);
  }
}
