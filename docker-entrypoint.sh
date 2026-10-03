#!/bin/sh
set -eu
: "${HIBISCUS_PASSWORD:?Set HIBISCUS_PASSWORD to the existing Jameica profile password}"
# Execute Java directly: the upstream shell script expands its arguments unquoted.
# Preserve spaces and special characters in the password; forward termination to Java.
exec java -Djava.net.preferIPv4Stack=true -Xmx"${JAVA_HEAP_SIZE:-512m}" \
  -jar jameica-linux.jar -d -p "$HIBISCUS_PASSWORD" "$@"
