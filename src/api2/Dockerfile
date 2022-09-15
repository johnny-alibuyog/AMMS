# First stage: compile things.
FROM keymetrics/pm2:8-alpine AS build
WORKDIR /usr/src/app

# (Install OS dependencies; include -dev packages if needed.)

# Install the Javascript dependencies, including all devDependencies.
COPY package.json .
RUN npm install

# Copy the rest of the application in and build it.
COPY . .
# RUN npm build
RUN npx tsc -p ./tsconfig.json

# Now /usr/src/app/dist has the built files.

# Second stage: run things.
FROM keymetrics/pm2:8-alpine
WORKDIR /usr/src/app

# (Install OS dependencies; just libraries.)

# Install the Javascript dependencies, only runtime libraries.
COPY package.json .
RUN npm install --production

# Copy pm2 configuration
COPY pm2.yaml .

# Copy the dist tree from the first stage.
COPY --from=build /usr/src/app/dist dist

# Run the built application when the container starts.
# EXPOSE 8081
CMD ["npm", "start"]