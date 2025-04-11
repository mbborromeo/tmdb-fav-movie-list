# React + Vite

## Project Description

This project fetches movie data and poster image from my favourites list on The Movie Database (TMDB) using their REST API.  It makes multiple API calls to get all the corresponding data, and includes fetch error handling.

## Note:

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript and enable type-aware lint rules. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

## Installation

`npm install`

## Running on [localhost](http://localhost:5173/)

`npm run build`

## Environment Variables

If you're cloning this project and running it locally, since this project makes a REST API call to [The Movie Database](https://developer.themoviedb.org/docs/getting-started), you will need to register for an API Token which you can get from [API Settings](https://www.themoviedb.org/settings/api).  Note: You will need to create your own .env file inside the project root folder, and save your token as VITE_TMDB_TOKEN=.
