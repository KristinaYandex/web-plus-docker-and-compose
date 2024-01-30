import {
  IsString,
  IsUrl,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  Length,
} from 'class-validator';

import { Transform } from 'class-transformer';

export class CreateUserDto {
  @IsString()
  @Length(2, 30)
  @IsNotEmpty()
  username: string;

  /*@Length(2, 200)
  @IsOptional()
  about?: string;*/

  @Transform((params) => (params.value?.length > 0 ? params.value : undefined))
  @IsOptional()
  @Length(2, 200)
  about?: string;

  /*@IsEmpty()
  @Length(2, 200)
  about?: string;*/

  @IsUrl()
  @IsOptional()
  avatar?: string;

  @IsString()
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
