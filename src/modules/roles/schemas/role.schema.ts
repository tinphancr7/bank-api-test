import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, HydratedDocument, Types } from "mongoose";
import { Permission } from "src/modules/permissions/schemas/permission.schema";

export type RoleDocument = HydratedDocument<Role>;

@Schema({ timestamps: true })
export class Role extends Document {
  @Prop()
  name: string;

  @Prop()
  description: string;

  @Prop({ type: Boolean, default: true })
  isActive: boolean;

  @Prop({ type: [Types.ObjectId], ref: Permission.name })
  permissions: Types.ObjectId[];

  @Prop({ type: Types.ObjectId, ref: "User" })
  createdBy: Types.ObjectId;
}

export const RoleSchema = SchemaFactory.createForClass(Role);
