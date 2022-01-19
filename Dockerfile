FROM node:16

//Working directory inside the image

WORKDIR /usr/src/app

//Copying all the dependencies from package.json or package-lock.json
COPY package*.json ./

RUN npm install

COPY . /usr/src/app

EXPOSE 4040

CMD["node", "index.js"]