FROM node:14

COPY src src
COPY package*.json ./

COPY tsconfig.json .

# Prod
# RUN npm install
# RUN npm run build

ENTRYPOINT [ "npm", "run", "start" ]