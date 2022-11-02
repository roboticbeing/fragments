# Stage 0: Install alpine Linux (for a smaller size) + node

# Parent/Base image to use as a starting point for our own image
# Use a larger base image for installing dependencies
FROM node:latest as dependencies 

RUN apt-get update && apt-get install -y --no-install-recommends dumb-init

# Image Metadata
LABEL maintainer="Jessica Krishtul <jkrishtul@myseneca.ca>" \
    description="Fragments node.js microservice"

# Optimize Node.js apps for production
ENV NODE_ENV=production \
    # We default to use port 8080 in our service
    PORT=8080 \
    # Reduce npm spam when installing within Docker
    # https://docs.npmjs.com/cli/v8/using-npm/config#loglevel
    NPM_CONFIG_LOGLEVEL=warn \
    # Disable colour when run inside Docker
    # https://docs.npmjs.com/cli/v8/using-npm/config#color
    NPM_CONFIG_COLOR=false

# Use /app as our working directory
WORKDIR /app

# Copy the package.json and package-lock.json files into /app
COPY package*.json ./

# Install only production node dependencies defined in package-lock.json
RUN npm ci --only=production

#######################################################################

# Stage 1: use dependencies to build server

# Use officially supported and deterministic image tags
FROM node:16.17.0-bullseye-slim@sha256:59812c19504546fc66b0b26722bf0754ee48b74f9abc5ed9c3f251fc45d86099

COPY --from=dependencies /usr/bin/dumb-init /usr/bin/dumb-init

# Run container with least privileged user
USER node

WORKDIR /app

# Copy cached dependencies from previous stage so we don't have to download
# COPY --chown=node:node --from=dependencies . ./app

# Copy all our source code
COPY --chown=node:node --from=dependencies . .

# Start the container by running our server
# Properly handle events to safely terminate a Node.js application
CMD ["dumb-init", "npm", "start"]

# We run our service on port 8080
EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \
    CMD wget --fail localhost:8080 || exit 1