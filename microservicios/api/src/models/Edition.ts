import { Entity, BaseEntity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { ObjectType, Field, ID, GraphQLISODateTime } from "type-graphql";
import { Book } from "./Book";

@Entity()
@ObjectType()
export class Edition extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => String)
  @Column()
  code: string;

  @Field(() => GraphQLISODateTime)
  @Column({ type: 'date', nullable: true })
  date: Date;


  @Field(() => Number)
  @Column()
  bookId: number;

  @Field(() => Book)
  @ManyToOne(type => Book, book => book.editions)
  public book: Book
}