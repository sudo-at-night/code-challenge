FROM node:22-alpine

# Set default directory
WORKDIR /home/node/app
USER node

COPY docker/node/copy/ini.sh /node-entrypoint.sh

CMD [ "/node-entrypoint.sh" ]
