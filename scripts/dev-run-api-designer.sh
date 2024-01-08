#!/bin/sh
set -e

# Use docker to start up the API Designer mem image.
# API Designer backend runs on port 9000
docker pull quay.io/apicurio/apicurio-api-designer-mem:latest-snapshot
docker run -it -p 9000:8080 --env DESIGNER_CORS_ALLOWED_ORIGINS=* quay.io/apicurio/apicurio-api-designer-mem:latest-snapshot
