(function(){
  var app = {
    yts_api_url: "https://yts.ag/api/v2/list_movies.json?query_term=",
    movieId: '',

    init: function(movieId){
      this.movieId = movieId;
      this.cacheDom();
    },

    cacheDom: function(){
      this.movieDownloadBlock = $("<div class='credit_summary_item'><h4 class='inline'>Torrents:</h4></div>");

      this.spinner = $("<div class='ajax_spin'></div>");
      this.movieDownloadBlock.append(this.spinner);

      this.movieDownloadLinks = $("<ul class='torrents'></ul>");
      this.movieDownloadBlock.append(this.movieDownloadLinks);

      $('.credit_summary_item').last().after(this.movieDownloadBlock);
    },

    appendTorrentLink: function(link, quality, isLast){
      this.movieDownloadLinks.append(
        "<li><a href='" + link + "'>" + quality + "</a>" + (!isLast ? ',' : '') + "</li>"
      );
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

    app.init(movieId);
    app.fetchTorrentMagnetLinks();
  });
})();
