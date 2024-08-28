import { Injectable, NotFoundException } from "@nestjs/common";

import { Model } from "mongoose";
import { toObjectId } from "src/utils";

@Injectable()
export abstract class BaseService<T> {
  constructor(private readonly model: Model<T>) {}

  async createData(createDto: any, populate?: any): Promise<T> {
    try {
      const result = this.model.create({
        ...createDto,
      });
      const newResult = await this.findOneData({
        id: (await result)?._id.toString() as string,
        populate,
      });

      return newResult;
    } catch (error) {
      throw error;
    }
  }

  async findAllData({
    query,
    filter = {},
    populate,
  }: {
    query: { page: number; limit: number };
    filter?: any;
    populate?: any;
  }): Promise<any> {
    const { page, limit } = query;
    const skip = (page - 1) * limit;

    try {
      const findQuery = this.model.find(filter).skip(skip).limit(limit).sort({ createdAt: "desc" }).lean();
      if (populate) {
        findQuery.populate(populate);
      }

      const [result, totalItems] = await Promise.all([findQuery.exec(), this.model.countDocuments(filter).exec()]);

      const totalPages = Math.ceil(totalItems / limit);

      return {
        meta: {
          page,
          limit,
          totalPages,
          totalItems,
        },
        result,
      };
    } catch (error) {
      throw error;
    }
  }

  async findOneData({ id, populate }: { id: string; populate?: any }): Promise<T> {
    try {
      const findQuery = this.model.findById(id);

      if (populate) {
        findQuery.populate(populate);
      }

      const entity = await findQuery.exec();

      if (!entity) {
        throw new NotFoundException("Entity not found");
      }
      return entity;
    } catch (error) {
      throw error;
    }
  }

  async updateData({ id, updateDto }: { id: string; updateDto: any }): Promise<T> {
    try {
      const updatedEntity = await this.model
        .findByIdAndUpdate(
          toObjectId(id),
          {
            ...updateDto,
          },
          { new: true },
        )
        .populate('role')
        .exec();

      if (!updatedEntity) {
        throw new NotFoundException("Entity not found");
      }
      return updatedEntity;
    } catch (error) {
      throw error;
    }
  }

  async removeData({ id }: { id: any }) {
    try {
      // Delete entities where the _id is in the provided array of ids
      const deletedEntities = await this.model
        .deleteMany({
          _id: { $in: id },
        })
        .exec();

      if (deletedEntities.deletedCount === 0) {
        throw new NotFoundException("No entities found with the provided IDs");
      }

      return deletedEntities;
    } catch (error) {
      throw error;
    }
  }
}
