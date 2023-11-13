# apicurio-api-lifecycle-hub (validator)
A node.js that uses express to expose a REST API which then validates an input
JSON or YAML document using a Spectral ruleset.

## Running (DEV)
To run this service locally, you will need node.js installed.  Then it's just this:

```
$ npm install
$ npm run start
```

## Docker
To build the container image for this project, do this (docker is required):

```
$ npm install
$ docker build -f Dockerfile -t apicurio/apicurio-api-lifecycle-validator:latest-snapshot .
```

Then you can run the docker image by doing this:

```
$ docker run -it -p 3000:3000 apicurio/apicurio-api-lifecycle-validator:latest-snapshot
```