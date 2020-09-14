import { Entity, BaseEntity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { ObjectType, Field, Int } from "type-graphql";
import { Author } from "./Author";
import PaginatedResponse from "../utils/PaginateEntity";

@Entity()
@ObjectType()
export class Book extends BaseEntity {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => String)
  @Column({ nullable: true})
  title: string;

  @Field(() => Boolean)
  @Column({ default: false })
  isPublished: boolean;

  @Field(() => Number)
  @Column()
  authorId: number;

  @Field(() => Author)
  @ManyToOne(type => Author, author => author.books)
  public author: Author

}

@ObjectType()
export class PaginatedBooks extends PaginatedResponse(Book) { };