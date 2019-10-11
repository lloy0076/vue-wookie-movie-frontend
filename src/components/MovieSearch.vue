<template>
    <div class="search-area">
        <div style="text-align: right; position: relative; bottom: 0">
            <autocomplete :search="search" placeholder="Search for a movie" aria-label="Search for a movie."
                          :get-result-value="getResultValue"
                          @submit="handleSearchSubmit" id="search-input">
            </autocomplete>
        </div>
    </div>
</template>

<script>
    import Autocomplete from '@trevoreyre/autocomplete-vue'
    import '@trevoreyre/autocomplete-vue/dist/style.css'
    import MovieLoader from "../lib/MovieLoader";

    export default {
        name: "MovieSearch",
        components: {Autocomplete},
        data: function () {
            return {
                "results": [],
                "loader": new MovieLoader(this.axios),
            }
        },
        props: ["changeMovies"],
        methods: {
            search(input) {
                if (input.length < 1) {
                    return [];
                }

                return this.loader.searchForMoviesTitle(input, this.$route.params.slug);
            },
            getResultValue(result) {
                if (undefined !== result) {
                    return result[0];
                }

                return '';
            },
            handleSearchSubmit(result) {
                if (undefined === result) {
                    window.console.log("Handing unhandled result");
                    window.console.log(this.$route.params.slug);
                    // There's surely a better way to do this but this works!
                    let searchInput = window.document.getElementById("search-input");
                    this.changeMovies(searchInput.value, this.$route.params.slug);
                    return;
                }

                this.$router.push({"name": "movie", "params": { "slug": result[1]}});
                // this.changeMovies(result);
            }
        }
    }
</script>

<style scoped>
    .search-area {
        grid-column-start: 2;
        grid-column-end: 3;
    }
</style>