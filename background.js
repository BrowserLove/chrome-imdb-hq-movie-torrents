$(document).ready(function() {
    yify_movies = $.cookie("yify_movies");
    if(yify_movies == undefined){
        yify_movies = [];
    }
    else{
        yify_movies = JSON.parse(yify_movies);
    }

    function grab_movie_ids() {
        return $.makeArray(
            $(".list.detail > .list_item > .image > a").map(function (n) {
                return {
                    //number: $(this).parent().parent().first().children("div.number").first().text().match(/[0-9]+/)[0],
                    number_in_list: n,
                    movie_id: $(this).children('div').first().attr('data-const').toString()
                };
            })
        );
    }
    function add_yify_links(movie_selected) {
        json_yify = "";

        $.each(yify_movies, function() {
            if(this.MovieList[0].ImdbCode == movie_selected.movie_id){
                json_yify = this;
                add_yify_link(movie_selected, this);
                return true;
            }
        });

        if(json_yify != ""){
            return true;
        }

        $.ajax({
            type: "GET",
            url: "https://yts.re/api/listimdb.json?imdb_id=" + movie_selected.movie_id
        }).done(function (json_yify) {
            if (json_yify.MovieCount > 0) {
                yify_movies.push(json_yify);
                $.cookie("yify_movies", JSON.stringify(yify_movies));

                add_yify_link(movie_selected, json_yify);
            }
            //setInterval(function(){  }, 200);
        });
    }
    function add_yify_link(movie_selected, json_yify) {
        var list_append_el = $('.list.detail > .list_item')
            .eq(movie_selected.number_in_list).children('.info').first().children('.rating').first();

        var links = $.map(json_yify.MovieList, function(movie){
            return '<a href="' + movie.TorrentMagnetUrl + '">' + movie.Quality + '</a>';
        });

        var links_string = "<div class='secondary'><span>Qualities available for download (magnet link): </span>" + links.join(' ') + "</div>";
        list_append_el.after(links_string);
    }

    var grabbed_movie_ids = grab_movie_ids();
    $.each(grabbed_movie_ids, function(n, value){
        add_yify_links(this);
    });
});