<template>
    <div class="title-area">
        <h1 style="margin-bottom: 0;"><router-link to="/">Wookie<br>Movies</router-link></h1>
    </div>
</template>

<script>
    export default {
        name: "MovieTitle"
    }
</script>

<style scoped>
    .title-area {
        grid-column-start: 1;
        grid-column-end: 2;
    }

    a, a:visited, a:focus, a:hover {
        font-style: inherit;
        color: inherit;
        background-color: transparent;
        font-size: inherit;
        text-decoration: none;
        font-variant: inherit;
        font-weight: inherit;
        line-height: inherit;
        font-family: inherit;
    }

</style>