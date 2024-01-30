import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WishListsController } from './wishlists.controller';
import { WishListsService } from './wishlists.service';
import { Wishlist } from './entities/wishlist.entity';
import { WishesModule } from '../wishes/wishes.module';

@Module({
  imports: [TypeOrmModule.forFeature([Wishlist]), WishesModule],
  controllers: [WishListsController],
  providers: [WishListsService],
  exports: [WishListsService],
})
export class WishlistsModule {}
