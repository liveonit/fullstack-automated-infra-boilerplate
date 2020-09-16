import { Resolver, Query, Mutation, Arg, UseMiddleware } from "type-graphql";
import { Book, PaginatedBooks } from "../../models/Book";
import { CreateBookInput } from "./types/CreateBookInput";
import { UpdateBookInput } from "./types/UpdateBookInput";
import { GqlLog } from "../../utils/middlewares/GqlLogMiddleware";
import { Author } from "../../models/Author";

@Resolver()
export class BookResolver {

  @Query(() => String)
  hello() {
    return "world";
  }


  @Query(() => PaginatedBooks)
  async books(@Arg("limit", { nullable: true }) limit: number,
    @Arg("offset", { nullable: true }) offset: number): Promise<PaginatedBooks> {
    let books: Book[];
    let count: number;
    books = await Book.find({ relations: ['author'] })
    count = books.length
    if (offset && limit) {
      books = books.slice(offset, offset + limit + 1)
    }
    return {
      count,
      limit: limit || books.length,
      offset: offset || 0,
      items: books
    }
  }


  @Mutation(() => Book)
  @UseMiddleware([GqlLog])
  async createBook(@Arg("data") data: CreateBookInput) {
    const book = Book.create(data);
    await book.save();
    book.author = await Author.findOne({ where: { id: data.authorId } })
    return book;
  }

  @Query(() => Book)
  @UseMiddleware([GqlLog])
  book(@Arg("id") id: number) {
    return Book.findOne({ where: { id } });
  }

  @Mutation(() => Book)
  @UseMiddleware([GqlLog])
  async updateBook(@Arg("id") id: number, @Arg("data") data: UpdateBookInput) {
    const book = await Book.findOne({ where: { id } });
    if (!book) throw new Error("Book not found!");
    Object.assign(book, data);
    await book.save();
    return book;
  }

  @Mutation(() => Boolean)
  @UseMiddleware([GqlLog])
  async deleteBook(@Arg("id") id: number) {
    const book = await Book.findOne({ where: { id } });
    if (!book) throw new Error("Book not found!");
    await book.remove();
    return true;
  }
}
