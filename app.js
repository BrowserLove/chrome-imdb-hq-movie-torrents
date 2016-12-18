(function(){
  var app = {
    yts_api_url: "https://yts.ag/api/v2/",

    movie: {
      id: '',
      magnet: ''
    },

    init: function(movieId){
      this.movie.id = movieId;

      if(this.movie.id == '' || this.movie.id == undefined){
        console.error('Movie ID not set');
      }

      this.cacheDom();
    },
    cacheDom: function(){
      this.movieDownloadBlock = $("<div class='credit_summary_item'><h4 class='inline'>Torrent:</h4></div>");

      this.spinner = $("<div class='ajax_spin'></div>");
      this.movieDownloadBlock.append(this.spinner);

      this.movieDownloadLinks = $("<ul></ul>");
      this.movieDownloadBlock.append(this.movieDownloadLinks);

      $('.credit_summary_item').last().after(this.movieDownloadBlock);
    },
    fetchMovieMagnetLink(){
      axios({
        method: 'get',
        url: this.yts_api_url + "movie_details.jsonp?movie_id=" + this.movie.id
      })
      .then(function (response) {
        console.log(response);

        this.render();
      }.bind(this))
      .catch(function (error) {
        console.log(error);
      });
    },
    render: function(){
      if(this.movie.magnet != ''){
        //

        this.spinner.hide();
      }
    }
  }

  $(document).ready(function(){
    var movieId = location.href.match(/\/tt([0-9]+)\//)[1];

    app.init(movieId);
    app.fetchMovieMagnetLink();
  });
})();
