<template>
    <div class="movies">
        <MovieHeader v-bind:loader="loader" v-bind:changeMovies="changeMovies"/>
        <MovieList v-bind:theMovies="movies" v-bind:loader="loader" v-bind:changeMovies="changeMovies" />
    </div>
</template>

<script>
    import MovieList from "./MovieList";
    import MovieLoader from "../lib/MovieLoader";
    import MovieHeader from "./MovieHeader";

    export default {
        name: 'MovieFinder',
        components: {MovieList, MovieHeader},
        data: function () {
            return {
                "movies": {},
                "loader": new MovieLoader(this.axios)
            }
        },
        methods: {
            changeMovies(result, slug = "") {
                this.loader.searchForMovies(result, false, slug).then(data => this.movies = data);
            }
        },
        mounted: function () {
            if (undefined === this.loader) {
                window.console.error("Loader is undefined!");
            } else {
                this.loader.searchForMovies("").then(data => {
                    this.movies = data;
                }).catch((error) => {
                    window.console.error(error);
                });
            }
        },
        props: ["theMovies"],
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    h3 {
        margin: 40px 0 0;
    }

    ul {
        list-style: none;
        display: grid;
        grid-template-columns: 1fr 1fr 1fr 2fr;
    }

    li {
        padding-bottom: 10px;
        text-align: center;
        width: 300px;
    }

    a {
        color: #42b983;
    }
</style>
