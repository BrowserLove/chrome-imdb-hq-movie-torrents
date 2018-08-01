let YTS = {};

YTS.getMagnetUrl = (title, hash) => {
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

  let trackersString = '';

  trackers.forEach(tracker => {
    trackersString = trackersString + '&tr=' + tracker
  });

  return `magnet:?xt=urn:btih:${hash}&dn=${encodeURI(title)}${trackersString}`;
};

YTS.parseApiMovies = (movies = []) =>
  movies.length > 0 ? movies.map(({
    title_long: title,
    imdb_code: imdbId,
    rating,
    year,
    yt_trailer_code: youtube,
    torrents
  }) => ({
    title,
    year,
    imdbId,
    rating,
    youtube,
    stream: 'https://www.google.com/search?q=' + encodeURIComponent('watch online ' + title) + '&btnI=Im+Feeling+Lucky',
    netflix: 'https://www.google.com/search?q=' + encodeURIComponent('netflix.com ' + title) + '&btnI=Im+Feeling+Lucky',
    torrents: torrents && torrents.length > 0 ? torrents.map(({
      url,
      hash,
      quality,
      size,
    }) => ({
      url,
      magnet: YTS.getMagnetUrl(title, hash),
      quality,
      size
    })) : []
})) : [];

YTS.fetchMovies = ($, qs = {}, cb) =>
  $.getJSON(`https://yts.am/api/v2/list_movies.jsonp?${$.param(qs)}`, response => {
    console.log(response.data.movies)
    cb(YTS.parseApiMovies(response.data.movies))
  })

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
