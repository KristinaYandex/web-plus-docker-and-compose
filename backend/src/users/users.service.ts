import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Wish } from '../wishes/entities/wish.entity';
import { User } from '../users/entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUsertDto } from './dto/update-user.dto';
import { FindUserDto } from './dto/find-user.dto';
import { hashHelpers } from '../helpers/helpers';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Wish)
    private readonly wishRepository: Repository<Wish>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  //Создаем пользователя
  async create(сreateUserDto: CreateUserDto): Promise<User> {
    const user = this.userRepository.create(сreateUserDto);
    const { password, ...result } = user;
    const hash = await hashHelpers.createHash(password);
    return await this.userRepository.save({ password: hash, ...result });
  }

  //Поиск всех пользователей
  async findAll(): Promise<User[]> {
    return await this.userRepository.find();
  }

  //Поиск пользователя по id
  async findById(id: number): Promise<User> {
    const user = await this.userRepository.findOneBy({ id });
    return user;
  }

  //Поиск пользователя по имени
  async findByUserName(username: string): Promise<User> {
    const user = await this.userRepository.findOneBy({ username });
    if (!user) {
      throw new NotFoundException('Пользователь не найден');
    }
    return user;
  }

  //Поиск пользователя по email
  async findByUserEmail(query: string): Promise<User[]> {
    const user = await this.userRepository.find({
      where: [{ email: query }],
    });
    if (!user) {
      throw new NotFoundException(`Пользователь c email ${query} не найден`);
    }
    return user;
  }

  //Поиск пользователя по email и username
  async findQuery(query): Promise<User[]> {
    const user = await this.userRepository.find({
      where: [{ email: query }, { username: query }],
    });
    if (user.length > 0) {
      return user;
    } else return undefined;
  }

  //Обновление информации о пользователе
  async updateOne(userId: number, updateUsertDto: UpdateUsertDto) {
    const user = await this.findById(userId);

    if (updateUsertDto.username && updateUsertDto.username !== user.username) {
      const username = await this.findQuery(updateUsertDto.username);

      if (username) {
        throw new BadRequestException(
          'Пользователь с таким именем уже зарегистрирован',
        );
      }
    }

    if (updateUsertDto.email && updateUsertDto.email !== user.email) {
      const useremail = await this.findQuery(updateUsertDto.email);

      if (useremail) {
        throw new BadRequestException(
          'Пользователь с таким email уже зарегистрирован',
        );
      }
    }

    if (updateUsertDto.password) {
      const hash = await hashHelpers.createHash(updateUsertDto.password);
      const newUser = await this.userRepository.update(userId, {
        ...updateUsertDto,
        password: hash,
        updatedAt: new Date(),
      });
      return newUser;
    } else {
      return await this.userRepository.update(userId, {
        ...updateUsertDto,
        updatedAt: new Date(),
      });
    }
  }

  //Поиск подарков пользователя
  async findUserWishes(id: number): Promise<Wish[]> {
    const wishes = await this.wishRepository.find({
      where: { owner: { id } },
    });
    if (!wishes) {
      throw new NotFoundException('Подарки не найдены');
    }
    return wishes;
  }

  //Поиск пользователей по имени или почте
  async findMany({ query }: FindUserDto): Promise<User[]> {
    const user = await this.userRepository.find({
      where: [{ username: query }, { email: query }],
    });
    if (!user) {
      throw new NotFoundException('Пользователь не найден');
    }
    return user;
  }

  //Удаление пользователя
  async removeOne(userId: number) {
    return await this.userRepository.delete(userId);
  }
}
