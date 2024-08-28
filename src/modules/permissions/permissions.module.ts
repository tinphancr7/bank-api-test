import { Module } from "@nestjs/common";
import { PermissionsService } from "./permissions.service";
import { PermissionsController } from "./permissions.controller";
import { MongooseModule } from "@nestjs/mongoose";
import { Permission, PermissionSchema } from "./schemas/permission.schema";
import { UsersModule } from "src/modules/users/users.module";

@Module({
  imports: [MongooseModule.forFeature([{ name: Permission.name, schema: PermissionSchema }]), UsersModule],
  controllers: [PermissionsController],
  providers: [PermissionsService],
})
export class PermissionsModule {}
