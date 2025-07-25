# Mike's Favourite 80s-00s Movies

## Project Description

This React + Vite project fetches movie data and poster image from my 3 of my Movies Lists (categorised by decade) on The Movie Database (TMDB). It makes multiple REST API calls to get all the corresponding data, and includes fetch error handling.

The user can:

- select a decade of movies between the 80's, 90's and 00's using an input range slider
- view the list of movies for the selected decade (showing genre, runtime, credits & TMDB star voting)
- filter the movies by genre
- order the movies by date released, TMDB vote average, TMDB votes
- sort the movies by descending or ascending order
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
- VITE_TMDB_LIST_ID_80S=, set it to one of your TMDB [Movie Lists](https://www.themoviedb.org/list/new)
- VITE_TMDB_LIST_ID_90S=, set it to one of your TMDB [Movie Lists](https://www.themoviedb.org/list/new)
- VITE_TMDB_LIST_ID_00S=, set it to one of your TMDB [Movie Lists](https://www.themoviedb.org/list/new)
- Instead of fetching data from 3 different movie lists per decade, if you'd rather get movies from one Favourite Movies list, set VITE_TMDB_ACCOUNT_ID= to your own TMDB Account ID to get movies from your own [Favourites List](https://developer.themoviedb.org/reference/account-get-favorites). Note you'd have to use moviesResponse.results instead of moviesResponse.items for the JSON returned from the fetch.

## Running Lint Check

Check ES syntax

Report and auto-fix issues:
`npm run lint`

Will report issues without auto-fixing:
`npm run lint:check`

## Prettier Format Checker

Check code format such as single-quotes, comma-dangle, indentation, etc.

Check format without auto-fixing:
`npm run format:check`

Check format and auto-fix issues:
`npm run format`

## Deploying to GitHub Pages 

### Manual deploy - from a branch

Set the GitHub Pages settings to:
GitHub > Settings > Pages > Source: 'Deploy from a branch'

Locally, on the feature branch, generate the published/static files to the 'docs' folder by running command:
`npm run build`

Then, commit these files to the feature branch. 

Push the feature branch onto origin.

In GitHub, create a merge request onto the 'main' branch.

GitHub will automatically deploy the GitHug Pages site.

Go to GitHub > Actions, to see the status of the deployment.

### Automatic deploy - using GitHub Actions 
(known bug: currently throws a 401 Error, might be to do with .env)

Set the GitHub Pages settings to:
GitHub > Settings > Pages > Source: 'GitHub Actions'

Push the feature branch onto origin.

In GitHub, create a merge request onto the 'main' branch.

GitHub will automatically deploy the GitHug Pages site.

Go to GitHub > Actions, to see the status of the deployment.

(Note: Inside the static build 'docs' folder, I'm copying and pasting the index.html file and renaming it to 404.html.  This workaround makes the single-page app routing work on GitHub Pages server for 'deep links', ie. when links are opened in a new tab or a page is refreshed.)

## Dependencies

- react v^19.0.0
- react-dom v^19.0.0
- react-router-dom v^7.4.1
