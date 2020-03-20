import bent from 'bent';
import queryString from 'query-string';

const getJSON = bent('json')
const omdbUrl = 'http://www.omdbapi.com';
const defaultQueryParameters = {
  apiKey: process.env.OMDB_API_KEY
};

export const fetchMovieDetails = async imdbId => {
  const query = {
    ...defaultQueryParameters,
    i: imdbId
  };
  const url = queryString.stringifyUrl({ url: omdbUrl, query });
  const result = await getJSON(url);
  if (result.Response == 'False') {
    return undefined;
  }

  return result;
};