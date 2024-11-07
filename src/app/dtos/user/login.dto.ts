import {
  IsString,
  IsNotEmpty,
  IsPhoneNumber,
  isString
} from 'class-validator';

export class LoginDTO {
  @IsPhoneNumber()
  phone_number: string;

  @IsString()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  // role_id: number;


  constructor(data: any) {
    this.phone_number = data.phone_number;
    this.password = data.password;
    this.email = data.email;
    // this.role_id = data.role_id;
  }

}
