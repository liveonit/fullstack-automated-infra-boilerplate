import { Resolver, Query, Mutation, Arg, UseMiddleware, Int } from "type-graphql";
import { Author, PaginatedAuthors } from "../../models/Author";
import { CreateAuthorInput } from "./types/CreateAuthorInput";
import { UpdateAuthorInput } from "./types/UpdateAuthorInput";
import { GqlLog } from "../../utils/middlewares/GqlLogMiddleware";

@Resolver()
export class AuthorResolver {
  @Query(() => PaginatedAuthors)
  async authors(@Arg("limit", { nullable: true }) limit: number,
    @Arg("offset", { nullable: true }) offset: number): Promise<PaginatedAuthors> {
    let authors: Author[];
    let count: number;
    authors = await Author.find({ relations: ['books'] })
    count = authors.length
    if (offset && limit) {
      authors = authors.slice(offset, offset + limit + 1)
    }
    console.log(authors)
    return {
      count,
      limit: limit || authors.length,
      offset: offset || 0,
      items: authors
    }

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
  async updateAuthor(@Arg("id", type => Int) id: number, @Arg("data") data: UpdateAuthorInput) {
    const author = await Author.findOne({ where: { id } });
    if (!author) throw new Error("Author not found!");
    Object.assign(author, data);
    await author.save();
    return author;
  }

  @Mutation(() => Number)
  @UseMiddleware([GqlLog])
  async deleteAuthor(@Arg("id", type => Int) id: number) {
    const author = await Author.findOne({ where: { id } });
    if (!author) throw new Error("Author not found!");
    await author.remove();
    return id;
  }
}
