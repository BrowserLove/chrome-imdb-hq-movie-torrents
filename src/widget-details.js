import { getMovie } from './yts-api';
import $ from 'jquery';

export default () => {
  $(document).ready(async () => {
    const movieId = $('meta[property="pageId"]').attr('content');

    const movie = await getMovie({ query_term: movieId });
    console.log(movie);
  });
};
