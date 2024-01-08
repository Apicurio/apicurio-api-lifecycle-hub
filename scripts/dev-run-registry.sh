#!/bin/sh
set -e

# Use docker to start up Registry
docker pull quay.io/apicurio/apicurio-registry:latest-snapshot
docker run -it -p 9001:8080 --env CORS_ALLOWED_ORIGINS=* quay.io/apicurio/apicurio-registry:latest-snapshot
