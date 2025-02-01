FROM node:18

WORKDIR /task-app-backend

COPY . .

RUN npm install

EXPOSE 5200

CMD [ "npm", "run", "dev" ]