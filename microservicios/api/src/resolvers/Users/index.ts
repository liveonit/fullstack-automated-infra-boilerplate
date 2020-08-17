import { Resolver, Query, Mutation, Arg, UseMiddleware, Int } from "type-graphql";
import { CreateUserInput } from "./types/CreateUserInput";
import { UpdateUserInput } from "./types/UpdateUserInput";
import { GqlLog } from "../../utils/middlewares/GqlLogMiddleware";
import { User, PaginatedUsers } from "../../models/User";
import { kcAdminConn } from "../../utils/helpers/kcAdmin";

@Resolver()
export class UserResolver {
  @Query(() => PaginatedUsers)
  async users(@Arg("limit", { nullable: true }) limit: number,
    @Arg("offset", { nullable: true }) offset: number): Promise<PaginatedUsers> {
    const kcAdmin = await kcAdminConn();
    let users: User[] = await kcAdmin.users.find();
    const count = users.length;
    if (offset && limit) {
      users = users.slice(offset, offset + limit + 1)
    }
    return {
      count,
      limit: limit || users.length,
      offset: offset || 0,
      items: users
    }
  }

  @Query(() => User)
  user(@Arg("id") id: number) {
    
  }

  @Mutation(() => User)
  @UseMiddleware([GqlLog])
  async createUser(@Arg("data") data: CreateUserInput) {
    
  }

  @Mutation(() => User)
  @UseMiddleware([GqlLog])
  async updateUser(@Arg("id", type => Int) id: number, @Arg("data") data: UpdateUserInput) {
    
  }

  @Mutation(() => Number)
  @UseMiddleware([GqlLog])
  async deleteUser(@Arg("id", type => Int) id: number) {
    
  }
}
