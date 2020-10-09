import { Resolver, Query, Mutation, Arg, UseMiddleware, Int } from "type-graphql";
import { Book } from "../../models/Book";
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


  @Query(() => [Book])
  async books(@Arg("limit", { nullable: true }) limit: number,
    @Arg("offset", { nullable: true }) offset: number): Promise<Book[]> {
    let books: Book[];
    books = await Book.find({ relations: ['author'] })
    if (offset && limit) {
      books = books.slice(offset, offset + limit + 1)
    }
    return books
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
  book(@Arg("id", t=> Int) id: number) {
    return Book.findOne({ where: { id } });
  }

  @Mutation(() => Book)
  @UseMiddleware([GqlLog])
  async updateBook(@Arg("id", type => Int) id: number, @Arg("data") data: UpdateBookInput) {
    const book = await Book.findOne({ where: { id } });
    if (!book) throw new Error("Book not found!");
    Object.assign(book, data);
    await book.save();
    return book;
  }

  @Mutation(() => Int)
  @UseMiddleware([GqlLog])
  async deleteBook(@Arg("id", type => Int) id: number) {
    const book = await Book.findOne({ where: { id } });
    if (!book) throw new Error("Book not found!");
    await book.remove();
    return id;
  }
}
