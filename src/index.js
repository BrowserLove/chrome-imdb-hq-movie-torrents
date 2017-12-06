import { getMovies, getMovie } from './yts-api';

(async () => {
  // const movies = await getMovies({ minimum_rating: 6, limit: 14 });
  // console.log(movies);
  const movie = await getMovie('tt5013056');
  console.log(movie);
})();
