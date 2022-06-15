[![Build Status](https://travis-ci.org/WebbyLab/itsquiz-wall.svg)](https://travis-ci.org/WebbyLab/itsquiz-wall)

Isomorphic "Quiz Wall" for itsquiz.com
------------------------------------

## Motivation

There are a lot of tutorials and boilerplates showing how to write isomorphic ReactJs applications.
But when it comes to real world apps, you'll find that all the turorials do not cover problems that you face in productions apps.

In WebbyLab, we have a lot of projects written in react and several isomorphic projects. So, it was decided to develop one of these projects on github. So, everyone can see how real-world production isomorphic app can be implemented.

**IMPORTANT**: This is production app, and we develop it in this repo. So, it is always evolving.

You can find [post from Viktor Turskyi (aka koorchik)](http://blog.koorchik.com/isomorphic-react/). Post describes all the ideas in details.

## Installation (development)

1. ```npm install```
2. ```npm run webpack-devserver``` (wait until build is ready, it will create file "etc/webpack-assets.json")
3. ```npm run nodemon```  (in another terminal, and wait until build is ready)
4. open http://localhost:3001

## About the application

Watch the video:

<a href="http://www.youtube.com/watch?feature=player_embedded&v=eiougg2UhYA
" target="_blank"><img src="http://img.youtube.com/vi/eiougg2UhYA/0.jpg"
alt="IMAGE ALT TEXT HERE" width="480" height="320" border="10" /></a>


## Solved problems:

1. How to deal with routing.
2. How do we deal with data fetching.
3. How to share the same configuration. (And do not bundle it)
4. How to import css in your react components.  Inline CSS (why not Radium, Material-UI)
5. How to deal with css. It should be loaded before html and splitted out.
6. Working with history (Invariant Violation: Browser history needs a DOM)
7. How to deal with I18N.
8. How to deal with long term assets caching


[Post from Viktor Turskyi (aka koorchik) which describes all the ideas in details](http://blog.koorchik.com/isomorphic-react/).


## How to contribute?

1. Bug reports (pull requests) and ideas how to deal with isomorphic issues are welcome.

2. We were early adopters of ReactJs and use it from the moment facebook opensourced it. So, almost every project in our company is written in ReactJs.
Contact us if you need help.

3. [It's Quiz](http://itsquiz.com)  is a great service and we use it in WebbyLab. Just give us feedback on it.

## Architecture description (TODO)

### Development guide and conventions (TODO)

Async actions:

    { type: 'FETCH_POSTS_REQUEST' }
    { type: 'FETCH_POSTS_FAILURE', error: 'Oops' }
    { type: 'FETCH_POSTS_SUCCESS', response: { ... } }

## License

## Thanks

Thanks for http://itsquiz.com (our customer) for allowing opensourcing of this app.

* WebbyLab https://webbylab.com/contacts
* It's Quiz

## WORK on Dockerfile (gitlab registry)

1. ```docker build -t registry.gitlab-ee.webbylab.com/itsquiz/itsquiz/apps/itsquiz-wall .```  build image
2. ```docker push registry.gitlab-ee.webbylab.com/itsquiz/itsquiz/apps/itsquiz-wall```        push image on remoute registry

## WORK on Dockerfile (cloud run registry)

1. ```docker build -t europe-west3-docker.pkg.dev/itsquiz-1041/itsquiz-wall/itsquiz-wall .```  build image
2. ```docker push europe-west3-docker.pkg.dev/itsquiz-1041/itsquiz-wall/itsquiz-wall```        push image on remoute registry

## RUN in CONTAINER

1. ```npm run docker:start```                                                                             run latest version
2. ```docker run -dp 3001:3001 registry.gitlab.webbylab.com/itsquiz/itsquiz/apps/itsquiz-wall:${x.x.x}``` run a specific tag
