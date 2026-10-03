ARG HIBISCUS_VERSION=2.10.25
FROM debian:bookworm-slim AS download
ARG HIBISCUS_VERSION
RUN apt-get update && apt-get install -y --no-install-recommends ca-certificates curl unzip \
    && rm -rf /var/lib/apt/lists/*
RUN curl --fail --location --retry 3 --connect-timeout 15 --max-time 180 \
      "https://www.willuhn.de/products/hibiscus-server/releases/hibiscus-server-${HIBISCUS_VERSION}.zip" \
      --output /tmp/hibiscus-server.zip \
    && unzip -q /tmp/hibiscus-server.zip -d /opt \
    && test -f /opt/hibiscus-server/jameica-linux.jar \
    && rm /tmp/hibiscus-server.zip

FROM eclipse-temurin:21-jre-jammy
ARG HIBISCUS_VERSION
LABEL org.opencontainers.image.source="https://github.com/IARI/hibiscus-server-docker" \
      org.opencontainers.image.version="${HIBISCUS_VERSION}"
COPY --from=download /opt/hibiscus-server /opt/hibiscus-server
COPY --chmod=755 docker-entrypoint.sh /usr/local/bin/hibiscus-entrypoint
WORKDIR /opt/hibiscus-server
EXPOSE 8080
ENTRYPOINT ["hibiscus-entrypoint"]
