import { Resolver, Query, Mutation, Arg } from "type-graphql";
import { Edition } from "../../models/Edition";
import { CreateEditionInput } from "./types/CreateEditionInput";
import { UpdateEditionInput } from "./types/UpdateEditionInput";

@Resolver()
export class EditionResolver {
  @Query(() => ([Edition]))
  editions() {
    return Edition.find()
  }

  @Mutation(() => Edition)
  async createEdition(@Arg("data") data: CreateEditionInput) {
    const edition = Edition.create(data);
    await edition.save();
    return edition;
  }

  @Query(() => Edition)
  edition(@Arg("id") id: number) {
    return Edition.findOne({ where: { id } });
  }

  @Mutation(() => Edition)
  async updateEdition(@Arg("id") id: number, @Arg("data") data: UpdateEditionInput) {
    const edition = await Edition.findOne({ where: { id } });
    if (!edition) throw new Error("Edition not found!");
    Object.assign(edition, data);
    await edition.save();
    return edition;
  }

  @Mutation(() => Boolean)
  async deleteEdition(@Arg("id") id: number) {
    const edition = await Edition.findOne({ where: { id } });
    if (!edition) throw new Error("Edition not found!");
    await edition.remove();
    return true;
  }
}
