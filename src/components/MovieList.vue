<template>
    <div>
        <ul>
            <template v-for="movies in theMovies">
                <GenreList v-bind:key="movies.id" v-bind:theMovies="movies.movies" v-bind:genreId="movies.id" v-bind:getMovieBySlug="getMovieBySlug"/>
            </template>
        </ul>
    </div>
</template>

<script>
    import GenreList from "./GenreList";

    export default {
        name: "MovieList",
        props: ["theMovies", "changeMovies", "getMovieBySlug"],
        components: {GenreList}
    }
</script>


<style scoped>
</style>