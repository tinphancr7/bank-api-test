//auth.service.ts
import { BadRequestException, Injectable, InternalServerErrorException, UnauthorizedException } from "@nestjs/common";
import { JwtService, TokenExpiredError } from "@nestjs/jwt";
import * as bcrypt from "bcrypt";

import { UsersService } from "src/modules/users/users.service";

import { RegisterUserDto } from "src/modules/users/dto/create-user.dto";
import { IUser } from "src/modules/users/users.interface";
import { ConfigService } from "@nestjs/config";
import { Response } from "express";
import ms from "ms";
import { RolesService } from "src/modules/roles/roles.service";

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
    private rolesService: RolesService,
  ) {}
  async validateUser(email: string, password: string) {
    const user = await this.usersService.findOneByEmail(email);
    if (!user) {
      throw new BadRequestException("User not found");
    }
    const isMatch: boolean = bcrypt.compareSync(password, user.password);
    if (!isMatch) {
      throw new BadRequestException("Password does not match");
    }

    const temp = await this.rolesService.findOne(user?.role?._id as any);
    const objectUser = {
      ...user.toObject(),
      permissions: temp.permissions ?? [],
    };
    return objectUser;
  }
  async login(user: IUser, response: Response) {
    try {
      // Construct the payload for the new JWT
      const payload = {
        sub: "token login",
        iss: "server",
        ...user,
      };

      // Create a new refresh token with the payload
      const newRefreshToken = this.createRefreshToken(payload);

      const temp = await this.rolesService.findOne(user?.role?._id);

      //update refresh token of user

      // Update the user's refresh token in the database
      await this.usersService.updateRefreshToken({
        refresh_token: newRefreshToken,
        _id: user._id,
      });

      // Clear the old refresh token cookie
      response.clearCookie("refresh_token");

      // Set a new refresh token cookie with appropriate options
      response.cookie("refresh_token", newRefreshToken, {
        httpOnly: true,
        maxAge: ms(this.configService.get<string>("JWT_REFRESH_TOKEN_EXPIRES_IN")),
      });

      // Sign the payload to create a new access token
      const accessToken = this.jwtService.sign(payload);

      // Return the new access token and the user
      return { access_token: accessToken, user, permission: temp?.permissions ?? [] };
    } catch (error) {
      // Log the error for debugging purposes
      console.error("Login error:", error);

      // Throw an appropriate HTTP exception
      if (error instanceof UnauthorizedException) {
        throw new UnauthorizedException("Invalid credentials or token");
      } else {
        throw new InternalServerErrorException("An error occurred while logging in");
      }
    }
  }
  async register(user: RegisterUserDto) {
    const newUser: any = await this.usersService.register(user);
    return {
      _id: newUser?._id,
      createdAt: newUser?.createdAt,
    };
    // const { _id, name, email, role } = newUser;
    // return this.login({ _id: _id.toString(), name, email, role });
  }

  createRefreshToken = (payload: any) => {
    const refresh_token = this.jwtService.sign(payload, {
      secret: this.configService.get<string>("JWT_REFRESH_TOKEN_SECRET"),
      expiresIn: ms(this.configService.get<string>("JWT_REFRESH_TOKEN_EXPIRES_IN")) / 1000,
    });
    return refresh_token;
  };

  processNewToken = async (refresh_token: string, response: Response) => {
    try {
      // Retrieve the JWT secret from the configuration service
      const secret = this.configService.get<string>("JWT_REFRESH_TOKEN_SECRET");
      console.log("secret", secret);

      // Verify the provided refresh token using the secret
      this.jwtService.verify(refresh_token, { secret });

      // Find the user associated with the provided refresh token
      const user = await this.usersService.findUserByToken(refresh_token);
      const { email, name, _id, role } = user as any;

      // If no user is found, throw a BadRequestException
      if (!user) {
        throw new BadRequestException(`Could not find refresh token`);
      }

      // Process refresh token
      return this.login(
        {
          _id: _id.toString(),
          name,
          email,
          role,
        },
        response,
      );
    } catch (error) {
      console.log("eror", error);
      // If the error is a TokenExpiredError, throw an UnauthorizedException
      if (error instanceof TokenExpiredError) {
        throw new UnauthorizedException("EXPIRED_REFRESH_TOKEN");
      }
      // For all other errors, throw a BadRequestException
      throw new BadRequestException("Invalid refresh token");
    }
  };

  logout = async (user: IUser, response: Response) => {
    await this.usersService.updateRefreshToken({ refresh_token: "", _id: user?._id });

    response.clearCookie("refresh_token");

    return "ok";
  };
}
