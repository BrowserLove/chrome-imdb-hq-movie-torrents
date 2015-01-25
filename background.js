$(document).ready(function() {
    function add_yify_links(movie_selected) {
        $.ajax({
            cache: true,
            type: "GET",
            url: "https://yts.re/api/listimdb.json?imdb_id=" + movie_selected.id,
            dataType: "json"
        }).done(function (json_yify) {
            if (json_yify.MovieCount > 0) {
                append_yify_links(movie_selected, json_yify);
            }
        });
    }
    function append_yify_links(movie_selected, json_yify) {
        var links = $.map(json_yify.MovieList, function(movie){
            return '<a href="' + movie.TorrentMagnetUrl + '">' + movie.Quality + '</a>';
        });

        var links_string = "<div class='secondary'><span>Available for download (magnet link): </span>" + links.join(' ') + "</div>";
        movie_selected.append_after.after(links_string);
    }

    var ListItem = function(list_element){
        this.listElement = list_element;
        this.index = this.listElement.index();

        this.getMovieName = function(){
            return this.listElement.children('div.info').children('b').children('a').text();
        }
        this.getMovieId = function(){
            return this.listElement.children('.image').children('a').children('div').attr('data-const');
        }
        this.getAppendAfter = function(){
            return this.listElement.children('.info').first().children('.rating');
        }

        this.name = this.getMovieName();
        this.id = this.getMovieId();
        this.append_after = this.getAppendAfter();
    }

    $('div.list.detail div.list_item').one('inview', function(e, isInView){
        if(isInView) {
            add_yify_links(new ListItem($(this)));
        }
    });
});