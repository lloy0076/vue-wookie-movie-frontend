import VueRouter from "vue-router";
import MovieDetail from "./components/MovieDetail";
import MovieFinder from './components/MovieFinder';

const routes = [
    {"path": "/", "component": MovieFinder },
    {"path": "/movie/:slug", "name": "movie", "component": MovieDetail},
];

/**
 * When deploying, consider uncommenting the history mode and following any relevant deployment instructions at:
 *
 * https://router.vuejs.org/guide/essentials/history-mode.html
 *
 * @Note: I am not aware of what browser or application server this will be deployed on, however it uses movie slugs
 * alone. Without "mode": "history", the URLs look like: BASE_URL/#/1971-a-movie; uncommenting the mode will allow them
 * to look like BASE)URL/1971-a-movie BUT the karma/mocha tests break.
 */
export default new VueRouter({
    //"mode": "history",
    routes: routes
});
