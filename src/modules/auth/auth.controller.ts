import { Body, Controller, Get, Post, Req, Request, Res, UseGuards } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthGuard } from "@nestjs/passport";

import { Public } from "./decorators/public.decorator";
import { RegisterUserDto } from "src/modules/users/dto/create-user.dto";
import { Response } from "express";
import { User } from "./decorators/user.decorator";
import { IUser } from "src/modules/users/users.interface";
import { ResponseMessage } from "./decorators/response_message.decorator";
import { RolesService } from "src/modules/roles/roles.service";
// import { Throttle, ThrottlerGuard } from "@nestjs/throttler";
import { ApiTags } from "@nestjs/swagger";

@Controller("auth")
@ApiTags("auth")
export class AuthController {
  constructor(
    private authService: AuthService,
    private roleService: RolesService,
  ) {}
  @Public()
  @UseGuards(AuthGuard("local"))
  // @UseGuards(ThrottlerGuard)
  // @Throttle({ default: { limit: 3, ttl: 60000 } })
  @ResponseMessage("Login successful")
  @Post("login")
  async login(@Request() req, @Res({ passthrough: true }) response: Response) {
    const { _id, name, email, role } = req.user;
    return this.authService.login({ _id, name, email, role }, response);
  }
  @Public()
  @ResponseMessage("Registration successful")
  @Post("register")
  async register(@Body() registerBody: RegisterUserDto) {
    return await this.authService.register(registerBody);
  }

  @Public()
  @ResponseMessage("Token refreshed successfully")
  @Get("refresh")
  async handleRefreshToken(@Req() request: any, @Res({ passthrough: true }) response: Response) {
    const refresh_token = request.cookies["refresh_token"];

    return await this.authService.processNewToken(refresh_token, response);
  }

  @Get("account")
  @ResponseMessage("Get user information")
  async handleGetAccount(@User() user: IUser) {
    const temp = (await this.roleService.findOne(user?.role?._id)) as any;
    user.permissions = temp.permissions;
    return { user };
  }

  @ResponseMessage("Logout successful")
  @Post("logout")
  async handleLogout(@User() user: IUser, @Res({ passthrough: true }) response: Response) {
    return await this.authService.logout(user, response);
  }
}
