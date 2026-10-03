# hibiscus-server-docker
Docker image for the official stable Hibiscus Server bundle, using Java 21.

## Builds and updates

The weekly release check reads the official version/changelog and calls the image
build as a reusable workflow. This avoids relying on a bot commit triggering
another workflow (GitHub intentionally suppresses that trigger).
Manual **Get latest release version** runs check and build the official release.
Manual **Docker Image CI** runs build the version recorded in `release-version`.
Release checks fail without changing the recorded version when upstream is down;
they never claim an old cached release is the newest one.

Images publish to `iari/hibiscus-server:<version>`, `<version>-java21`, and `latest`.
GitHub secrets `DOCKER_USER` and `DOCKER_PASSWORD` supply Docker Hub credentials.
Pull requests build without publishing or registry credentials. `REPO_SCOPED_TOKEN`
is no longer needed by these workflows. GitHub can disable schedules after a long
period of repository inactivity; check Actions and re-enable the release workflow
if that happens.

## Running

Set `HIBISCUS_PASSWORD` to the existing Jameica profile password. It is required;
there is no default password. The entrypoint preserves spaces and shell characters
and forwards signals directly to Java. Override heap size with `JAVA_HEAP_SIZE`
(default `512m`).

Persist the profile at `/root/.jameica`. Configuration overrides can be mounted
at `/opt/hibiscus-server/cfg`; use separate volumes for configuration and profile.
Back up both and the MariaDB database before upgrades. Verify that the configured
database login works before investigating bank PIN/TAN problems. Image updates
do not automatically update database or bank credentials.

The old image passed `-p ${HIBISCUS_PASSWORD}` literally through its JSON command.
For an existing profile, verify the password that actually created its keystore
before switching: the intended environment value and effective old password may
differ. Do not recreate a keystore to bypass an unlock error.

Verify the upgraded server/database services before enabling bank scheduling.
Hibiscus's generic synchronization can execute queued payments as well as reads.
Pin the verified image digest in production to make rollbacks predictable.

## Checks

Run `npm test` and `sh test/entrypoint.sh`. The latter verifies argument boundaries
and rejection of a missing password without contacting a bank.

examples:
- [docker-compose file with traefik](example/docker-compose.yml)
