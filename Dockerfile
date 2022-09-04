FROM node:16

RUN mkdir -p /opt/app \
    && adduser app

WORKDIR /opt/app

COPY . .

RUN npm install \
    && chown -R app /opt/app

USER app

EXPOSE 3000

CMD [ "node", "app.js" ]
