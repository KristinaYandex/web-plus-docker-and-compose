import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Offer } from '../offers/entities/offer.entity';
import { User } from '../users/entities/user.entity';
import { Wish } from '../wishes/entities/wish.entity';
import { Wishlist } from '../wishlists/entities/wishlist.entity';

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'student',
  password: 'student',
  database: 'kupipodariday',
  entities: [Offer, User, Wish, Wishlist],
  synchronize: true,
};
