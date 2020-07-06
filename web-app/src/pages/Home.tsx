import React from 'react';
import { useGetMoviesQuery } from '../api/generated/movies';

const Home = () => {
  const { data, loading } = useGetMoviesQuery();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!data) {
    return null;
  }

  return <div>{JSON.stringify(data.movies)}</div>;
};

export default Home;
