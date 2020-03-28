const YTS = require('./yts-api');

(function(){
  var app = {
    fetchLatestMovieTorrents: function() {
      var self = this;

      YTS.fetchMovies($, qs = {
        minimum_rating: 6,
        limit: 50
      }, movies => {
        const filteredMovies = movies.filter(movie => movie.year >= (new Date()).getFullYear() - 3).slice(0, 6);
        self.render(filteredMovies);
      })
    },

    render: function(movies){
      var firstWidget = $('.fan-picks').parent();
      var widget = firstWidget.clone();
      widget.find('h3').text('Latest HQ Torrents');
      widget.find('h3 + div').remove();
      widget.find('.ipc-shoveler__arrow').hide();

      var widgetChildren = widget.find('.ipc-sub-grid');
      var widgetChild = widgetChildren.children().first().clone();
      widgetChildren.empty();

      movies.map(function(movie) {
        var imdbRating = (Math.round(movie.rating * 10) / 10).toFixed(1);
        var movieItem = widgetChild.clone();
        var ratingStar = movieItem.find('.ipc-rating-star svg').clone();

        movieItem.find('.ipc-rating-star').empty().append(ratingStar).append($('<span>').text(imdbRating));
        movieItem.find('.ipc-poster-card__actions').hide();
        movieItem.find('.ipc-watchlist-ribbon').hide();

        var movieImage = movieItem.find('.ipc-image');
        movieImage.attr('src', movie.image);
        movieImage.removeAttr('srcset');

        movieItem.html(movieItem.html()
          .replace(/tt[0-9]{7,}/g, movie.imdbId)
          .replace(movieImage.attr('alt'), movie.title)
        );

        movieItem.find('.ipc-poster-card__title').attr('aria-label', movie.title);
        movieItem.find('.ipc-poster-card__title').text(movie.title);

        widgetChildren.append(movieItem);
      });

      firstWidget.before(widget);
    }
  }

  $(document).ready(function(){
    if (window.location.pathname !== '/') return;

    app.fetchLatestMovieTorrents();
  });
})();
