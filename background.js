$(document).ready(function() {
    function grab_movie_ids() {
        return $(".list.detail > .list_item > .image > a").map(function (n) {
            return {
                //number: $(this).parent().parent().first().children("div.number").first().text().match(/[0-9]+/)[0],
                number_in_list: n,
                movie_id: $(this).children('div').first().attr('data-const').toString()
            };
        });
    }
    function add_yify_links(movie_selected) {
        //console.log("https://yts.re/api/listimdb.json?imdb_id=" + movie_selected.movie_id);return;
        $.ajax({
            type: "GET",
            url: "https://yts.re/api/listimdb.json?imdb_id=" + movie_selected.movie_id
        }).done(function (json_yify) {
            add_yify_link(movie_selected, json_yify);
            setInterval(function(){  }, 200);
        }).fail(function(){}).error(function(){});
    }
    function add_yify_link(movie_selected, json_yify) {
        if (json_yify.MovieCount > 0) {
            var list_append_el = $('.list.detail > .list_item')
                .eq(movie_selected.number_in_list).children('.info').first().children('.rating').first();

            var links = $.map(json_yify.MovieList, function(movie){
                return '<a href="' + movie.TorrentMagnetUrl + '">' + movie.Quality + '</a>';
            });

            var links_string = "<div class='secondary'><span>Qualities available for download (magnet link): </span>" + links.join(' ') + "</div>";
            list_append_el.after(links_string);
        }
    }

    var grabbed_movie_ids = grab_movie_ids();
    $.each(grabbed_movie_ids, function(){
        add_yify_links(this);
    });
});