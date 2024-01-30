import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Wishlist } from './entities/wishlist.entity';
import { WishesService } from '../wishes/wishes.service';
import { User } from '../users/entities/user.entity';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';

@Injectable()
export class WishListsService {
  constructor(
    @InjectRepository(Wishlist)
    private readonly wishlistsRepository: Repository<Wishlist>,
    private readonly wishesService: WishesService,
  ) {}

  /*async create(user: User, сreateWishlistDto: CreateWishlistDto) {
    const wishes = await this.wishesService.findWishes(
      сreateWishlistDto.itemsId,
    );

    return await this.wishlistsRepository.save({
      ...сreateWishlistDto,
      owner: user,
      itemsId: wishes,
    });
  }*/

  async create(user: User, сreateWishlistDto: CreateWishlistDto) {
    const { itemsId } = сreateWishlistDto;
    const wishes = itemsId.map((id) => {
      return this.wishesService.findOne(id);
    });

    return await Promise.all(wishes).then((items) => {
      const wishlist = this.wishlistsRepository.create({
        ...сreateWishlistDto,
        owner: user,
        items,
      });
      return this.wishlistsRepository.save(wishlist);
    });
  }

  async findAll() {
    return await this.wishlistsRepository.find({
      relations: ['owner', 'items'],
    });
  }

  async findById(id: number) {
    return await this.wishlistsRepository.findOne({
      where: { id },
      relations: ['owner', 'items'],
    });
  }

  async updateOne(
    user: User,
    wishListId: number,
    updateWishlistDto: UpdateWishlistDto,
  ) {
    const wishlist = await this.findById(wishListId);

    if (!wishlist) {
      throw new NotFoundException('Вишлист не найден');
    }
    if (user.id !== wishlist.owner.id) {
      throw new ForbiddenException('Нельзя редактировать чужие списки');
    }

    const wishes = await this.wishesService.findWishes(
      updateWishlistDto.itemsId,
    );

    return await this.wishlistsRepository.save({
      ...wishlist,
      name: updateWishlistDto.name,
      image: updateWishlistDto.image,
      description: updateWishlistDto.description,
      items: wishes,
    });
  }

  async removeOne(userId: number, wishListId: number) {
    const wishlist = await this.findById(wishListId);

    if (!wishlist) {
      throw new NotFoundException('Вишлист не найден');
    }

    if (userId !== wishlist.owner.id) {
      throw new ForbiddenException('Нельзя удалять чужие списки');
    }

    await this.wishlistsRepository.delete(wishListId);
    return wishlist;
  }
}
