FROM node:12.13.0


# SET ENV
ENV NODE_ENV="ci"

# COPY FILE
WORKDIR /usr/app
COPY . /usr/app

# INSTALL DEP
RUN yarn install

# BUILD
RUN npm run build

EXPOSE 9090

CMD [ "./ci/run-prod.sh" ]
