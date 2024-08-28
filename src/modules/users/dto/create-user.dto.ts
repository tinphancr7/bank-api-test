import { IsEmail, IsMongoId, IsNotEmpty, MinLength } from "class-validator";
import { Types } from "mongoose";

export class CreateUserDto {
  @IsEmail({}, { message: "Invalid email" })
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  @MinLength(6, {
    message: "Password should be at least 6 characters",
  })
  password: string;

  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  @IsMongoId()
  role: Types.ObjectId;
}
export class RegisterUserDto {
  @IsEmail({}, { message: "Invalid email" })
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  @MinLength(6, {
    message: "Password should be at least 6 characters",
  })
  password: string;

  @IsNotEmpty()
  name: string;
}
