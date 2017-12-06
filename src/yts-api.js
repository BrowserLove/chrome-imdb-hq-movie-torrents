import request from 'request-promise';

const YTS_API_BASE_URL = 'https://yts.ag/api/v2/';

const trackers = [
  'udp://open.demonii.com:1337/announce',
  'udp://tracker.openbittorrent.com:80',
  'udp://tracker.coppersurfer.tk:6969',
  'udp://glotorrents.pw:6969/announce',
  'udp://tracker.opentrackr.org:1337/announce',
  'udp://torrent.gresille.org:80/announce',
  'udp://p4p.arenabg.com:1337',
  'udp://tracker.leechers-paradise.org:6969'
];

const getMagnetUrl = (title, hash) => {
  let trackersString = '';

  trackers.forEach(tracker => {
    trackersString = trackersString + '&tr=' + tracker
  });

  return `magnet:?xt=urn:btih:${hash}&dn=${encodeURI(title)}${trackersString}`;
};

// const parseApiMovies = (movies = []) =>
//   movies.map(({
//     title_long: title,
//     imdb_code: imdbId,
//     rating,
//     yt_trailer_code: youtube,
//     torrents
//   }) => ({
//     title,
//     imdbId,
//     rating,
//     youtube,
//     torrents: torrents.map(({
//       hash,
//       quality,
//       size,
//     }) => ({
//       magnet: getMagnetUrl(title, hash),
//       quality,
//       size
//     }))
// }));

const fetchMovies = (qs = {}) =>
  request({
    uri: `${YTS_API_BASE_URL}list_movies.json`,
    qs,
    json: true
  })
  .then(({ data }) => data)
  .then(({ movies }) => movies);
  // .then(parseApiMovies);

/*
  qs = {
    limit,
    page,
    quality: [720p, 1080p, 3D],
    minimum_rating,
    query_term,
    genre,
    sort_by: [title, year, rating, peers, seeds, download_count, like_count, date_added],
    order_by,
    with_rt_ratings
  }
*/

export const getMovies = qs => fetchMovies(qs);

export const getMovie = qs => fetchMovies(qs).then(movies => movies.length >= 0 ? movies[0] : {});
