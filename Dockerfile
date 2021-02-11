# Stage 0, "build-stage", based on Node.js, to build and compile Angular
FROM dockerhub.ebi.ac.uk/treeoflifedcc/portal-frontend:node-base as build-stage
WORKDIR /app
COPY package*.json /app/
RUN npm install
COPY ./ /app/
ARG configuration=production
# RUN npm run test -- --browsers ChromeHeadlessNoSandbox --watch=false
# RUN npm run e2e
RUN npm run build -- --prod --aot --outputHashing=all --output-path=./dist/out --configuration $configuration
# Stage 1, based on Nginx, to have only the compiled app, ready for production with Nginx
FROM dockerhub.ebi.ac.uk/treeoflifedcc/portal-frontend:nginx
COPY --from=build-stage /app/dist/out/ /usr/share/nginx/html
COPY --from=build-stage /nginx.conf /etc/nginx/conf.d/default.conf