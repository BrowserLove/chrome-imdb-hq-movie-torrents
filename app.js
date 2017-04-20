(function(){
  var app = {
    yts_api_url: "https://yts.ag/api/v2/list_movies.json?query_term=",
    movieId: '',
    isTrailerAvailable: true,

    init: function(movieId, isTrailerAvailable){
      this.movieId = movieId;
      this.isTrailerAvailable = isTrailerAvailable;

      this.cacheDom();
    },

    cacheDom: function(){
      this.movieDownloadBlock = $("<div class='credit_summary_item'><h4 class='inline'>Torrents:</h4></div>");

      this.spinner = $("<div class='ajax_spin'></div>");
      this.movieDownloadBlock.append(this.spinner);

      this.movieDownloadLinks = $("<ul class='torrents'></ul>");
      this.movieDownloadBlock.append(this.movieDownloadLinks);

      $('.credit_summary_item').last().after(this.movieDownloadBlock);

      this.movieTrailerBlock = $('<div class="slate"></div>');
      $('.heroic-overview .plot_summary_wrapper').before(this.movieTrailerBlock);
    },

    appendTorrentLink: function(link, quality, isLast){
      this.movieDownloadLinks.append(
        "<li><a href='" + link + "'>" + quality + "</a>" + (!isLast ? ',' : '') + "</li>"
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

    fetchTorrentMagnetLinks: function(){
      var self = this;

      axios.get(self.yts_api_url + self.movieId).then(function (response) {
        if(response.data.data && response.data.data.movies && response.data.data.movies[0]) {
          response.data.data.movies[0].torrents.map(function(torrent, i){
            self.appendTorrentLink(
              torrent.url,
              torrent.quality,
              i == response.data.data.movies[0].torrents.length - 1
            );
          });

          if(!self.isTrailerAvailable) {
            self.embedTrailer(response.data.data.movies[0].yt_trailer_code);
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
    var movieId = $('meta[property="pageId"]').attr('content');
    var isTrailerAvailable = !!$('.slate_wrapper .slate').length;

    app.init(movieId, isTrailerAvailable);
    app.fetchTorrentMagnetLinks();
  });
})();
