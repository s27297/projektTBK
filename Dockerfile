# Fetching the minified node image on alpine linux
FROM node:alpine as base
# Setting up the work directory
WORKDIR /app

# Copying all the files in our project
COPY package.json package-lock.json /app/
RUN npm install
#RUN rm -rf node_modules && npm install&& yarn cache clean
COPY . /app

# Installing dependencies


# Starting our application
CMD [ "node","./project.js" ]

# Exposing server port
EXPOSE 5000