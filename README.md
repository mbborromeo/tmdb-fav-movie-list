# Mike's Favourite 80s-90s Movies

## Project Description

This React + Vite project fetches movie data and poster image from my Favourite Movies list on The Movie Database (TMDB). It makes multiple REST API calls to get all the corresponding data, and includes fetch error handling.

The user can:

- view the list of movies (showing genre, runtime, credits & TMDB star voting)
- view movie details (showing trailer and links to actor & director credits)
- view person details for actor/director (showing biography and other movies they've been credited for)

## Installation

`npm install`

## Running locally

`npm run build` will run on [http://localhost:5173/](http://localhost:5173/)

Note: Since this project makes a REST API call to [The Movie Database](https://developer.themoviedb.org/docs/getting-started), you will need to register for an API Token which you can get from [API Settings](https://www.themoviedb.org/settings/api).

### Environment Variables

Create your own .env file inside the project root folder, and define the following variables:

- VITE_TMDB_TOKEN=, set it to your TMDB API Token
- VITE_TMDB_ACCOUNT_ID=, set it to your own TMDB Account ID to get movies from your own [Favourites List](https://developer.themoviedb.org/reference/account-get-favorites)

## Running Linters

Check ES syntax

Report and auto-fix issues:
`npm run lint`

Will report issues without auto-fixing:
`npm run lint:check`

Prettier Format Checker

Check code format such as single-quotes, comma-dangle, indentation, etc.

Check format without auto-fixing:
`npm run format:check`

Check format and auto-fix issues:
`npm run format`

## Deploying to GitHub Pages manually

Generate the published files to 'dist' folder by running command:
`npm run build`

Move the 'dist' folder to 'docs'.

Inside the 'docs' folder, copy & paste the index.html file and rename it to 404.html.  This workaround makes the single-page app routing work on GitHub Pages server for 'deep links', ie. when links are opened in a new tab or a page is refreshed.

## Dependencies

- react v^19.0.0
- react-dom v^19.0.0
- react-router-dom v^7.4.1
