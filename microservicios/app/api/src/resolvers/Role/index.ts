import { Resolver, Query, Mutation, Arg, Int } from "type-graphql";
import { CreateRoleInput } from "./types/CreateRoleInput";
import { UpdateRoleInput } from "./types/UpdateRoleInput";
import { kcConnect, getRoles } from "../../utils/helpers/kcAdmin";
import { Role } from "../../models/Role";

@Resolver()
export class RoleResolver {
  @Query(() => [Role])
  async roles(@Arg("limit", { nullable: true }) limit: number,
    @Arg("offset", { nullable: true }) offset: number): Promise<Role[]> {
    let roles = await getRoles();
    if (offset && limit) {
      roles = roles.slice(offset, offset + limit + 1)
    }
    return roles.map(r => ({ id: r.id, name: r.name, description: r.description } as Role))
  }

  @Query(() => Role)
  async role(@Arg("id", () => Int) id: string): Promise<Role> {
    const kcAdmin = await kcConnect();
    const role = await kcAdmin.roles.findOneById({ id });
    return role as Role;
  }

  @Mutation(() => Role)
  async createRole(@Arg("data") data: CreateRoleInput): Promise<Role> {
    const kcAdmin = await kcConnect();
    const { roleName } = await kcAdmin.roles.create(data);
    console.log(roleName)
    const role = await kcAdmin.roles.findOneByName({ name: roleName });
    console.log(role)
    return role as Role;
  }

  @Mutation(() => Role)
  async updateRole(@Arg("id") id: string, @Arg("data") data: UpdateRoleInput): Promise<Role> {
    const kcAdmin = await kcConnect();
    await kcAdmin.roles.updateById({ id }, data);
    const role = await kcAdmin.roles.findOneById({ id });
    return role as Role;
  }

  @Mutation(() => String)
  async deleteRole(@Arg("id") id: string): Promise<string> {
    const kcAdmin = await kcConnect();
    await kcAdmin.roles.delById({ id });
    return id;
  }
}
