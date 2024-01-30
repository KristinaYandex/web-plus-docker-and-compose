import { Injectable, UnauthorizedException } from '@nestjs/common';
import { User } from '../users/entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { hashHelpers } from '../helpers/helpers';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private usersService: UsersService,
  ) {}

  auth(user: User) {
    //Генерируем токен
    const payload = { sub: user.id };

    return { access_token: this.jwtService.sign(payload) };
  }

  //Метод validatePassword проверяет, совпадает ли пароль пользователя с тем, что есть в базе.
  async validatePassword(username: string, password: string) {
    const user = await this.usersService.findByUserName(username);

    /* В идеальном случае пароль обязательно должен быть захэширован */
    const passwordHash = await hashHelpers.validateHash(
      password,
      user.password,
    );
    if (!passwordHash) {
      throw new UnauthorizedException('Неверное имя пользоваетеля или пароль');
    }
    if (user && passwordHash) {
      //Исключаем пароль из результата
      const { password, ...result } = user;
      return result;
    }
    return null;
  }
}
