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
- VITE_TMDB_TOKEN=, set it to your API Key
- VITE_TMDB_ACCOUNT_ID=, set it to your own TMDB account ID to get movies from your own [Favourites List](https://developer.themoviedb.org/reference/account-get-favorites)

## Dependencies

- react v^19.0.0
- react-dom v^19.0.0
- react-router-dom v^7.4.1
