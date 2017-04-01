(function(){
  var app = {
    yts_url: "https://yts.ag/",
    movieTitle: '',

    init: function(movieTitle){
      this.movieTitle = movieTitle;
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

    appendTorrentLink: function(link, quality, type, isLast){
      this.movieDownloadLinks.append(
        "<li><a href='" + link + "'>" + quality + " " + type + "</a>" + (!isLast ? ',' : '') + "</li>"
      );
    },

    fetchTorrentMagnetLinks: function(){
      var self = this;

      axios.get(self.yts_url + "ajax/search", { params: {
          query: self.movieTitle
      }}).then(function (response) {
        if(response.data.data && response.data.data[0]){
          axios.get(response.data.data[0].url).then(function (response) {

            var links = $(response.data).find('.modal-download a');
            links.each(function(i, link){
              var link = $(link);
              var quality = link.attr('title').split(' ');

          		self.appendTorrentLink(
                link.attr('href'),
                quality[quality.length - 2],
                link.text().toLowerCase() == 'download' ? 'torrent' : 'magnet',
                links.length - 1 == i
              );
          	});

            self.spinner.hide();
          }).catch(function (error) {
            console.log(error);
          });
        }
      }).catch(function (error) {
        console.log(error);
      });
    }
  }

  $(document).ready(function(){
    var movieTitle = $('h1[itemprop="name"]').text().split('(')[0].trim();

    app.init(movieTitle);
    app.fetchTorrentMagnetLinks();
  });
})();
