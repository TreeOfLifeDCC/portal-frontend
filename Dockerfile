FROM node:20.15.0 as build

WORKDIR /source

# Copy the package manifest and lockfile into the container
COPY package*.json ./
# Reproducible install from the committed lockfile (fails if package.json and
# package-lock.json are out of sync). devDependencies are required for `ng build`.
RUN npm ci

# Copy the rest of the files into the container and build
COPY . .

RUN npm run build --prod

FROM nginx:1.27-alpine
COPY --from=build /source/dist/tree-of-life-portal /usr/share/nginx/html
COPY --from=build /source/default.conf /etc/nginx/conf.d/

EXPOSE 8080

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
