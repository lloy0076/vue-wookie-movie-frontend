import lodash from 'lodash';

/**
 * A Movie Loader class.
 */
export default class MovieLoader {
    /**
     * Make the movie loader.
     *
     * @Note These tokens and keys really shouldn't be here; however as this will go client side there's no true security risk.
     *
     *
     * @param requestClient
     * @param token The token.
     * @param url The URL.
     * @param omdbKey The OMDB key.
     */
    constructor(requestClient, token = "Wookie2019", url = "https://wookie.codesubmit.io/movies", omdbKey = "a7b8f9f") {
        this.token = token;
        this.requestClient = requestClient;
        this.url = url;
        this.omdbKey = omdbKey;
    }

    /**
     * Get the URL.
     *
     * @param url
     * @param queryParams
     * @param token
     * @returns {{}}
     */
    get(url = undefined, queryParams = undefined, token = undefined) {
        let localUrl = url || this.url;
        let localToken = token || this.token;
        let localParams = queryParams || [];

        let localHeaders = {
            "Authorization": `Bearer ${localToken}`
        };

        return this.requestClient.request({
            "method": "GET",
            "url": localUrl,
            "params": localParams,
            "headers": localHeaders,
        });
    }

    /**
     * Get OMDB data.
     *
     * @param title
     */
    getOmdbData(title = undefined) {
        if (undefined === title) {
            return;
        }

        return this.requestClient.request({
            "method": "GET",
            "url": "http://www.omdbapi.com/",
            "params": {"apikey": this.omdbKey, "t": title}
        });
    }

    /**
     * Gets the movies.
     *
     * @returns {{}}
     */
    getMovies() {
        return this.get();
    }

    /**
     * Search the movies.
     *
     * @param search What to search for.
     * @param currentSlug Our current slug, if any.
     * @returns {Q.Promise<Array> | * | PromiseLike<Array>}
     */
    searchForMoviesTitle(search = "", currentSlug = "") {
        currentSlug = null;

        return this.get(this.url, {"q": search}).then((response) => {
            let allMovies = response.data.movies;

            return lodash.map(lodash.filter(allMovies, function (value) {
                return value.slug !== currentSlug;
            }), function (value) {
                return [value.title, value.slug]
            });
        });
    }

    /**
     * Gets the movie by slug.
     */
    getMovieBySlug(search) {
        return this.get(this.url, {"q": search}).then((response) => {
            let allMovies = response.data.movies;

            return allMovies[0];
        });
    }


    /**
     * Search for a movie.
     *
     * @param search
     * @param sort
     * @param currentSlug
     * @returns {{}}
     */
    searchForMovies(search = "", sort = true, currentSlug = "") {
        currentSlug = null;

        if (undefined === search || "" === search) {
            return this.getMoviesSortedByGenre();
        }

        return this.get(this.url, {"q": search}).then((response) => {
            let allMoviesByGenres;

            let allMovies = response.data.movies;
            let genre = "Search Results";

            // This is messy but it works :)
            allMoviesByGenres = {};
            allMoviesByGenres[genre] = [];

            lodash.forEach(lodash.filter(allMovies, function (value) {
                return value.slug !== currentSlug;
            }), function (movie) {
                allMoviesByGenres[genre].push({"info": movie});
            });

            let them;

            if (true === sort) {
                them = lodash.sortBy(allMoviesByGenres[genre], "info.title");
            } else {
                them = allMoviesByGenres[genre];
            }

            let item = {
                "id": genre,
                "movies": them
            };

            return [item];
        });
    }

    /**
     * Get all movies sorted by genre.
     *
     * @returns {Q.Promise<[]> | * | PromiseLike<[]>}
     */
    getMoviesSortedByGenre() {
        return this.get().then((response) => {
            return this.sortResponseByGenreForFrontend(response);
        }).catch((error) => {
            window.console.error(error);
        })
    }

    /**
     * Sort a response for the front end.
     *
     * @param response
     * @returns {[]}
     */
    sortResponseByGenreForFrontend(response) {
        let allMovies = response.data.movies;
        let allMoviesByGenres = {};

        // Group by genres.
        lodash.map(allMovies, function (movie) {
            let genres = movie.genres;

            lodash.map(genres, function (genre) {
                if (lodash.has(allMoviesByGenres, genre)) {
                    allMoviesByGenres[genre].push({"info": movie, "genres": movie.genres});
                } else {
                    allMoviesByGenres[genre] = [];
                    allMoviesByGenres[genre].push({"info": movie, "genres": movie.genres});
                }
            });
        });

        let genres = lodash.keys(allMoviesByGenres).sort(function (a, b) {
            // We have to force a numeric and not ASCII sort.
            return parseInt(a) > parseInt(b);
        });

        let sortedGenreList = [];

        lodash.forEach(genres, function (value) {
            let item = {
                "id": value,
                "movies": lodash.sortBy(allMoviesByGenres[value], "info.title"),
            };

            sortedGenreList.push(item);
        });

        return sortedGenreList;
    }

    /**
     * Log the message.
     *
     * @param message
     */
    _log(message) {
        window.console.log(message);
    }
}