(function(){
  var app = {
    yts_api_url: "https://yts.ag/api/v2/list_movies.json?minimum_rating=6&sort_by=year&limit=14",

    init: function() {
      this.cacheDom();
    },

    cacheDom: function(){
      this.sidebar = $('#sidebar');
    },

    fetchLatestMovies: function() {
      var self = this;

      axios.get(self.yts_api_url).then(function (response) {
        if(response.data.data && response.data.data.movies) {
          var movies = response.data.data.movies;

          self.render(movies);
        }
      }).catch(function (error) {
        console.log(error);
      });
    },

    render: function(movies){
      var firstWidget = this.sidebar.find('.aux-content-widget-2').first();
      var widget = firstWidget.clone();
      var movieLink = widget.find('.rhs-row').first();
      var movieLinkContainer = widget.find('.rhs-body').first();

      widget.find('h3').text('Latest HQ Torrents');
      widget.find('h3').parent().attr('href', '#');
      widget.find('p.seemore').remove();
      widget.find('.rhs-row').remove();

      movieLink.find('.title a').attr('href', window.location.protocol + '//' + window.location.hostname + '/title/');
      movieLink.find('.ribbonize').remove();

      movies.map(function(movie) {
        var newMovieLink = movieLink.clone();

        var titleLink = newMovieLink.find('.title a');
        titleLink.text(movie.title_long);
        titleLink.attr('href', titleLink.attr('href') + movie.imdb_code + '/');
        titleLink.attr('target', '_blank');
        titleLink.parent().addClass('with-ellipsis');

        movieLinkContainer.append(newMovieLink);
        titleLink.before($("<span class='chrome-imdb-rating'>" + $.number(movie.rating, 1) + "</span>"));
      });

      firstWidget.before(widget);
    }
  }

  $(document).ready(function(){
    if (window.location.pathname !== '/') return;

    app.init();
    app.fetchLatestMovies();
  });
})();
