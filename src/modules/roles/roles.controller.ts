import { Controller, Get, Post, Body, Param, Delete, Query, Put } from "@nestjs/common";
import { RolesService } from "./roles.service";
import { CreateRoleDto } from "./dto/create-role.dto";
import { UpdateRoleDto } from "./dto/update-role.dto";
import { ResponseMessage } from "src/modules/auth/decorators/response_message.decorator";
import { User } from "src/modules/auth/decorators/user.decorator";
import { IUser } from "src/modules/users/users.interface";
import { Public } from "src/modules/auth/decorators/public.decorator";
import { ApiTags } from "@nestjs/swagger";

@Controller("roles")
// @ApiTags("roles")
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Post()
  @ResponseMessage("Create a new role")
  create(@Body() createUserCvDto: CreateRoleDto, @User() user: IUser) {
    return this.rolesService.create(createUserCvDto, user);
  }

  @Get()
  @ResponseMessage("Fetch all roles with paginate")
  findAll(@Query() query: any) {
    const { page = 1, limit = 10, search = "" } = query;
    return this.rolesService.findAll({
      page: +page,
      limit: +limit,
      search,
    });
  }

  @Get(":id")
  @ResponseMessage("Fetch a role by id")
  findOne(@Param("id") id: string) {
    return this.rolesService.findOne(id);
  }

  @Put(":id")
  @ResponseMessage("Update a role by id")
  updateStatus(@Param("id") id: string, @Body() updateRoleDto: UpdateRoleDto, @User() user: IUser) {
    return this.rolesService.update(id, updateRoleDto, user);
  }

  @Delete(":ids")
  @ResponseMessage("Delete a role by id")
  remove(@Param("ids") ids: string) {
    const newIds = ids.split(",");
    console.log("newIds", newIds);
    return this.rolesService.remove(newIds);
  }
}
