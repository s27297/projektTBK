# Fetching the minified node image on alpine linux
FROM node:22.14.0
# Setting up the work directory
WORKDIR /dirr

# Copying all the files in our project
COPY package* ./

RUN npm install
COPY . .

# Installing dependencies


# Starting our application
CMD [ "node","project.js" ]

# Exposing server port
EXPOSE 5000