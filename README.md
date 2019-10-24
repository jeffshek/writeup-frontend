[![Netlify Status](https://api.netlify.com/api/v1/badges/69debd64-bf21-438d-8cad-aa7e8e96b510/deploy-status)](https://app.netlify.com/sites/brave-shockley-65f3d6/deploys)
[![Dependabot Status](https://api.dependabot.com/badges/status?host=github&repo=jeffshek/writeup-frontend)](https://dependabot.com)
![Code style](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)
[![CircleCI](https://circleci.com/gh/jeffshek/writeup-frontend.svg?style=svg)](https://circleci.com/gh/jeffshek/writeup-frontend)
[![HitCount](http://hits.dwyl.io/jeffshek/writeup-frontend.svg)](http://hits.dwyl.io/jeffshek/writeup-frontend)

![App](https://cdn.buttercms.com/ErL3GkElR4ysvNeAm0Hi)

### Tech Stack

- Mostly powered by Netlify, Material UI and React.
- [Netlify](www.netlify.com) hosts writeup's static assets. Because it's amazing.
- [MaterialUI](http://material-ui.com/) - Thank you for making it easy to build presentable pages.
- [React](https://reactjs.org/) - Thank you for building an awesome library to construct a web app with.
- [SlateJS](https://www.slatejs.org/#/rich-text) - The editor show casing everything.
- Create React App was used to build this.

### To Start

```
git clone git@github.com:jeffshek/writeup-frontend.git
cd writeup-frontend
yarn install
yarn start
```

### Design

- Design inspirations and code taken from [Material-Sense](https://alexanmtz.github.io/material-sense/)

### Code Quality

- This was written pretty quickly, so I'm not that proud of some antipatterns I used in repo. I wouldn't use it for inspiration. I'm much prouder of the backend repo than I am of the frontend.
- EDIT EVEN MORE: The DevOps in building this has been much harder than I anticipated. Between the tradeoffs of technical debt on the frontend versus backend, this got the short end of the stick. I'm a bit embarrassed by the code quality here, sorry ...
- I'm not a frontend engineer. Apologies about the size of main.js ... Don't judge me (too hard).

### Open Sourced Backend (Mostly)

- [Python/Django Backend](https://github.com/jeffshek/open)

### File Structure

- I REALLY don't recommend any file layout / naming conventions from this frontend repo. It's still evolving and changing as I think through patterns. There are some parts I'm super embarrassed by.
