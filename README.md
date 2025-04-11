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

`npm run build` will run on [http://localhost:5173/](http://localhost:5173/)]

Note: Since this project makes a REST API call to [The Movie Database](https://developer.themoviedb.org/docs/getting-started), you will need to register for an API Token which you can get from [API Settings](https://www.themoviedb.org/settings/api). Create your own .env file inside the project root folder, and save your token as VITE_TMDB_TOKEN=.

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Dependencies

react v^19.0.0
react-dom v^19.0.0
react-router-dom v^7.4.1
