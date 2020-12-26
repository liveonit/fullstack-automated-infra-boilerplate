import * as Types from './schemas';

export type GetAuthorsQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type GetAuthorsQuery = (
  { __typename?: 'Query' }
  & { authors: Array<(
    { __typename?: 'Author' }
    & Pick<Types.Author, 'id' | 'name' | 'age' | 'country'>
  )> }
);

export type GetAuthorQueryVariables = Types.Exact<{
  id: Types.Scalars['Int'];
}>;


export type GetAuthorQuery = (
  { __typename?: 'Query' }
  & { author: (
    { __typename?: 'Author' }
    & Pick<Types.Author, 'id' | 'name' | 'age' | 'country'>
  ) }
);

export type CreateAuthorMutationVariables = Types.Exact<{
  name: Types.Scalars['String'];
  age: Types.Scalars['Int'];
  country?: Types.Maybe<Types.Scalars['String']>;
}>;


export type CreateAuthorMutation = (
  { __typename?: 'Mutation' }
  & { createAuthor: (
    { __typename?: 'Author' }
    & Pick<Types.Author, 'id' | 'age' | 'name' | 'country'>
  ) }
);

export type UpdateAuthorMutationVariables = Types.Exact<{
  id: Types.Scalars['Int'];
  name?: Types.Maybe<Types.Scalars['String']>;
  age?: Types.Maybe<Types.Scalars['Int']>;
  country?: Types.Maybe<Types.Scalars['String']>;
}>;


export type UpdateAuthorMutation = (
  { __typename?: 'Mutation' }
  & { updateAuthor: (
    { __typename?: 'Author' }
    & Pick<Types.Author, 'id' | 'age' | 'name' | 'country'>
  ) }
);

export type DeleteAuthorMutationVariables = Types.Exact<{
  id: Types.Scalars['Int'];
}>;


export type DeleteAuthorMutation = (
  { __typename?: 'Mutation' }
  & Pick<Types.Mutation, 'deleteAuthor'>
);

export type GetBooksQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type GetBooksQuery = (
  { __typename?: 'Query' }
  & { books: Array<(
    { __typename?: 'Book' }
    & Pick<Types.Book, 'id' | 'title' | 'isPublished'>
    & { author?: Types.Maybe<(
      { __typename?: 'Author' }
      & Pick<Types.Author, 'id' | 'name'>
    )> }
  )> }
);

export type GetBooksAndAuthorsQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type GetBooksAndAuthorsQuery = (
  { __typename?: 'Query' }
  & { books: Array<(
    { __typename?: 'Book' }
    & Pick<Types.Book, 'id' | 'title' | 'isPublished' | 'authorId'>
    & { author?: Types.Maybe<(
      { __typename?: 'Author' }
      & Pick<Types.Author, 'id' | 'name'>
    )> }
  )>, authors: Array<(
    { __typename?: 'Author' }
    & Pick<Types.Author, 'id' | 'name'>
  )> }
);

export type GetBookQueryVariables = Types.Exact<{
  id: Types.Scalars['Int'];
}>;


export type GetBookQuery = (
  { __typename?: 'Query' }
  & { book: (
    { __typename?: 'Book' }
    & Pick<Types.Book, 'id' | 'title' | 'isPublished' | 'authorId'>
    & { author?: Types.Maybe<(
      { __typename?: 'Author' }
      & Pick<Types.Author, 'id' | 'name'>
    )> }
  ) }
);

export type CreateBookMutationVariables = Types.Exact<{
  title: Types.Scalars['String'];
  isPublished?: Types.Maybe<Types.Scalars['Boolean']>;
  authorId: Types.Scalars['Int'];
}>;


export type CreateBookMutation = (
  { __typename?: 'Mutation' }
  & { createBook: (
    { __typename?: 'Book' }
    & Pick<Types.Book, 'id' | 'title' | 'isPublished'>
    & { author?: Types.Maybe<(
      { __typename?: 'Author' }
      & Pick<Types.Author, 'id' | 'name'>
    )> }
  ) }
);

export type UpdateBookMutationVariables = Types.Exact<{
  id: Types.Scalars['Int'];
  title?: Types.Maybe<Types.Scalars['String']>;
  isPublished?: Types.Maybe<Types.Scalars['Boolean']>;
  authorId?: Types.Maybe<Types.Scalars['Int']>;
}>;


export type UpdateBookMutation = (
  { __typename?: 'Mutation' }
  & { updateBook: (
    { __typename?: 'Book' }
    & Pick<Types.Book, 'id' | 'title' | 'isPublished'>
    & { author?: Types.Maybe<(
      { __typename?: 'Author' }
      & Pick<Types.Author, 'id' | 'name'>
    )> }
  ) }
);

export type DeleteBookMutationVariables = Types.Exact<{
  id: Types.Scalars['Int'];
}>;


export type DeleteBookMutation = (
  { __typename?: 'Mutation' }
  & Pick<Types.Mutation, 'deleteBook'>
);

export type GetLogsQueryVariables = Types.Exact<{
  timeStart?: Types.Maybe<Types.Scalars['Float']>;
  timeEnd?: Types.Maybe<Types.Scalars['Float']>;
}>;


export type GetLogsQuery = (
  { __typename?: 'Query' }
  & { logs: Array<(
    { __typename?: 'Log' }
    & Pick<Types.Log, 'id' | 'operation' | 'operationType' | 'payload' | 'unixStartTime' | 'executionTime' | 'resultPayload'>
  )> }
);

export type SubLogsSubscriptionVariables = Types.Exact<{ [key: string]: never; }>;


export type SubLogsSubscription = (
  { __typename?: 'Subscription' }
  & { logsSubscription: (
    { __typename?: 'Log' }
    & Pick<Types.Log, 'executionTime' | 'id' | 'operation' | 'operationType' | 'payload' | 'resultPayload' | 'unixStartTime'>
  ) }
);

export type GetRolesQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type GetRolesQuery = (
  { __typename?: 'Query' }
  & { roles: Array<(
    { __typename?: 'Role' }
    & Pick<Types.Role, 'id' | 'name' | 'description'>
  )> }
);

export type GetRoleQueryVariables = Types.Exact<{
  id: Types.Scalars['Int'];
}>;


export type GetRoleQuery = (
  { __typename?: 'Query' }
  & { role: (
    { __typename?: 'Role' }
    & Pick<Types.Role, 'id' | 'name' | 'description'>
  ) }
);

export type CreateRoleMutationVariables = Types.Exact<{
  name: Types.Scalars['String'];
  description?: Types.Maybe<Types.Scalars['String']>;
}>;


export type CreateRoleMutation = (
  { __typename?: 'Mutation' }
  & { createRole: (
    { __typename?: 'Role' }
    & Pick<Types.Role, 'id' | 'name' | 'description'>
  ) }
);

export type UpdateRoleMutationVariables = Types.Exact<{
  id: Types.Scalars['String'];
  name?: Types.Maybe<Types.Scalars['String']>;
  description?: Types.Maybe<Types.Scalars['String']>;
}>;


export type UpdateRoleMutation = (
  { __typename?: 'Mutation' }
  & { updateRole: (
    { __typename?: 'Role' }
    & Pick<Types.Role, 'id' | 'name' | 'description'>
  ) }
);

export type DeleteRoleMutationVariables = Types.Exact<{
  id: Types.Scalars['String'];
}>;


export type DeleteRoleMutation = (
  { __typename?: 'Mutation' }
  & Pick<Types.Mutation, 'deleteRole'>
);

export type GetUsersQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type GetUsersQuery = (
  { __typename?: 'Query' }
  & { users: Array<(
    { __typename?: 'User' }
    & Pick<Types.User, 'id' | 'username' | 'enabled' | 'firstName' | 'lastName' | 'email' | 'relatedRoleIds'>
    & { roles?: Types.Maybe<Array<(
      { __typename?: 'Role' }
      & Pick<Types.Role, 'id' | 'name'>
    )>> }
  )> }
);

export type GetUserAndRolesQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type GetUserAndRolesQuery = (
  { __typename?: 'Query' }
  & { users: Array<(
    { __typename?: 'User' }
    & Pick<Types.User, 'id' | 'username' | 'enabled' | 'firstName' | 'lastName' | 'email' | 'relatedRoleIds'>
    & { roles?: Types.Maybe<Array<(
      { __typename?: 'Role' }
      & Pick<Types.Role, 'id' | 'name'>
    )>> }
  )>, roles: Array<(
    { __typename?: 'Role' }
    & Pick<Types.Role, 'id' | 'name'>
  )> }
);

export type GetUserQueryVariables = Types.Exact<{
  id: Types.Scalars['String'];
}>;


export type GetUserQuery = (
  { __typename?: 'Query' }
  & { user: (
    { __typename?: 'User' }
    & Pick<Types.User, 'id' | 'username' | 'enabled' | 'firstName' | 'lastName' | 'email' | 'relatedRoleIds'>
    & { roles?: Types.Maybe<Array<(
      { __typename?: 'Role' }
      & Pick<Types.Role, 'id' | 'name'>
    )>> }
  ) }
);

export type CreateUserMutationVariables = Types.Exact<{
  username: Types.Scalars['String'];
  email: Types.Scalars['String'];
  enabled: Types.Scalars['Boolean'];
  firstName: Types.Scalars['String'];
  lastName: Types.Scalars['String'];
  password: Types.Scalars['String'];
  relatedRoleIds: Array<Types.Scalars['String']>;
}>;


export type CreateUserMutation = (
  { __typename?: 'Mutation' }
  & { createUser: (
    { __typename?: 'User' }
    & Pick<Types.User, 'id' | 'username' | 'enabled' | 'firstName' | 'lastName' | 'email' | 'relatedRoleIds'>
    & { roles?: Types.Maybe<Array<(
      { __typename?: 'Role' }
      & Pick<Types.Role, 'id' | 'name'>
    )>> }
  ) }
);

export type UpdateUserMutationVariables = Types.Exact<{
  id: Types.Scalars['String'];
  username?: Types.Maybe<Types.Scalars['String']>;
  email?: Types.Maybe<Types.Scalars['String']>;
  enabled?: Types.Maybe<Types.Scalars['Boolean']>;
  firstName?: Types.Maybe<Types.Scalars['String']>;
  lastName?: Types.Maybe<Types.Scalars['String']>;
  password?: Types.Maybe<Types.Scalars['String']>;
  relatedRoleIds?: Types.Maybe<Array<Types.Scalars['String']>>;
}>;


export type UpdateUserMutation = (
  { __typename?: 'Mutation' }
  & { updateUser: (
    { __typename?: 'User' }
    & Pick<Types.User, 'id' | 'username' | 'enabled' | 'firstName' | 'lastName' | 'email' | 'relatedRoleIds'>
    & { roles?: Types.Maybe<Array<(
      { __typename?: 'Role' }
      & Pick<Types.Role, 'id' | 'name'>
    )>> }
  ) }
);

export type DeleteUserMutationVariables = Types.Exact<{
  id: Types.Scalars['String'];
}>;


export type DeleteUserMutation = (
  { __typename?: 'Mutation' }
  & Pick<Types.Mutation, 'deleteUser'>
);
