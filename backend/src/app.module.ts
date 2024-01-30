import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { OfferssModule } from './offers/offers.module';
import { UsersModule } from './users/users.module';
import { WishesModule } from './wishes/wishes.module';
import { WishlistsModule } from './wishlists/wishlists.module';
import { User } from './users/entities/user.entity';
import { Offer } from './offers/entities/offer.entity';
import { Wishlist } from './wishlists/entities/wishlist.entity';
import { Wish } from './wishes/entities/wish.entity';

const {POSTGRES_HOST = "database_postgres", POSTGRES_PORT="5432", POSTGRES_USER = "kristina", POSTGRES_PASSWORD = "kristina1993", POSTGRES_DB = "postgres" } = process.env;

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: POSTGRES_HOST,
      port: +POSTGRES_PORT,
      username: POSTGRES_USER,
      password: POSTGRES_PASSWORD,
      database: POSTGRES_DB,
      entities: [User, Offer, Wishlist, Wish],
      synchronize: true,
    }),
    OfferssModule,
    UsersModule,
    WishesModule,
    WishlistsModule,
    AuthModule,
  ],
  providers: [AppService],
})
export class AppModule {}
