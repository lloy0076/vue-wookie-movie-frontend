import VueRouter from "vue-router";
import MovieDetail from "./components/MovieDetail";
import MovieFinder from './components/MovieFinder';

const routes = [
    {"path": "/", "component": MovieFinder },
    {"path": "/movie/:slug", "name": "movie", "component": MovieDetail},
];


export default new VueRouter({
    //"mode": "history",
    routes: routes
});
