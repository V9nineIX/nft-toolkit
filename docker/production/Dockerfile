

# build environment
FROM node:16.7.0 as build

WORKDIR /app
# ENV PATH /app/node_modules/.bin:$PATH
COPY package.json /app/package.json
COPY . /app
RUN npm install --force  --silent
RUN npm run build 

CMD ["npm", "run", "start"]
