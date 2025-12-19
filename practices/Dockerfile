#Base Image
FROM node:22-alpine AS build

#set working directory
WORKDIR /app

#copy packages and files and install dependencies
COPY package*.json ./
RUN npm install

#copy all sources 
COPY . .

#build vite app
RUN npm run build


#Expose port 
EXPOSE 5173

#start nginx
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]

