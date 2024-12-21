FROM node:22-alpine

# Set default directory
WORKDIR /home/node/app
USER node

# Set global NPM packages to install locally for node user
RUN npm config set prefix '/home/node/.node-npm-global'
ENV PATH="/home/node/.node-npm-global/bin:${PATH}"

COPY docker/node/copy/ini.sh /node-entrypoint.sh

CMD [ "/node-entrypoint.sh" ]
