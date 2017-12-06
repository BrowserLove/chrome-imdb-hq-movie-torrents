(function(){
  var app = {
    imdb_stream_api_url: 'https://imdb-stream-api.herokuapp.com/api/',
    yts_api_url: "https://yts.ag/api/v2/list_movies.json?query_term=",
    yts_trackers: [
      'udp://open.demonii.com:1337/announce',
      'udp://tracker.openbittorrent.com:80',
      'udp://tracker.coppersurfer.tk:6969',
      'udp://glotorrents.pw:6969/announce',
      'udp://tracker.opentrackr.org:1337/announce',
      'udp://torrent.gresille.org:80/announce',
      'udp://p4p.arenabg.com:1337',
      'udp://tracker.leechers-paradise.org:6969'
    ],
    movieId: '',
    isTrailerAvailable: true,

    init: function(movieId, isTrailerAvailable){
      this.movieId = movieId;
      this.isTrailerAvailable = isTrailerAvailable;

      this.cacheDom();
    },

    cacheDom: function(){
      this.movieDownloadBlock = $("<div class='credit_summary_item' style='padding: 0;'><h4 class='inline'>Torrents:</h4></div>");
      this.movieStreamingBlock = $("<div class='credit_summary_item'><h4 class='inline'>Watch online:</h4></div>");

      this.spinner = $("<div class='ajax_spin'></div>");
      this.movieDownloadBlock.append(this.spinner);

      this.movieDownloadLinks = $("<ul class='torrents'></ul>");
      this.movieDownloadBlock.append(this.movieDownloadLinks);

      $('.credit_summary_item').last().after(this.movieDownloadBlock);
      this.movieDownloadBlock.after(this.movieStreamingBlock);

      this.movieTrailerBlock = $('<div class="slate"></div>');
      $('.heroic-overview .plot_summary_wrapper').before(this.movieTrailerBlock);
    },

    appendTorrentLink: function(link, quality, isLast){
      this.movieDownloadLinks.append(
        "<li><a href='" + link + "'>" + quality + "</a>" + (!isLast ? ',' : '') + "</li>"
      );
    },

    appendStreamingLink: function(link){
      this.movieStreamingBlock.append(
        "<a target='_blank' href='" + link + "'>Play</a>"
      );
    },

    embedTrailer: function(youtubeVideoId) {
      var embed = $('<iframe width="477" height="268" src="https://www.youtube.com/embed/' + youtubeVideoId + '?rel=0&amp;showinfo=0" frameborder="0" allowfullscreen></iframe>');

      $('.minPosterWithPlotSummaryHeight').attr('class', '').attr('class', 'slate_wrapper');
      $('.heroic-overview .vital').append($('.slate_wrapper'));

      $('.heroic-overview').append($('.plot_summary_wrapper'));
      $('.plot_summary_wrapper .plot_summary').removeClass('minPlotHeightWithPoster');

      this.movieTrailerBlock.append(embed);
    },

    buildMagnetUrl: function(title, hash) {
      var self = this;
      var magnet = 'magnet:?xt=urn:btih:' + hash + '&dn=' + encodeURI(title);

      self.yts_trackers.map(function(tracker) {
        magnet = magnet + '&tr=' + tracker;
      });

      return magnet;
    },

    fetchStreamingLink: function() {
      var self = this;

      axios.get(self.imdb_stream_api_url + self.movieId).then(function(response) {
        if(response.data.streamingUrl) {
          self.appendStreamingLink(response.data.streamingUrl, 'Online', false);
        }
      }).catch(function(error) {
        self.appendStreamingLink('n/a');
        console.log(error);
      })
    },

    fetchTorrentMagnetLinks: function(){
      var self = this;

      axios.get(self.yts_api_url + self.movieId).then(function (response) {
        if(response.data.data && response.data.data.movies && response.data.data.movies[0]) {
          var movie = response.data.data.movies[0];

          movie.torrents.map(function(torrent, i){
            var isLast = i == movie.torrents.length - 1;
            var magnet = self.buildMagnetUrl(movie.title_long + ' [' + torrent.quality + '] [YTS.AG]', torrent.hash);

            self.appendTorrentLink(torrent.url, torrent.quality + ' torrent', false);
            self.appendTorrentLink(magnet, torrent.quality + ' magnet', isLast);
          });

          if(!self.isTrailerAvailable) {
            self.embedTrailer(movie.yt_trailer_code);
          }
        }
        else {
          self.movieDownloadLinks.append('<li>n/a</li>');
        }

        self.spinner.hide();
      }).catch(function (error) {
        console.log(error);

        self.spinner.hide();
      });
    }
  }

  $(document).ready(function(){
    if (window.location.pathname.indexOf('/title/') !== 0) return;

    var movieId = $('meta[property="pageId"]').attr('content');
    var isTrailerAvailable = !!$('.slate_wrapper .slate').length;

    app.init(movieId, isTrailerAvailable);
    app.fetchStreamingLink();
    app.fetchTorrentMagnetLinks();
  });
})();
