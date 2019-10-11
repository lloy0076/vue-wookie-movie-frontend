<template>
    <div>
        <h3>{{ genreId }}</h3>
        <div v-if="theMovies.length > 0">
            <ul class="movie-list">
                <li v-cloak v-for="movie in theMovies" v-bind:key="movie.info.id" v-bind:id="movie.info.id">
                    <router-link v-if="movie.info.slug !== $route.params.slug" v-bind:key="movie.info.id"
                                 :to="`/movie/${movie.info.slug}`"><img v-bind:src="movie.info.poster"
                                                                        v-bind:alt="movie.info.title"
                                                                        v-bind:data-slug="movie.info.slug"
                                                                        v-bind:id="movie.info.id"/></router-link>
                    <router-link v-else v-bind:key="movie.info.id"
                                 :to="`/movie/${movie.info.slug}?t=${nonce}`"><img v-bind:src="movie.info.poster"
                                                                                   v-bind:alt="movie.info.title"
                                                                                   v-bind:data-slug="movie.info.slug"
                                                                                   v-bind:id="movie.info.id"/>
                    </router-link>

                </li>
            </ul>
        </div>
        <div v-else>
            There are no results.
        </div>
    </div>
</template>

<script>
    export default {
        name: "GenreList",
        props: ["genreId", "theMovies"],
        computed: {
            nonce() {
                return Date.now();
            }
        },
        data: function () {
            return {}
        }
    }
</script>

<style scoped>
    ul {
        list-style-type: none;
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    }

    li {
        text-align: center;
        padding-bottom: 16px;
    }

    img {
        width: 200px;
        height: 300px;
        border: grey 1px solid;
    }
</style>