## Vue - Wookie Movies

### Description

You are the owner of a movie theater in **Thikkiiana City,** on the Wookiee homeworld of Kashyyyk. Your customers are bored with the never changing selection and are asking for something completely different - they want to see what's playing on Earth. Wookies are the main exporter of Computer Technology for the New Republic so naturally you roll up your sleeves and get to work. You quickly scribble down some notes and after a few hours of relentless work you have a design in mind.

### Tasks

-   Implement your designs using **Vue Components** and style them using **CSS3**
-   Connect your application to the **CodeSubmit Movie Database** at https://wookie.codesubmit.io/movies
-   For authentication pass the "Authorization: Bearer Wookie2019" header
-   Parse the API response and display the results as outlined in the design. **Group movies by category**.
-   Implement a detail view for the movies in the list
-   Make sure that bookmarking / linking to detail pages works as expected
-   Implement search by connecting to https://wookie.codesubmit.io/movies?q=<search_term>

### Evaluation Criteria

-   Design implemented according to attached files using Vue Components
-   Routing implemented (list, detail)
-   Connect to API - Movies retrieved, JSON parsed, grouped by category
-   Connecting to API Search, search functionality is working
-   Bonus: Use the movies backdrop image creatively
-   Bonus: Use the movies slug for routing
    ^^ this is implemented and HTML5 routing can be turned on, however this does break the Karma tests.
    ^^ see https://router.vuejs.org/guide/essentials/history-mode.html
    ^^ any 404 like thing, for history mode, will go to the main page; for this site I think this is a FEATURE

### Useful Links

[Vue Docs](https://vuejs.org)

### CodeSubmit

Please organize, design, test and document your code as if it were
going into production - then push your changes to the master branch. After you have pushed your code, you may submit the assignment on the assignment page.

All the best and happy coding,

The CodeSubmit Team

### Postman Tests

I did not trust the API and discovered that it does not return some details, e.g. the cast, director and others.

See the postman tests - they verify the data returned.


### Fetching the Missing Details

It is not POSSIBLE to complete this task as requested, however I have setup an account with OMDB to fetch the details that are missing.

Were this in production, I would ask the API providers to provide the information, find a new API provider or use a similar service to get the missing information.

