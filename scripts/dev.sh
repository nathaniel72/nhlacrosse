#!/bin/bash
export PATH="/Users/nathanielhunt/.nvm/versions/node/v24.19.0/bin:$PATH"
cd "$(dirname "$0")/.."
exec npm run dev
