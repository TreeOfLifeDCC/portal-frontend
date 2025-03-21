FROM node:20.15.0 as build

WORKDIR /source

# Copy the package lock file into the container
COPY package*.json ./
# Run ci only for the production dependencies
RUN npm cache clean --force
RUN npm install

# Copy the rest of the files into the container and build
COPY . .

RUN npm run build --prod

FROM nginx:1.15
COPY --from=build /source/dist/tree-of-life-portal /usr/share/nginx/html
COPY --from=build /source/default.conf /etc/nginx/conf.d/

EXPOSE 8080

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
