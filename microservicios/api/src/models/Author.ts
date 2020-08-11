import { Entity, BaseEntity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { ObjectType, Field, ID, Int } from "type-graphql";
import { Book } from "./Book";
import PaginatedResponse from "../utils/PaginateEntity";

@Entity()
@ObjectType()
export class Author extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => String)
  @Column()
  name: string;

  @Field(() => String)
  @Column()
  country: string;

  @Field(() => Int)
  @Column()
  age: number;

  @Field(() => [Book])
  @OneToMany(type => Book, book => book.author )
  public books: Book[]
}

@ObjectType()
export class PaginateAuthors extends PaginatedResponse(Author) { };