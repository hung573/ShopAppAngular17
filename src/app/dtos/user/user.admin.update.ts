import {
  IsString,
  IsNotEmpty,
  IsDate
} from 'class-validator';

export class UserAdminUpdateDTO {
  fullname: string;

  address: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  date_of_birth: Date;

  role_id: number;

  is_active: boolean;

  facebook_account_id: number = 0;

  google_account_id: number = 0;

  constructor(data: any) {
    this.fullname = data.fullname;
    this.address = data.address;
    this.password = data.password;
    this.date_of_birth = data.date_of_birth;
    this.role_id = data.role_id;
    this.is_active = data.is_active;
    this.facebook_account_id = data.facebook_account_id || 0;
    this.google_account_id = data.google_account_id || 0;
  }
}
