    function add_yify_links(movie_selected) {
        var links_string = "<div class='yify'><span>Available for download (magnet): </span><div class='ajax_spin'></div></div>";
        movie_selected.append_after.after(links_string);
        movie_selected.append_after = movie_selected.append_after.next('.yify');
        var ajax_spinner = movie_selected.append_after.find('.ajax_spin');

        $(document).ready(function() {
            $.ajax({
                cache: true,
                type: "GET",
                url: "https://yts.ag/api/listimdb.json?imdb_id=" + movie_selected.id,
                dataType: "json"
            }).done(function (json_yify) {
                ajax_spinner.hide();
                if (json_yify.MovieCount > 0) {
                    append_yify_links(movie_selected, json_yify);
                }
                else {
                    movie_selected.append_after.append('n/a');
                }
            });
        });
    }

    function append_yify_links(movie_selected, json_yify) {
        var links = $.map(json_yify.MovieList, function(movie){
            return '<a rel="nofollow" href="' + movie.TorrentMagnetUrl + '">' + movie.Quality + '</a>';
        });

        movie_selected.append_after.append(links.join(' '));
    }

    function get_type(){
        var pathname = window.location.pathname;

        if(pathname.match(/\/list/) !== null) {
            return 'list';
        }
        else if(pathname.match(/\/title/) !== null){
            return 'title';
        }
        else if(pathname.match(/\/watchlist/) !== null){
            return 'watchlist';
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
            case 'watchlist':
                return $('.lister-list div.lister-item');
        }
    }

    var MovieItem = function(element, page_type){
        this.element = element;
        this.index = this.element.index();
        this.pageType = page_type;

        //this.getMovieName = function(){
        //    switch(this.pageType){
        //        case 'list':
        //            return this.element.find('div.info > b > a').text();
        //        case 'title':
        //            return this.element.find('h1.header > span[itemprop="name"]').text();
        //        case 'watchlist':
        //            return this.element.find('.lister-item-index').text();
        //    }
        //};
        this.getMovieId = function(){
            switch(this.pageType){
                case 'list':
                    return this.element.find('.image > a > div').attr('data-const');
                case 'title':
                    return this.element.find('div.wlb_classic_wrapper a.wlb_watchlist_btn').attr('data-tconst');
                case 'watchlist':
                    return this.element.find('.ratings-user-rating .userRatingValue').attr('data-tconst');
            }
        };
        this.getAppendAfter = function(){
            switch(this.pageType){
                case 'list':
                    return this.element.find('.info > .rating').first();
                case 'title':
                    return this.element.find('div.star-box-details').first();
                case 'watchlist':
                    return this.element.find('.ratings-bar + p').first();
            }
        };

        //this.name = this.getMovieName();
        this.id = this.getMovieId();
        this.append_after = this.getAppendAfter();
    };

    switch(page_type){
        case 'watchlist':
            function watchlistLinks(){
                $(this).find('.yify').each(function(){ $(this).remove(); });
                add_yify_links(new MovieItem($(this), page_type));
            }
            function watchlistBinds(){
                timer = setInterval(function(){
                    if ($('.lister .lister-working').is(':hidden')) {
                        element = get_content_element(page_type);

                        element.unbind('hoverIntent');
                        element.hoverIntent(watchlistLinks);

                        // $('.lister .lister-page-prev, .lister .lister-page-next').unbind('click');
                        $('.lister .lister-page-prev, .lister .lister-page-next, .lister .lister-sort-reverse, .lister .lister-mode.grid').bind('click', watchlistBinds);
                        $('.lister .lister-sort-by').on('change', watchlistBinds);

                        clearInterval(timer);
                    }
                }, 100);
            }
            var element = get_content_element(page_type);
            element.hoverIntent(watchlistLinks);

            $('.lister .lister-page-prev, .lister .lister-page-next, .lister .lister-sort-reverse, .lister .lister-mode.grid').on('click', watchlistBinds);
            $('.lister .lister-sort-by').on('change', watchlistBinds);

            break;
        default:
            get_content_element(page_type).one('inview', function(e, isInView){
                if(isInView) {
                    add_yify_links(new MovieItem($(this), page_type));
                }
            });
            break;
    }

    $(document).ready(function(){
        $('.lister-list').on('change', function(){
            console.error('Changed');
        });
    });
