import request from 'request-promise';

const YTS_API_BASE_URL = 'https://yts.ag/api/v2/';

export const getLatestMovies = (minimum_rating = 5, limit = 10) =>
  request({
    uri: `${YTS_API_BASE_URL}list_movies.json`,
    qs: {
      minimum_rating,
      limit
    },
    json: true
  })
  .then(({ data }) => data)
  .then(({ movies }) => movies)
  .then(movies =>
    movies.map(({ title_long, imdb_code, rating }) => ({ title_long, imdb_code, rating }))
  );
