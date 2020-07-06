import bent from "bent";
import queryString from "query-string";

const getJSON = bent("json");
const omdbUrl = "http://www.omdbapi.com";
const defaultQueryParameters = {
  apiKey: process.env.OMDB_API_KEY,
};

interface FetchResult {
  [key: string]: any;
  Response: string;
}

export const fetchMovieDetails = async (imdbId: string) => {
  const query = {
    ...defaultQueryParameters,
    i: imdbId,
  };
  const url = queryString.stringifyUrl({ url: omdbUrl, query });
  const result = (await getJSON(url)) as FetchResult;
  if (result.Response == "False") {
    return undefined;
  }

  return result;
};
