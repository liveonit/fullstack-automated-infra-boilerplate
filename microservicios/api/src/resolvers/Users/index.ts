import { Resolver, Query, Mutation, Arg, UseMiddleware, Int } from "type-graphql";
import { CreateUserInput } from "./types/CreateUserInput";
import { UpdateUserInput } from "./types/UpdateUserInput";
import { GqlLog } from "../../utils/middlewares/GqlLogMiddleware";
import { User, PaginatedUsers } from "../../models/User";
import { getUsersWithRoles, kcConnect, getUserWithRoles, getRoles } from "../../utils/helpers/kcAdmin";
import { RoleMappingPayload } from "keycloak-admin/lib/defs/roleRepresentation";

@Resolver()
export class UserResolver {
  @Query(() => PaginatedUsers)
  async users(@Arg("limit", { nullable: true }) limit: number,
    @Arg("offset", { nullable: true }) offset: number): Promise<PaginatedUsers> {
    let users = await getUsersWithRoles();
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
  async user(@Arg("id") id: string) {
    const kcAdmin = await kcConnect();
    const user = await kcAdmin.users.findOne({ id });
    return user as User;
  }

  @Mutation(() => User)
  @UseMiddleware([GqlLog])
  async createUser(@Arg("data") data: CreateUserInput) {
    const kcAdmin = await kcConnect();
    const { id } = await kcAdmin.users.create(data);
    const roles = (await getRoles()).filter(
      r => data.realmRoles.includes(r.name)).map(r =>
        ({ id: r.id, name: r.name } as RoleMappingPayload));
    await kcAdmin.users.addRealmRoleMappings({ id, roles })
    const user = await getUserWithRoles(id);
    return user;
  }

  @Mutation(() => User)
  @UseMiddleware([GqlLog])
  async updateUser(@Arg("id") id: string, @Arg("data") data: UpdateUserInput) {
    const kcAdmin = await kcConnect();
    await kcAdmin.users.update({ id }, data);
    const user = await kcAdmin.users.findOne({ id });
    return user;
  }

  @Mutation(() => String)
  @UseMiddleware([GqlLog])
  async deleteUser(@Arg("id") id: string) {
    const kcAdmin = await kcConnect();
    await kcAdmin.users.del({ id });
    return id;
  }
}
