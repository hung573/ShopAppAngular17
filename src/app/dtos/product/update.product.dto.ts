import {
  IsString,
  IsNotEmpty,
  IsPhoneNumber,
} from 'class-validator';

export class UpdateProductDTO {
  @IsPhoneNumber()
  name: string;

  price: number;

  @IsString()
  @IsNotEmpty()
  description: string;

  thumbnail: string;

  category_id: number;

  constructor(data: any) {
    this.name = data.name;
    this.price = data.price;
    this.thumbnail = data.thumbnail;
    this.description = data.description;
    this.category_id = data.category_id;
  }
}
