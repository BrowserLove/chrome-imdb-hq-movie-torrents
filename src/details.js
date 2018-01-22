(function(){
  var API_URL = "https://chrome-imdb-enhanced-server.herokuapp.com/";

  var app = {
    movieId: '',
    isTrailerAvailable: true,

    init: function(movieId, isTrailerAvailable){
      this.movieId = movieId;
      this.isTrailerAvailable = isTrailerAvailable;

      this.cacheDom();
    },

    cacheDom: function(){
      this.movieDownloadBlock = $("<div class='credit_summary_item' style='padding: 0;'><h4 class='inline'>Torrents:</h4></div>");

      this.spinner = $("<div class='ajax_spin'></div>");
      this.movieDownloadBlock.append(this.spinner);

      this.movieDownloadLinks = $("<ul class='torrents'></ul>");
      this.movieDownloadBlock.append(this.movieDownloadLinks);

      $('.credit_summary_item').last().after(this.movieDownloadBlock);

      if(!this.isTrailerAvailable) {
        this.movieTrailerBlock = $('<div class="slate"></div>');
        $('.heroic-overview .plot_summary_wrapper').before(this.movieTrailerBlock);
      }
    },

    appendLink: function(link, description){
      this.movieDownloadLinks.append(
        "<li><a target='_blank' href='" + link + "'>" + description + "</a></li>"
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

    fetchTorrent: function(onSuccess) {
      var self = this;

      $.ajax({
        method: 'GET',
        url: API_URL + self.movieId,
        dataType: 'json',
      }).done(function(response) {
        onSuccess(response);
        self.spinner.hide();
      }).fail(function(error) {
        console.log(error);
        self.spinner.hide();
      });
    },

    addTorrentLinks: function(){
      var self = this;

      this.fetchTorrent(function (movie) {
        if(movie && movie.title) {
          movie.torrents.map(function(torrent, i){
            self.appendLink(torrent.url, torrent.quality + ' torrent');
            self.appendLink(torrent.magnet, torrent.quality + ' magnet');
          });

          app.appendLink('https://www.google.com/search?q=' + encodeURIComponent('stream online ' + movie.title) + '&btnI=Im+Feeling+Lucky', 'Online');

          if(!self.isTrailerAvailable) {
            self.embedTrailer(movie.youtube);
          }
        }
        else {
          self.movieDownloadLinks.append('<li>n/a</li>');
        }
      });
    }
  }

  $(document).ready(function(){
    if (window.location.pathname.indexOf('/title/') !== 0) return;

    var movieId = $('meta[property="pageId"]').attr('content');
    var isTrailerAvailable = !!$('.slate_wrapper .slate').length;

    app.init(movieId, isTrailerAvailable);
    app.addTorrentLinks();
  });
})();
