import { getLatestMovies } from './yts-api';

(async () => {
  const movies = await getLatestMovies(7, 14);
  console.log(movies);
})();
