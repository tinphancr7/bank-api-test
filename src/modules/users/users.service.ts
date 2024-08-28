import { BadRequestException, Injectable } from "@nestjs/common";
import { CreateUserDto, RegisterUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { User, UserDocument } from "./schemas/user.schema";
import { InjectModel } from "@nestjs/mongoose";
import { genSaltSync, hashSync } from "bcryptjs";

import * as bcrypt from "bcrypt";
import { IUser } from "./users.interface";

import { Role, RoleDocument } from "src/modules/roles/schemas/role.schema";

import { toObjectId } from "src/utils";
import { BaseService } from "src/base/base.service";
import { USER_ROLE } from "src/common";
import { Model } from "mongoose";
@Injectable()
export class UsersService extends BaseService<UserDocument> {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Role.name) private roleModel: Model<RoleDocument>,
  ) {
    super(userModel);
  }
  getHashPassword = (password: string) => {
    const salt = genSaltSync(10);
    const hash = hashSync(password, salt);
    return hash;
  };

  isValidPassword = (password: string, hash: string) => {
    return hashSync(password, hash);
  };

  async create(createUserDto: CreateUserDto, user: IUser) {
    const { name, email, password, role } = createUserDto;
    const existingUser = await this.findOneByEmail(email);
    if (existingUser) {
      throw new BadRequestException("email already exists");
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    return this.createData(
      {
        name,
        email,
        role: toObjectId(role),
        password: hashedPassword,
      },
      [
        {
          path: "role",
        },
      ],
    );
  }

  async register(user: RegisterUserDto) {
    const existingUser = await this.findOneByEmail(user.email);
    if (existingUser) {
      throw new BadRequestException("email already exists");
    }
    const hashedPassword = await bcrypt.hash(user.password, 10);

    const userRole = await this.roleModel.findOne({ name: USER_ROLE });
    return await this.userModel.create({
      ...user,
      password: hashedPassword,
      role: userRole?._id,
    });
  }

  async findAll({ page, limit, search }) {
    const searchQuery = {};
    if (search) {
      searchQuery["$or"] = [
        {
          name: {
            $regex: `.*${search}.*`,
            $options: "i",
          },
        },
        {
          method: {
            $regex: `.*${search}.*`,
            $options: "i",
          },
        },
        {
          apiPath: {
            $regex: `.*${search}.*`,
            $options: "i",
          },
        },
      ];
    }
    return this.findAllData({
      query: {
        page,
        limit,
      },
      filter: searchQuery,
      populate: [
        {
          path: "role",
        },
      ],
    });
  }
  async findOne(id: string) {
    return this.findOneData({
      id,
      populate: [
        {
          path: "role",
        },
      ],
    });
  }
  async findOneByEmail(email: string) {
    return await this.userModel.findOne({ email }).populate({
      path: "role",
      select: {
        name: 1,
      },
    });
  }

  async update(id: string, updateUserDto: UpdateUserDto, user: IUser) {
    return this.updateData({
      id,
      updateDto: {
        ...updateUserDto,
        updatedBy: toObjectId(user._id),
      },
    });
  }

  async remove(id: string) {
    const foundUser = await this.userModel.findById(id);
    if (foundUser?.email === "admin@gmail.com") {
      throw new BadRequestException("Not allowed to remove admin user");
    }
    await this.userModel.deleteOne({
      _id: id,
    });
    return foundUser;
    // return this.removeData({
    //   id,
    // });
  }

  async updateRefreshToken({ refresh_token, _id }) {
    return await this.userModel.findOneAndUpdate({ _id }, { refresh_token }, { new: true });
  }

  async findUserByToken(refresh_token: string) {
    return await this.userModel
      .findOne({
        refresh_token,
      })
      .populate({
        path: "role",
        select: {
          name: 1,
          _id: 1,
        },
      });
  }
}
