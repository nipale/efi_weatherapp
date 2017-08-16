FROM node:8

# Create weatherapp directory
RUN mkdir -p /usr/src/weatherapp
WORKDIR /usr/src/weatherapp

# Install weatherapp dependencies
COPY package.json /usr/src/weatherapp/
COPY .eslintrc /usr/src/weatherapp/
RUN npm install

# Add volume
VOLUME /usr/src/weatherapp/src

# Bundle weatherapp source (is not needed with the volume solution)
#COPY . /usr/src/weatherapp

EXPOSE 9000
CMD [ "npm", "start" ]
#CMD [ "npm", "run", "dev" ]
#CMD [ "npm", "run", "lint" ]
