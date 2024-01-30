import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WishesService } from '../wishes/wishes.service';
import { Offer } from '../offers/entities/offer.entity';
import { User } from '../users/entities/user.entity';
import { CreateOfferDto } from './dto/create-offer.dto';

@Injectable()
export class OffersService {
  constructor(
    @InjectRepository(Offer)
    private readonly offerRepository: Repository<Offer>,
    private readonly wishesService: WishesService,
  ) {}

  async create(user: User, createOfferDto: CreateOfferDto) {
    const wish = await this.wishesService.findOne(createOfferDto.itemId);

    if (!wish) {
      throw new NotFoundException('Подарок не найден');
    }
    if (user.id === wish.owner.id) {
      throw new ForbiddenException(
        'Вы добавили этот подарок и скидываться на него вы не можете',
      );
    }

    //Проверка: сумма собранных средств не превышает стоимости подарка
    const sum = Number(wish.raised) + Number(createOfferDto.amount);
    if (+sum > wish.price) {
      throw new ForbiddenException('Деньги на подарок уже собраны');
    }

    //Обновляем данные о подарке с учетом собранных средств
    await this.wishesService.updateOne(
      wish.id,
      { raised: +sum },
      wish.owner.id,
    );

    //Сохраняем новый offer в базе данных
    return this.offerRepository.save({ ...createOfferDto, user, item: wish });
  }

  async findAll() {
    const offers = await this.offerRepository.find({
      relations: { user: true, item: true },
    });
    if (offers.length === 0) {
      throw new NotFoundException('Предложения еще никто не делал');
    }
    return offers;
  }

  async findOne(id: number) {
    const offer = await this.offerRepository.find({
      where: { id },
      relations: { user: true, item: true },
    });
    if (offer.length === 0) {
      throw new NotFoundException('Такого предложения нет');
    }
    return offer;
  }

  /*async removeOne(id: number) {
    await this.offerRepository.delete(id);
  }*/
}
