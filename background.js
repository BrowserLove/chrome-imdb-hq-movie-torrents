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

    function get_type(){
        var pathname = window.location.pathname;

        if(pathname.match(/list\//) !== null) {
            return 'list';
        }
        else if(pathname.match(/title\//) !== null){
            return 'title'
        }

        return '';
    }
    var page_type = get_type();

    function get_content_element(page_type){
        switch(page_type){
            case 'list':
                return $('div.list.detail div.list_item');
            case 'title':
                return $('div#title-overview-widget');
        }
    }

    var MovieItem = function(element, page_type){
        this.element = element;
        this.index = this.element.index();
        this.pageType = page_type;

        this.getMovieName = function(){
            switch(this.pageType){
                case 'list':
                    return this.element.find('div.info > b > a').text();
                case 'title':
                    return this.element.find('h1.header > span[itemprop="name"]').text();
            }
        };
        this.getMovieId = function(){
            switch(this.pageType){
                case 'list':
                    return this.element.find('.image > a > div').attr('data-const');
                case 'title':
                    return this.element.find('div.wlb_classic_wrapper a.wlb_watchlist_btn').attr('data-tconst');
            }
        };
        this.getAppendAfter = function(){
            switch(this.pageType){
                case 'list':
                    return this.element.find('.info > .rating');
                case 'title':
                    return this.element.find('div.star-box-details');
            }
        };

        this.name = this.getMovieName();
        this.id = this.getMovieId();
        this.append_after = this.getAppendAfter();
    };

    get_content_element(page_type).one('inview', function(e, isInView){
        if(isInView) {
            //console.log(new MovieItem($(this), page_type));
            add_yify_links(new MovieItem($(this), page_type));
        }
    });
});