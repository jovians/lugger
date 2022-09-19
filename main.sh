#!/bin/bash
NPM_BIN_DIR=$(which npm)
NPM_DIR=${NPM_BIN_DIR::${#NPM_BIN_DIR}-8}
NODE_MOULES_DIR="$NPM_DIR/lib/node_modules"

# Node modules path
PACKAGE_DIR="$NODE_MOULES_DIR/lugger"
export NODE_OPTIONS=--max_old_space_size=262144

# Start with high-memory Node.js env. (256GB)
node --enable-source-maps --max-old-space-size=262144 "$PACKAGE_DIR/main.js" "$@"
