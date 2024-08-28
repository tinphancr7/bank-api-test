import { BadRequestException, Injectable } from "@nestjs/common";
import { CreatePermissionDto } from "./dto/create-permission.dto";
import { toObjectId } from "src/utils";
import { IUser } from "src/modules/users/users.interface";

import { Permission, PermissionDocument } from "./schemas/permission.schema";
import { InjectModel } from "@nestjs/mongoose";
import { UpdatePermissionDto } from "./dto/update-permission.dto";
import { BaseService } from "src/base/base.service";
import { Model } from "mongoose";

@Injectable()
export class PermissionsService extends BaseService<PermissionDocument> {
  constructor(@InjectModel(Permission.name) private permissionModel: Model<PermissionDocument>) {
    super(permissionModel);
  }
  async create(createPermissionDto: CreatePermissionDto, user: IUser) {
    const { method, apiPath, name, module } = createPermissionDto;
    const isExist = await this.permissionModel.findOne({ method, apiPath });
    if (isExist) {
      throw new BadRequestException("Permission already exists");
    }
    return this.createData({
      method,
      apiPath,
      name,
      module,
      createdBy: toObjectId(user?._id),
    });
  }
  async findAllByAdmin() {
    const result = await this.permissionModel.find().select({
      _id: 1,
    });
    const newResult = result.map((item) => item._id);
    return newResult;
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
      populate: { path: "createdBy", select: { name: 1, role: 1, email: 1 } },
    });
  }

  async findOne(id: string) {
    return this.findOneData({
      id,
      populate: [{ path: "createdBy", select: { name: 1, role: 1, email: 1 } }],
    });
  }

  async findByUser(user: IUser) {
    const resume = await this.permissionModel
      .find({
        userId: toObjectId(user._id),
      })
      .exec();
    return resume;
  }

  async update(id: string, updatePermissionDto: UpdatePermissionDto, user: IUser) {
    return this.updateData({
      id,
      updateDto: {
        ...updatePermissionDto,
        updatedBy: toObjectId(user._id),
      },
    });
  }

  async remove(ids: any) {
    return this.removeData({
      id: ids,
    });
  }
}
