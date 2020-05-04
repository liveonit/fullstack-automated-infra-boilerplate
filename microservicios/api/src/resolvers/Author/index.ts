import { Resolver, Query, Mutation, Arg, UseMiddleware } from "type-graphql";
import { Author } from "../../models/Author";
import { CreateAuthorInput } from "./types/CreateAuthorInput";
import { UpdateAuthorInput } from "./types/UpdateAuthorInput";
import { GqlLog } from "../../utils/middlewares/GqlLogMiddleware";

@Resolver()
export class AuthorResolver {
  @Query(() => [Author])
  authors() {
    return Author.find({ relations: ['books'] })
  }

  @Query(() => Author)
  author(@Arg("id") id: number) {
    return Author.findOne({ where: { id }, relations: ['books'] });
  }

  @Mutation(() => Author)
  @UseMiddleware([GqlLog])
  async createAuthor(@Arg("data") data: CreateAuthorInput) {
    const author = Author.create(data);
    await author.save();
    return author;
  }

  @Mutation(() => Author)
  @UseMiddleware([GqlLog])
  async updateAuthor(@Arg("id") id: number, @Arg("data") data: UpdateAuthorInput) {
    const author = await Author.findOne({ where: { id } });
    if (!author) throw new Error("Author not found!");
    Object.assign(author, data);
    await author.save();
    return author;
  }

  @Mutation(() => Boolean)
  @UseMiddleware([GqlLog])
  async deleteAuthor(@Arg("id") id: number) {
    const author = await Author.findOne({ where: { id } });
    if (!author) throw new Error("Author not found!");
    await author.remove();
    return true;
  }
}
