import { Resolver, Query, Mutation, Arg, UseMiddleware, Int } from "type-graphql";
import { CreateRoleInput } from "./types/CreateRoleInput";
import { UpdateRoleInput } from "./types/UpdateRoleInput";
import { kcConnect, getRoles } from "../../utils/helpers/kcAdmin";
import { PaginatedRoles, Role } from "../../models/Role";

@Resolver()
export class RoleResolver {
  @Query(() => PaginatedRoles)
  async roles(@Arg("limit", { nullable: true }) limit: number,
    @Arg("offset", { nullable: true }) offset: number): Promise<PaginatedRoles> {
    let roles = await getRoles();
    const count = roles.length;
    if (offset && limit) {
      roles = roles.slice(offset, offset + limit + 1)
    }
    return {
      count,
      limit: limit || roles.length,
      offset: offset || 0,
      items: roles.map(r => ({ id: r.id, name: r.name, description: r.description } as Role))
    }
  }

  @Query(() => Role)
  async role(@Arg("id") id: string) {
    const kcAdmin = await kcConnect();
    const role = await kcAdmin.roles.findOneById({ id });
    return role as Role;
  }

  @Mutation(() => Role)
  async createRole(@Arg("data") data: CreateRoleInput) {
    const kcAdmin = await kcConnect();
    const { roleName } = await kcAdmin.roles.create(data);
    const role = await kcAdmin.roles.findOneByName({ name: roleName });
    return role;
  } 

  @Mutation(() => Role)
  async updateRole(@Arg("id") id: string, @Arg("data") data: UpdateRoleInput) {
    const kcAdmin = await kcConnect();
    await kcAdmin.roles.updateById({ id }, data);
    const role = await kcAdmin.roles.findOneById({ id });
    return role;
  }

  @Mutation(() => String)
  async deleteRole(@Arg("id") id: string) {
    const kcAdmin = await kcConnect();
    await kcAdmin.roles.delById({ id });
    return id;
  }
}
