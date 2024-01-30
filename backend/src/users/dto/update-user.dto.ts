import { PartialType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';
import {
  IsString,
  IsUrl,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  Length,
} from 'class-validator';

export class UpdateUsertDto extends PartialType(CreateUserDto) {
  @IsString()
  @Length(2, 30)
  @IsNotEmpty()
  @IsOptional()
  username?: string;

  @Length(2, 200)
  @IsOptional()
  about?: string;

  @IsUrl()
  @IsOptional()
  avatar?: string;

  @IsString()
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  password?: string;
}
