/* eslint-disable */
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: any }> = { [K in keyof T]: T[K] };

/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  /** A date-time string at UTC, such as 2007-12-03T10:15:30Z, compliant with the `date-time` format outlined in section 5.6 of the RFC 3339 profile of the ISO 8601 standard for representation of dates and times using the Gregorian calendar. */
  DateTime: any;
  /** The `Upload` scalar type represents a file upload. */
  Upload: any;
};

export type IQuery = {
  __typename?: 'Query';
  _?: Maybe<Scalars['Boolean']>;
  users: IUserConnection;
  user?: Maybe<IUser>;
  account: IUser;
  movies: IMovieConnection;
  movie?: Maybe<IMovie>;
  collection: IUserMovieConnection;
};

export type IQueryusersArgs = {
  limit?: Maybe<Scalars['Int']>;
  cursor?: Maybe<Scalars['String']>;
};

export type IQueryuserArgs = {
  id: Scalars['ID'];
};

export type IQuerymovieArgs = {
  id: Scalars['ID'];
};

export type IQuerycollectionArgs = {
  limit?: Maybe<Scalars['Int']>;
  cursor?: Maybe<Scalars['String']>;
};

export type IMutation = {
  __typename?: 'Mutation';
  _?: Maybe<Scalars['Boolean']>;
  signUp: IUserToken;
  signIn: IUserToken;
  addMovie: IUserMovie;
  deleteMovie: Scalars['Boolean'];
};

export type IMutationsignUpArgs = {
  email: Scalars['String'];
  password: Scalars['String'];
};

export type IMutationsignInArgs = {
  email: Scalars['String'];
  password: Scalars['String'];
};

export type IMutationaddMovieArgs = {
  imdbId?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['String']>;
};

export type IMutationdeleteMovieArgs = {
  id: Scalars['String'];
};

export type ISubscription = {
  __typename?: 'Subscription';
  _?: Maybe<Scalars['Boolean']>;
};

export type IPageInfo = {
  __typename?: 'PageInfo';
  cursor?: Maybe<Scalars['String']>;
  hasNextPage: Scalars['Boolean'];
};

export type IUser = {
  __typename?: 'User';
  id: Scalars['ID'];
  collection: IUserMovieConnection;
  email: Scalars['String'];
};

export type IUsercollectionArgs = {
  limit?: Maybe<Scalars['Int']>;
  cursor?: Maybe<Scalars['String']>;
};

export type IUserConnection = {
  __typename?: 'UserConnection';
  edges: Array<IUser>;
  totalCount: Scalars['Int'];
  pageInfo: IPageInfo;
};

export type IUserToken = {
  __typename?: 'UserToken';
  token: Scalars['String'];
};

export type IMovie = {
  __typename?: 'Movie';
  id: Scalars['ID'];
  title: Scalars['String'];
  imdbId: Scalars['String'];
  year: Scalars['Int'];
  rated: Scalars['String'];
  releaseDate: Scalars['DateTime'];
  runTime: Scalars['Int'];
  genre: Array<Scalars['String']>;
  director: Scalars['String'];
  writer: Scalars['String'];
  plot: Scalars['String'];
  imdbRating?: Maybe<Scalars['Float']>;
  rtRating?: Maybe<Scalars['Int']>;
  mcRating?: Maybe<Scalars['Int']>;
};

export type IMovieConnection = {
  __typename?: 'MovieConnection';
  edges: Array<IMovie>;
  totalCount: Scalars['Int'];
  pageInfo: IPageInfo;
};

export type IUserMovie = {
  __typename?: 'UserMovie';
  id: Scalars['ID'];
  movie: IMovie;
  user: IUser;
};

export type IUserMovieConnection = {
  __typename?: 'UserMovieConnection';
  edges: Array<IUserMovie>;
  totalCount: Scalars['Int'];
  pageInfo: IPageInfo;
};

export enum ICacheControlScope {
  PUBLIC = 'PUBLIC',
  PRIVATE = 'PRIVATE',
}
