import { IsUrl, IsArray, Length, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';
export class CreateWishlistDto {
  @Length(1, 250)
  name: string;

  @IsUrl()
  image: string;

  @IsArray()
  @IsOptional()
  itemsId?: number[];

  @Transform((params) => (params.value?.length > 0 ? params.value : undefined))
  @IsOptional()
  @Length(2, 1500)
  description?: string;
}
