import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Wish } from './entities/wish.entity';
import { User } from '../users/entities/user.entity';
import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';

@Injectable()
export class WishesService {
  constructor(
    @InjectRepository(Wish)
    private readonly wishRepository: Repository<Wish>,
  ) {}

  //Создаем подарок
  async create(owner: User, createWishDto: CreateWishDto): Promise<Wish> {
    const wish = await this.wishRepository.create({ ...createWishDto, owner });

    return this.wishRepository.save(wish);
  }

  //Поиск подарка по id
  async findOne(id: number): Promise<Wish> {
    const wish = await this.wishRepository.findOne({
      where: { id },
      relations: { offers: true, owner: true },
    });
    if (!wish) {
      throw new NotFoundException('Подарок не найден');
    }
    return wish;
  }

  //Поиск всех подарков
  async findAll(): Promise<Wish[]> {
    return await this.wishRepository.find();
  }

  //Поиск списка подарков
  async findWishes(item): Promise<Wish[]> {
    return await this.wishRepository.findBy(item);
  }

  //Обновление информации о подарке
  async updateOne(
    wishId: number,
    updateWishDto: UpdateWishDto,
    userId: number,
  ) {
    const wish = await this.findOne(wishId);

    if (!wish) {
      throw new NotFoundException('Подарок не найден');
    }

    if (userId !== wish.owner.id) {
      throw new ForbiddenException('Нельзя редактировать чужие подарки');
    }

    if (wish.raised && updateWishDto.price > 0) {
      throw new ForbiddenException(
        'Нельзя редактировать и менять стоимость подарка, так как уже есть желающие скинуться',
      );
    }

    return await this.wishRepository.update(wishId, {
      ...updateWishDto,
      updatedAt: new Date(),
    });
  }

  //Удаление подарка
  async removeOne(wishId: number, userId: number) {
    const wish = await this.findOne(wishId);

    if (!wish) {
      throw new NotFoundException('Подарок не найден');
    }
    if (userId !== wish.owner.id) {
      throw new ForbiddenException('Нельзя удалять чужие подарки');
    }
    return await this.wishRepository.delete(wishId);
  }

  //Копирование подарка
  async copyWish(wishId: number, user: User) {
    const wish = await this.findOne(wishId);

    if (!wish) {
      throw new NotFoundException('Подарок не найден');
    }
    if (user.id === wish.owner.id) {
      throw new ForbiddenException('Нельзя копировать свои подарки');
    }

    await this.wishRepository.update(wishId, {
      copied: (wish.copied = wish.copied + 1),
    });

    await this.create(user, {
      ...wish,
      raised: 0,
    });
  }

  //Поиск последних 40 подарков
  async lastWishes(): Promise<Wish[]> {
    return await this.wishRepository.find({
      take: 40,
      order: { createdAt: 'DESC' },
    });
  }

  //Поиск 20 подарков, которые копируют чаще всего
  async topWishes(): Promise<Wish[]> {
    return await this.wishRepository.find({
      take: 20,
      order: { copied: 'DESC' },
    });
  }

  async find(arg: any) {
    return await this.wishRepository.find(arg);
  }
}
