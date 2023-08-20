# The Notio Project

![alt text](https://i.ibb.co/RHDjH85/notio-logo.png "Notio Logo")

The Notio Project focuses on developing new pedagogies and technologies for improving the teaching of music theory together within the creative music practices of songwriting and improvisation to improve music education in schools in Finland. This project is funded as a Bridging the Theory and Practice of Music through Educational Research and Technology research grant from the Åbo Academy University Foundation (Finland). The MusEDLab is collaborating with PI Cecilia Björk (Åbo Academy), Mats Granfors (Novia University of Applied Sciences), and Jan Jansson (Vasa Övningsskola).

![alt text](http://res.cloudinary.com/dfwzmr3kv/image/upload/v1541950072/libpjli26z1bue7z4hs1.png "Notio Proto")

# License

This work is licensed under the Creative Commons Attribution-NonCommercial 4.0 International License. To view a copy of this license, visit http://creativecommons.org/licenses/by-nc/4.0/ or send a letter to Creative Commons, PO Box 1866, Mountain View, CA 94042, USA.

Detailed info about Notio [here](http://musedlab.org/notio)

[Notio hosted at Netlify. 2023]([here](https://notio-novia-fi.netlify.app/))

You can see the project [here. 2019 dev of project](https://notio.pestanias.now.sh/)

## Install packages

`yarn install`

## Run dev version

`npm start` or `yarn start`

## Build

- `yarn build`
- `npx serve -s build`

## To deplot to Github Pages

- `yarn deploy`. This will also make a build for you.

## The code is formatted with the Prettier plugin.

-tab size 2
-allow double and single quotes

## Info to developers

use nvm to install the latest node-version found int the .nvmrc file
if nvm is not installed run:
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.38.0/install.sh | zsh

-close and reopen terminal then to verify run:
nvm --version

-find latest version of node(Erbium):
nvm ls-remote

-install latest version:
nvm install [version.number]

run :
yarn

# Yarn Packages:

##needed to run topMenu:
react-tooltip  
react-draggable
react-bootstrap  
react-player

##

firebase
@react-firebase/database

react-router-dom v6
