FROM node:8@sha256:773480516f79e0948b02d7a06971b07bf76b08d706cf88a358b5b69dd4c83db0
ADD . /playground
WORKDIR /playground
RUN npm install && npm run build

EXPOSE 3000

CMD ["/playground/node_modules/.bin/next", "start", "--host", "0.0.0.0"]
