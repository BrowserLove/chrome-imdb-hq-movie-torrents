$(document).ready(function() {
    //console.log('Loaded');

    function grab_movie_ids() {
        return $(".list.detail > .list_item > .image > a").map(function (n) {
            return {
                //number: $(this).parent().parent().first().children("div.number").first().text().match(/[0-9]+/)[0],
                number_in_list: n,
                movie_id: $(this).children('div').first().attr('data-const').toString()
            };
        });
    }
    var grabbed_movie_ids = grab_movie_ids();
//console.log(grabbed_movie_ids);
//console.log(grabbed_imdb_movie_ids.length);

    var movie_selected = grabbed_movie_ids[0];

    function add_yify_links(movie_id) {
        //console.log("https://yts.re/api/listimdb.json?imdb_id=" + movie_id);

        $.ajax({
            type: "GET",
            url: "https://yts.re/api/listimdb.json?imdb_id=" + movie_id
        }).done(function (json) {
            add_yify_link(json);
        });
    }
    add_yify_links(movie_selected.movie_id);

    function add_yify_link(json_yify) {
        if (json_yify.MovieCount > 0) {
            //console.log(json_yify);

            var list_append_el = $('.list.detail > .list_item')
                .eq(movie_selected.number_in_list).children('.info').first().children('.rating').first();
            //console.log(list_append_el);

            var links = $.map(json_yify.MovieList, function(movie){
                return '<a href="' + movie.TorrentMagnetUrl + '">' + movie.Quality + '</a>';
            });

            var links_string = "<div class='secondary'><span>Qualities available for download (magnet link): </span>" + links.join(' ') + "</div>";

            list_append_el.after(links_string);
        }
    }

    //console.log('Done');
});