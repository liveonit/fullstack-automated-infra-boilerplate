export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

export type Author = {
  __typename?: 'Author';
  id: Scalars['Int'];
  name: Scalars['String'];
  country: Scalars['String'];
  age: Scalars['Int'];
  books?: Maybe<Array<Book>>;
};

export type Book = {
  __typename?: 'Book';
  id: Scalars['Int'];
  title: Scalars['String'];
  isPublished: Scalars['Boolean'];
  authorId: Scalars['Float'];
  author?: Maybe<Author>;
};

export type CreateAuthorInput = {
  name: Scalars['String'];
  country?: Maybe<Scalars['String']>;
  age: Scalars['Int'];
};

export type CreateBookInput = {
  title?: Maybe<Scalars['String']>;
  authorId: Scalars['Int'];
  isPublished?: Maybe<Scalars['Boolean']>;
};

export type CreateRoleInput = {
  name: Scalars['String'];
  description?: Maybe<Scalars['String']>;
};

export type CreateUserInput = {
  username: Scalars['String'];
  password: Scalars['String'];
  enabled: Scalars['Boolean'];
  firstName: Scalars['String'];
  lastName: Scalars['String'];
  email: Scalars['String'];
  realmRoles: Array<Scalars['String']>;
};

export type Log = {
  __typename?: 'Log';
  id: Scalars['Int'];
  operation: Scalars['String'];
  operationType: Scalars['String'];
  payload: Scalars['String'];
  unixStartTime: Scalars['Float'];
  executionTime: Scalars['Float'];
  resultPayload: Scalars['String'];
};

export type Mutation = {
  __typename?: 'Mutation';
  createBook: Book;
  updateBook: Book;
  deleteBook: Scalars['Int'];
  createAuthor: Author;
  updateAuthor: Author;
  deleteAuthor: Scalars['Float'];
  createUser: User;
  updateUser: User;
  deleteUser: Scalars['String'];
  createRole: Role;
  updateRole: Role;
  deleteRole: Scalars['String'];
};


export type MutationCreateBookArgs = {
  data: CreateBookInput;
};


export type MutationUpdateBookArgs = {
  data: UpdateBookInput;
  id: Scalars['Int'];
};


export type MutationDeleteBookArgs = {
  id: Scalars['Int'];
};


export type MutationCreateAuthorArgs = {
  data: CreateAuthorInput;
};


export type MutationUpdateAuthorArgs = {
  data: UpdateAuthorInput;
  id: Scalars['Int'];
};


export type MutationDeleteAuthorArgs = {
  id: Scalars['Int'];
};


export type MutationCreateUserArgs = {
  data: CreateUserInput;
};


export type MutationUpdateUserArgs = {
  data: UpdateUserInput;
  id: Scalars['String'];
};


export type MutationDeleteUserArgs = {
  id: Scalars['String'];
};


export type MutationCreateRoleArgs = {
  data: CreateRoleInput;
};


export type MutationUpdateRoleArgs = {
  data: UpdateRoleInput;
  id: Scalars['String'];
};


export type MutationDeleteRoleArgs = {
  id: Scalars['String'];
};

export type Query = {
  __typename?: 'Query';
  hello: Scalars['String'];
  books: Array<Book>;
  book: Book;
  authors: Array<Author>;
  author: Author;
  logs: Array<Log>;
  users: Array<User>;
  user: User;
  roles: Array<Role>;
  role: Role;
};


export type QueryBooksArgs = {
  offset?: Maybe<Scalars['Float']>;
  limit?: Maybe<Scalars['Float']>;
};


export type QueryBookArgs = {
  id: Scalars['Int'];
};


export type QueryAuthorsArgs = {
  offset?: Maybe<Scalars['Float']>;
  limit?: Maybe<Scalars['Float']>;
};


export type QueryAuthorArgs = {
  id: Scalars['Int'];
};


export type QueryLogsArgs = {
  timeEnd?: Maybe<Scalars['Float']>;
  timeStart?: Maybe<Scalars['Float']>;
  offset?: Maybe<Scalars['Float']>;
  limit?: Maybe<Scalars['Float']>;
};


export type QueryUsersArgs = {
  offset?: Maybe<Scalars['Float']>;
  limit?: Maybe<Scalars['Float']>;
};


export type QueryUserArgs = {
  id: Scalars['String'];
};


export type QueryRolesArgs = {
  offset?: Maybe<Scalars['Float']>;
  limit?: Maybe<Scalars['Float']>;
};


export type QueryRoleArgs = {
  id: Scalars['Int'];
};

export type Role = {
  __typename?: 'Role';
  id: Scalars['String'];
  name: Scalars['String'];
  description?: Maybe<Scalars['String']>;
};

export type Subscription = {
  __typename?: 'Subscription';
  logsSubscription: Log;
};

export type UpdateAuthorInput = {
  name?: Maybe<Scalars['String']>;
  country?: Maybe<Scalars['String']>;
  age?: Maybe<Scalars['Int']>;
};

export type UpdateBookInput = {
  title?: Maybe<Scalars['String']>;
  authorId?: Maybe<Scalars['Int']>;
  isPublished?: Maybe<Scalars['Boolean']>;
};

export type UpdateRoleInput = {
  name?: Maybe<Scalars['String']>;
  description?: Maybe<Scalars['String']>;
};

export type UpdateUserInput = {
  username?: Maybe<Scalars['String']>;
  password: Scalars['String'];
  enabled?: Maybe<Scalars['Boolean']>;
  firstName?: Maybe<Scalars['String']>;
  lastName?: Maybe<Scalars['String']>;
  email?: Maybe<Scalars['String']>;
  realmRoles?: Maybe<Array<Scalars['String']>>;
};

export type User = {
  __typename?: 'User';
  id: Scalars['String'];
  username: Scalars['String'];
  password?: Maybe<Scalars['String']>;
  enabled: Scalars['Boolean'];
  totp: Scalars['Boolean'];
  emailVerified: Scalars['Boolean'];
  firstName: Scalars['String'];
  lastName: Scalars['String'];
  email: Scalars['String'];
  disableableCredentialTypes: Array<Scalars['String']>;
  requiredActions: Array<Scalars['String']>;
  notBefore: Scalars['Int'];
  realmRoles: Array<Scalars['String']>;
};
