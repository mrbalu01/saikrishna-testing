FROM node:18-alpine

ARG GIT_BRANCH
ARG BUILD_NUMBER

RUN mkdir /app
WORKDIR /app
ADD . /app
RUN npm install
RUN npm install --location=global js-build-info-generator
RUN generate-build-info --build "#$BUILD_NUMBER, Branch: $GIT_BRANCH"

EXPOSE 4000 50062
RUN chmod +x start.sh

CMD ["sh", "-c", "./start.sh $profile"]
