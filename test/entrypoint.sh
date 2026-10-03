#!/bin/sh
set -eu
task_tmp=$(mktemp -d)
trap 'rm -rf "$task_tmp"' EXIT
cat > "$task_tmp/java" <<'EOF'
#!/bin/sh
printf '%s\n' "$@" > "$CAPTURE_PATH"
EOF
chmod +x "$task_tmp/java"
export PATH="$task_tmp:$PATH" CAPTURE_PATH="$task_tmp/args"
export HIBISCUS_PASSWORD='test password $with special chars'
sh docker-entrypoint.sh --example
test "$(sed -n '7p' "$CAPTURE_PATH")" = "$HIBISCUS_PASSWORD"
test "$(sed -n '8p' "$CAPTURE_PATH")" = '--example'
unset HIBISCUS_PASSWORD
if sh docker-entrypoint.sh >/dev/null 2>&1; then exit 1; fi
echo 'Entrypoint argument preservation and missing-secret checks passed.'
