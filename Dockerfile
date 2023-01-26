ARG HIBISCUS_VERSION=2.10.9 \
    HIBISCUS_DOWNLOAD_PATH=/opt/hibiscus-server.zip \
    HIBISCUS_SERVER_PATH=/opt/hibiscus-server \
    OPENJDK_VERSION=20-slim

FROM ubuntu
ARG HIBISCUS_VERSION \
    HIBISCUS_DOWNLOAD_PATH \
    HIBISCUS_SERVER_PATH

RUN apt update \
    && apt install -y zip unzip wget

RUN wget https://www.willuhn.de/products/hibiscus-server/releases/hibiscus-server-${HIBISCUS_VERSION}.zip -O $HIBISCUS_DOWNLOAD_PATH \
    && echo $HIBISCUS_SERVER_PATH \
    && mkdir -p $HIBISCUS_SERVER_PATH \
    && unzip $HIBISCUS_DOWNLOAD_PATH -d $HIBISCUS_SERVER_PATH \
    && mv ${HIBISCUS_SERVER_PATH}/hibiscus-server/* $HIBISCUS_SERVER_PATH \
    && rm -rf ${HIBISCUS_SERVER_PATH}/hibiscus-server
#    && rm $HIBISCUS_DOWNLOAD_PATH \
#    && chmod -R 775 $HIBISCUS_SERVER_PATH


FROM openjdk:$OPENJDK_VERSION as hibiscus-server
ARG HIBISCUS_VERSION \
    HIBISCUS_DOWNLOAD_PATH \
    HIBISCUS_SERVER_PATH

ENV HIBISCUS_PASSWORD=password

RUN mkdir -p $HIBISCUS_SERVER_PATH
COPY --chmod=775 --from=0 $HIBISCUS_SERVER_PATH $HIBISCUS_SERVER_PATH
WORKDIR $HIBISCUS_SERVER_PATH

#/cfg/de.willuhn.jameica.hbci.rmi.HBCIDBService.properties
#/cfg/de.willuhn.jameica.webadmin.Plugin.properties

CMD ["./jameicaserver.sh", "-p ${HIBISCUS_PASSWORD}"]