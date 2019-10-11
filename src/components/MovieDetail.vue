<template>
    <div>
        <div id="overlay" @click="toggleOverlay"></div>
        <MovieHeader v-bind:loader="loader" v-bind:changeMovies="changeMovies"/>
        <div v-if="lodash.isEmpty(movie) !== true" style="margin-top: 32px">
            <div class="poster">
                <a @click="toggleOverlay">
                    <div>
                        <img :src="movie.poster" :alt="movie.title"/>
                    </div>
                    <div class="view-poster">
                        View Backdrop
                    </div>
                </a>
            </div>
            <div class="detail-container">
                <div>
                    <h3 class="title">{{ movie.title}} ({{ movie.imdb_rating }})
                        <span class="stars">
                            <template v-for="(index) in countStars">
                                <font-awesome-icon icon="star" v-bind:key="index"></font-awesome-icon>
                            </template>
                            <template v-for="(index) in halfStar">
                                <font-awesome-icon icon="star-half" v-bind:key="index + 10"></font-awesome-icon>
                            </template>
                        </span>
                    </h3>
                </div>
                <div>
                    {{ new Date(movie.released_on).getFullYear() }} | {{ omdb.Runtime }} | {{ omdb.Director }}
                </div>
                <div>
                    Cast: {{ omdb.Actors }}
                </div>
                <div class="detail-overview">
                    {{ movie.overview }}
                </div>
            </div>
        </div>
        <MovieList v-bind:theMovies="movies" v-bind:changeMovies="changeMovies" v-bind:getMovieBySlug="getMovieBySlug"/>
    </div>
</template>

<script>
    import Vue from "vue";
    import {library} from '@fortawesome/fontawesome-svg-core';
    import {faStar, faStarHalf} from '@fortawesome/free-solid-svg-icons';
    import {FontAwesomeIcon} from '@fortawesome/vue-fontawesome';

    import lodash from "lodash";
    import MovieList from "./MovieList";
    import MovieHeader from "./MovieHeader";
    import MovieLoader from "../lib/MovieLoader";

    library.add(faStar, faStarHalf);
    Vue.component("font-awesome-icon", FontAwesomeIcon);

    export default {
        "name": "MovieDetail",
        "components": {MovieHeader, MovieList},
        "data": function () {
            return {
                "loader": new MovieLoader(this.axios),
                "movie": {},
                "omdb": {},
                "movies": {},
                "overlay": false,
                "lodash": lodash,
            };
        },
        methods: {
            changeMovies(result) {
                this.movies = {};
                this.movie = {};
                this.omdb = {};
                this.loader.searchForMovies(result, false, this.$route.params.slug).then(data => this.movies = data);
            },
            getMovieBySlug(slug) {
                this.movies = {};
                this.movie = {};
                this.omdb = {};
                this.loader.getMovieBySlug(slug).then((data) => {
                    this.movie = data;
                    this.loader.getOmdbData(this.movie.title).then((omdbdata) => {
                        this.omdb = omdbdata.data
                    });
                });
            },
            toggleOverlay() {
                if (document.getElementById("overlay").style.display != "block") {
                    document.getElementById("overlay").style.display = "block";
                    document.getElementById("overlay").style.backgroundImage = `url(${this.movie.backdrop})`;
                    this.overlay = true;
                } else {
                    document.getElementById("overlay").style.display = "none";
                    this.overlay = false;
                }
            }
        },
        "mounted": function () {
            this.movies = {};
            this.movie = {};
            this.omdb = {};
            this.loader.getMovieBySlug(this.$route.params.slug).then((data) => {
                this.movie = data;
                this.loader.getOmdbData(this.movie.title).then((omdbdata) => {
                    this.omdb = omdbdata.data;
                });
            });
        },
        "computed": {
            countStars() {
                return Math.floor(this.movie.imdb_rating / 2);
            },
            halfStar() {
                let leftOver = this.movie.imdb_rating - Math.floor(this.movie.imdb_rating);
                if (leftOver < 0.5) {
                    return 0;
                }

                return 1;
            },
            images() {
                return [
                    {"name": this.movie.backdrop, "alt": this.movie.title},
                ];
            }
        },
        beforeRouteUpdate(to, from, next) {
            this.getMovieBySlug(to.params.slug);
            next();
        }
    }
</script>

<style scoped>
    @media only screen and (min-width: 640px) {
        .poster {
            width: 320px;
            height: 820px;
            float: left;
            padding-right: 8px;
        }

        .poster img {
            max-width: 320px;
        }
    }

    @media only screen and (max-width: 639px) {
        .poster {
            display: block;
            max-width: 100%;
            margin-left: auto;
            margin-right: auto;
            text-align: center;
        }

        .poster img {
            max-width: 75%;
        }
    }

    .view-poster {
        margin-top: 8px;
        text-align: center;
    }

    .detail-container {
        margin-top: 4px;
    }

    .title {
        width: 100%;
    }

    .stars {
        float: right;
        color: #ffee55;
    }

    .detail-overview {
        margin-top: 16px;
    }

    img {
        border: solid 1px lightgray;
    }

    #overlay {
        position: fixed; /* Sit on top of the page content */
        display: none; /* Hidden by default */
        width: 100%; /* Full width (cover the whole page) */
        height: 100%; /* Full height (cover the whole page) */
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: rgba(0, 0, 0, 0.7); /* Black background with opacity */
        background-repeat: no-repeat;
        background-size: 75%;
        background-position: center;
        z-index: 2; /* Specify a stack order in case you're using a different order for other elements */
        cursor: pointer; /* Add a pointer on hover */
    }

    #overlay:after {
        content: ' ';
        position: absolute;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
        background-color: rgba(0,0,0,0);
        transition: background-color 1s;
    }

    #overlay:hover:after {
        background-color: rgba(0,0,0,.25);
    }
</style>