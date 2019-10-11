import {createLocalVue, mount} from "@vue/test-utils";
import VueRouter from "vue-router";

import axios from "axios";
import VueAxios from "vue-axios";

import router from "../src/Router"
import MovieList from "../src/components/MovieList";
import GenreList from "../src/components/GenreList";

import flushPromises from "flush-promises";

import App from "../src/App";
import MovieHeader from "../src/components/MovieHeader";
import MovieFinder from "../src/components/MovieFinder";

import lodash from "lodash";
import MovieDetail from "../src/components/MovieDetail";
import {describe} from "mocha";
import MovieSearch from "../src/components/MovieSearch";
import Autocomplete from "@trevoreyre/autocomplete-vue";

const fakeResponse = require('./fake-response');
const data = fakeResponse.data;
const movies = data.movies;

const localVue = createLocalVue();
localVue.use(VueRouter);
localVue.use(VueAxios, axios);

const delay = ms => new Promise(res => setTimeout(res, ms));

let positiveNumber = /^\d+$/;

// e.g. "d6822b7b-48bb-4b78-ad5e-9ba04c517ec8"
let idPattern = /^(?:[a-z0-9]+-){3,4}[a-z0-9]+$/;

// https://stackoverflow.com/questions/12756159/regex-and-iso8601-formatted-datetime
let datePattern = /^(\d{4})-(\d{2})-(\d{2})T(\d{2})\:(\d{2})\:(\d{2})(?:[+-](\d{2})\:(\d{2}))?$/;

describe("Validate the launching page", function (done) {
    this.timeout(0);

    it("Renders a proper movie list", async () => {
        let wrapper = await getMountedApp();
        let allGenreLists = validateAndGetAllGenreLists(wrapper);

        await flushPromises();

        lodash.forEach(allGenreLists.wrappers, function (genre) {
            let idElement = genre.contains("h3");
            expect(idElement, "There should be a genre ID in an h3 element").to.be.true;

            idElement = genre.find("h3");

            let genreId = idElement.text();
            expect(genreId, "The genre ID should be a number that is at least 0").to.match(positiveNumber);

            let listOfMoviesContainer = genre.contains("ul.movie-list");
            expect(listOfMoviesContainer, "There should be a movie list container").to.be.true;

            listOfMoviesContainer = genre.find("ul.movie-list");

            let listOfMovies = listOfMoviesContainer.contains("li");
            expect(listOfMovies, "There should be a list of movies in the movie list container").to.be.true;

            let movieWrappers = listOfMoviesContainer.findAll("li");
            lodash.forEach(movieWrappers.wrappers, function (wrapper) {
                // Get the ID and known movie.
                let id = wrapper.attributes("id");
                expect(id, "The ID attribute should match an ID pattern.").to.match(idPattern);

                let knownMovie = getKnownMovieById(id);

                expect(knownMovie, "The movie should be known").to.not.be.empty;

                // Are we in the right genre?
                let allowedGenres = knownMovie.genres;

                /* Beware the === */
                expect(allowedGenres, "The movie genre should be in the allowed genres").to.contain(parseInt(genreId));

                validateReturnedMovie(wrapper, knownMovie, id);
            });

        })
    });
});

describe("Validate Clicking a Movie", function (done) {
    this.timeout(0);

    it("Displays a Detail View When Clicking a Movie", async () => {
        let wrapper = await getMountedApp();


        let allGenreLists = validateAndGetAllGenreLists(wrapper);

        await flushPromises();

        expect(allGenreLists.contains("img")).to.be.true;

        let seen = {};

        let knownGenres = lodash.map(allGenreLists.wrappers, function (genre) {
            let idElement = genre.contains("h3");
            expect(idElement, "There should be a genre ID in an h3 element").to.be.true;

            idElement = genre.find("h3");
            let id = idElement.text();

            if (!seen.hasOwnProperty(id)) {
                seen[id] = true;
                return genre;
            }
        });

        let toTest = knownGenres.pop();

        let id = toTest.find("li").attributes("id");
        let knownMovie = getKnownMovieById(id);

        let toPress = toTest.find("a");
        toPress.trigger("click");

        await flushPromises();
        await delay(2000);

        let movieDetail = wrapper.find(MovieDetail);

        let movieTitle = movieDetail.contains("h3.title");
        expect(movieTitle).to.be.true;

        movieTitle = movieDetail.find("h3.title");
        expect(movieTitle.text()).to.contain(knownMovie.title);
        expect(movieTitle.text()).to.contain(`(${knownMovie.imdb_rating})`);

        let minStars = Math.floor(knownMovie.imdb_rating / 2);

        let movieFullStars = movieDetail.contains("svg[data-icon=star]");

        if (minStars > 0) {
            expect(movieFullStars, "There should be at least one star").to.be.true;

            movieFullStars = movieDetail.findAll("svg[data-icon=star]");
            expect(minStars, `The number of full stars should be ${minStars}`).to.equal(movieFullStars.length);
        } else {
            expect(movieFullStars, "There should be no full star").to.be.false;
        }

        let leftOver = knownMovie.imdb_rating - Math.floor(knownMovie.imdb_rating);

        let halfStars = 0;
        if (leftOver >= 0.5) {
            halfStars = 1;
        }

        let movieHalfStars = movieDetail.contains("svg[data-icon=star-half]");

        if (halfStars > 0) {
            expect(movieFullStars, "There should be at least one half star").to.be.true;

            movieHalfStars = movieDetail.findAll("svg[data-icon=star-half]");
            expect(halfStars, `The number of half stars should be ${halfStars}`).to.equal(movieHalfStars.length);
        } else {
            expect(movieHalfStars, "There should be no half star").to.be.false;
        }

        let dateMatch = knownMovie.released_on.match(datePattern);
        let theDate = dateMatch[1];
        let matchReleaseDate = new RegExp(`${theDate} \\|`);
        expect(movieDetail.html(), `The release date should match /${theDate} \|/`).to.match(matchReleaseDate);

        expect(movieDetail.html(), "The overview should be present").to.contain(knownMovie.overview);

        let moviePoster = movieDetail.contains("img");
        expect(moviePoster, "The relevant movie poster should be present").to.be.true;

        moviePoster = movieDetail.find("img");
        expect(moviePoster.attributes("src"), "The relevant movie poster source should be the poster URL").to.equal(knownMovie.poster);
        expect(moviePoster.attributes("alt"), "The relevant movie poster alt should be the movie title").to.equal(knownMovie.title);

        // We'll skeleton test the stuff that really isn't from the code submit IO. Sigh.
        let skeletonTest = new RegExp(`${theDate} \\|\\s.+\\s\\|.+`);
        expect(movieDetail.html(), "We should see something like 1971 | 136 min | stanley").to.match(skeletonTest);

        // This is particularly awful.
        let castTest = new RegExp("Cast:\\s.*");
        expect(movieDetail.html(), "We should see 'Cast: ...'").to.match(castTest);

        // @TODO Test the backdrop properly.

        let goBack = wrapper.find("a");
        goBack.trigger("click");
        await delay(2000);

        validateAndGetAllGenreLists(wrapper);
    });
});

describe("Autocomplete", function (done) {
    this.timeout(0);

    it("Autocomplete Works for Clockwork Orange", async () => {
        let wrapper = await getMountedApp();
        await flushPromises();

        let movieSearch = wrapper.contains(MovieSearch);
        expect(movieSearch, "There should be a movie search component").to.be.true;

        movieSearch = wrapper.find(MovieSearch);

        let movieSearchInput = movieSearch.contains("input#search-input");
        expect(movieSearchInput, "The movie search input should exist").to.be.true;

        movieSearchInput = movieSearch.find("input#search-input");

        movieSearchInput.element.value="Clockwork Orange";
        movieSearchInput.trigger("input");

        await delay(2000);

        let autocompleteResults = movieSearch.contains("li.autocomplete-result");
        expect(autocompleteResults, "There should be some autocomplete results").to.be.true;

        autocompleteResults = movieSearch.findAll("li.autocomplete-result");

        expect(autocompleteResults.length, "There should be at least one autocomplete result for Clockwork Orange").to.be.greaterThan(0);

        let found = autocompleteResults.filter(w => {
            return w.text().match(/Clockwork Orange/);
        });

        expect(found.length, "There should be at least one item matching 'Clockwork Orange'").to.be.greaterThan(0);
    });
});

describe("Search and Click Dark Knight", function (done) {
    this.timeout(0);

    it("Search Works for Dark Knight", async () => {
        let wrapper = await getMountedApp();
        await flushPromises();

        let movieSearch = wrapper.contains(MovieSearch);
        expect(movieSearch, "There should be a movie search component").to.be.true;

        movieSearch = wrapper.find(MovieSearch);

        let movieSearchInput = movieSearch.contains("input#search-input");
        expect(movieSearchInput, "The movie search input should exist").to.be.true;

        movieSearchInput = movieSearch.find("input#search-input");

        movieSearchInput.element.value="Dark Knight";
        movieSearchInput.trigger("input");
        await delay(2000);

        let autocompleteResults = movieSearch.contains("li.autocomplete-result");
        expect(autocompleteResults, "There should be some autocomplete results").to.be.true;

        autocompleteResults = movieSearch.findAll("li.autocomplete-result");

        expect(autocompleteResults.length, "There should be at least one autocomplete result for Dark Knight").to.be.greaterThan(0);

        let found = autocompleteResults.filter(w => {
            return w.text().match(/Dark Knight/);
        });

        expect(found.length, "There should be at least one item matching 'Dark Knight'").to.be.greaterThan(0);

        let it = found.at(0);

        it.trigger("click");
        await delay(2000);

        // This is wonky but it should find an error.
        expect(wrapper.html(), "The title should be present").to.contain("The Dark Knight");
        expect(wrapper.html(), "The title should be present").to.contain("Batman");


    });
});

describe("Search Works", function (done) {
    this.timeout(0);

    it("Search Works for Batman", async () => {
        let wrapper = await getMountedApp();
        await flushPromises();

        let finder = wrapper.contains(MovieList);
        expect(finder, "There should be a movie list").to.be.true;

        finder = wrapper.find(MovieList);
        finder.vm.changeMovies("batman");

        await delay(2000);

        // This is wonky but it should find an error.
        expect(wrapper.html(), "The title should be present").to.contain("The Dark Knight");
        expect(wrapper.html(), "The title should be present").to.contain("Batman");
    });

    it("Search Works for No Results", async () => {
        let wrapper = await getMountedApp();
        await flushPromises();

        let finder = wrapper.contains(MovieList);
        expect(finder, "There should be a movie list").to.be.true;

        finder = wrapper.find(MovieList);
        finder.vm.changeMovies("!!noresults!!");

        await delay(2000);

        // This is wonky but it should find an error.
        expect(wrapper.html(), "There should be no results").to.contain("There are no results");
    });
});

/**
 * Validates and gets all the genre lists from the main page.
 *
 * @param wrapper
 * @returns {WrapperArray|WrapperArray|WrapperArray|void|WrapperArray<Vue>}
 */
function validateAndGetAllGenreLists(wrapper) {
    expect(wrapper.contains(MovieFinder), "There should be a movie finder").to.be.true;

    expect(wrapper.contains(MovieHeader), "There should be a movie header").to.be.true;
    let movieFinder = wrapper.find(MovieFinder);

    expect(movieFinder.contains(MovieList), "There should be a movie list").to.be.true;
    let movieList = movieFinder.find(MovieList);

    expect(movieList.contains(GenreList), "There should be a genre list").to.be.true;
    let genreList = movieList.find(GenreList);

    let allGenreLists = movieList.findAll(GenreList);
    expect(allGenreLists.contains("img")).to.be.true;

    return allGenreLists;
}

/**
 * Gets the mounted application.
 * @returns {Promise<void>}
 */
async function getMountedApp() {
    let wrapper = await mount(App, {
        attachToDocument: false,
        localVue,
        router
    });

    console.trace("Starting delay...");
    await delay(2000);
    console.trace("Finished delay...");

    return wrapper;
}

function validateReturnedMovie(wrapper, knownMovie, id) {
    // Validate the link.

    let link = wrapper.contains("a");
    expect(link, "There should be a movie link").to.be.true;

    link = wrapper.find("a");

    /* Let's be lazy here and not worry about human readable/html5 links */
    let linkPattern = new RegExp(`/movie/${knownMovie.slug}$`);
    expect(link.attributes("href"), `The link should end in the correct pattern`).to.match(linkPattern);

    let movieImage = wrapper.contains("img");
    expect(movieImage, "There should be an image").to.be.true;

    movieImage = wrapper.find("img");

    expect(movieImage.attributes("id"), "The image should have the known ID").to.equal(id);
    expect(movieImage.attributes("src"), "The image source should be the known source").to.equal(knownMovie.poster);
    expect(movieImage.attributes("alt"), "The image alt should be the known title").to.equal(knownMovie.title);
    expect(movieImage.attributes("data-slug"), "The image data-slug should be the known slug").to.equal(knownMovie.slug);
}

function getKnownMovieById(id) {
    return lodash.find(movies, function (value) {
        return value.id === id;
    });
}
