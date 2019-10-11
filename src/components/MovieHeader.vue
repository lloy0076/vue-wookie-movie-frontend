<template>
    <div class="header">
        <MovieTitle />
        <MovieSearch v-bind:loader="loader" v-bind:changeMovies="changeMovies"/>
    </div>
</template>

<script>
    import MovieSearch from "./MovieSearch";
    import MovieTitle from "./MovieTitle";

    export default {
        name: "MovieHeader",
        props: ['loader', 'changeMovies'],
        components: {MovieSearch, MovieTitle},
    }
</script>

<style scoped>
    .header {
        display: grid;
        align-items: end;
        border-bottom: 1px solid darkblue;
        padding-bottom: 8px;
    }
</style>