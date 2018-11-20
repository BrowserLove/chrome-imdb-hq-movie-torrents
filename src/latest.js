(function(){
  var app = {
    fetchLatestMovieTorrents: function() {
      var self = this;

      YTS.fetchMovies($, qs = {
        minimum_rating: 6,
        limit: 50
      }, movies => {
        const filteredMovies = movies.filter(movie => movie.year >= (new Date()).getFullYear() - 3).slice(0, 10);

        self.render(filteredMovies);
      })
    },

    render: function(movies){
      var firstWidget = $('#sidebar').find('.aux-content-widget-2').first();
      var widget = firstWidget.clone();
      var movieLink = widget.find('.rhs-row').first();
      var movieLinkContainer = widget.find('.rhs-body').first();

      widget.find('h3').text('Latest HQ Torrents');
      widget.find('h3').parent().attr('href', '#');
      widget.find('p.seemore').remove();
      widget.find('.rhs-row').remove();

      movieLink.find('.title a').attr('href', window.location.protocol + '//' + window.location.hostname + '/title/');
      movieLink.find('.ribbonize').remove();
      movieLink.find('.action').remove();

      movies.map(function(movie) {
        var newMovieLink = movieLink.clone();

        var titleLink = newMovieLink.find('.title a');
        titleLink.text(movie.title);
        titleLink.attr('href', titleLink.attr('href') + movie.imdbId + '/');
        titleLink.attr('target', '_blank');
        titleLink.parent().addClass('with-ellipsis');

        movieLinkContainer.append(newMovieLink);
        titleLink.before($("<span class='chrome-imdb-rating'>" + (Math.round(movie.rating * 10) / 10).toFixed(1) + "</span>"));
      });

      firstWidget.before(widget);
    }
  }

  $(document).ready(function(){
    if (window.location.pathname !== '/') return;

    app.fetchLatestMovieTorrents();
  });
})();
