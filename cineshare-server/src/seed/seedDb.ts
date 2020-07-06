import { Models } from "../models";
import { extractMovieDetails } from "../controllers/movie";

export default async (models: Models) => {
  const user = await models.User.create({
    email: "mgagliardo91@gmail.com",
    password: "password",
    displayName: "Michael Gagliardo",
  });
  const user2 = await models.User.create({
    email: "tabathakomar@gmail.com",
    password: "password",
    displayName: "Tabatha Komar",
  });
  const movie = await models.Movie.create({
    title: "Snatch",
    imdbId: "tt0208092",
    imageUrl:
      "https://m.media-amazon.com/images/M/MV5BMTA2NDYxOGYtYjU1Mi00Y2QzLTgxMTQtMWI1MGI0ZGQ5MmU4XkEyXkFqcGdeQXVyNDk3NzU2MTQ@._V1_SX300.jpg",
    data: extractMovieDetails({
      Title: "Snatch",
      Year: "2000",
      Rated: "R",
      Released: "19 Jan 2001",
      Runtime: "102 min",
      Genre: "Comedy, Crime",
      Director: "Guy Ritchie",
      Writer: "Guy Ritchie",
      Actors: "Benicio Del Toro, Dennis Farina, Vinnie Jones, Brad Pitt",
      Plot:
        "Unscrupulous boxing promoters, violent bookmakers, a Russian gangster, incompetent amateur robbers and supposedly Jewish jewelers fight to track down a priceless stolen diamond.",
      Language: "English, Russian",
      Country: "UK, USA",
      Awards: "4 wins & 6 nominations.",
      Poster:
        "https://m.media-amazon.com/images/M/MV5BMTA2NDYxOGYtYjU1Mi00Y2QzLTgxMTQtMWI1MGI0ZGQ5MmU4XkEyXkFqcGdeQXVyNDk3NzU2MTQ@._V1_SX300.jpg",
      Ratings: [
        {
          Source: "Internet Movie Database",
          Value: "8.3/10",
        },
        {
          Source: "Rotten Tomatoes",
          Value: "73%",
        },
        {
          Source: "Metacritic",
          Value: "55/100",
        },
      ],
      Metascore: "55",
      imdbRating: "8.3",
      imdbVotes: "756,868",
      imdbID: "tt0208092",
      Type: "movie",
      DVD: "N/A",
      BoxOffice: "N/A",
      Production: "N/A",
      Website: "N/A",
      Response: "True",
    }),
  });
  await models.UserMovie.create({
    movieId: movie.id,
    userId: user.id,
  });
  await models.UserMovie.create({
    movieId: movie.id,
    userId: user2.id,
  });
};
