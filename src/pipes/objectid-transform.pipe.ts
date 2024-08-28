import { PipeTransform, Injectable, ArgumentMetadata, BadRequestException } from "@nestjs/common";
import { Types } from "mongoose";

@Injectable()
export class ObjectIdTransformPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    // Handle top-level strings
    if (typeof value === "string" && this.isObjectId(value)) {
      return new Types.ObjectId(value);
    }

    // Handle objects and nested objects
    if (typeof value === "object" && value !== null) {
      this.transformObjectIds(value);
      return value;
    }

    throw new BadRequestException("Validation failed");
  }

  private transformObjectIds(obj: any) {
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        const value = obj[key];
        if (typeof value === "string" && this.isObjectId(value)) {
          obj[key] = new Types.ObjectId(value);
        } else if (typeof value === "object" && value !== null) {
          this.transformObjectIds(value);
        }
      }
    }
  }

  private isObjectId(value: string): boolean {
    return /^[a-fA-F0-9]{24}$/.test(value);
  }
}
