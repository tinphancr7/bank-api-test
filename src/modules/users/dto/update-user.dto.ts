import { OmitType, PartialType } from "@nestjs/mapped-types";
import { CreateUserDto } from "./create-user.dto";
import { IsMongoId, IsNotEmpty, IsOptional } from "class-validator";
import { Types } from "mongoose";

// export class UpdateUserDto extends OmitType(PartialType(CreateUserDto), ["password"] as const) {
//   @IsNotEmpty()
//   _id: string;
// }

export class UpdateUserDto {
  @IsOptional({ message: 'Vui lòng nhập tên' })
  name: string

  @IsOptional({ message: 'Vui lòng chọn role' })
  @IsMongoId()
  role: Types.ObjectId;
}
