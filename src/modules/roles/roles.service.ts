import { BadRequestException, Injectable } from "@nestjs/common";
import { CreateRoleDto } from "./dto/create-role.dto";
import { UpdateRoleDto } from "./dto/update-role.dto";
import { Role, RoleDocument } from "./schemas/role.schema";
import { InjectModel } from "@nestjs/mongoose";

import { IUser } from "src/modules/users/users.interface";
import { toObjectId } from "src/utils";

import { BaseService } from "src/base/base.service";
import { ADMIN_ROLE } from "src/common";
import { Model } from "mongoose";

@Injectable()
export class RolesService extends BaseService<RoleDocument> {
  constructor(@InjectModel(Role.name) private rolesModel: Model<RoleDocument>) {
    super(rolesModel);
  }
  async create(createRoleDto: CreateRoleDto, user: IUser) {
    const { name, description, permissions } = createRoleDto;
    const isExist = await this.rolesModel.findOne({ name });
    if (isExist) {
      throw new BadRequestException("role already exists");
    }
    return this.createData({
      name,
      description,
      permissions: permissions.map((permission) => toObjectId(permission)),
      createdBy: toObjectId(user?._id),
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
      populate: [{ path: "createdBy", select: { name: 1, role: 1, email: 1 } }],
    });
  }

  async findOne(id: string) {
    return this.findOneData({
      id,
      populate: [
        { path: "createdBy" },
        {
          path: "permissions",
          select: { name: 1, apiPath: 1, method: 1, module: 1 },
        },
      ],
    });
  }

  async update(id: string, updateRoleDto: UpdateRoleDto, user: IUser) {
    return this.updateData({
      id,
      updateDto: {
        ...updateRoleDto,
        updatedBy: toObjectId(user._id),
      },
    });
  }

  async remove(ids: any) {
    // const foundRole = await this.rolesModel.findById(ids);
    // if (foundRole?.name === ADMIN_ROLE) {
    //   throw new BadRequestException("Not allowed to remove admin role");
    // }
    return this.removeData({
      id: ids,
    });
  }
}
