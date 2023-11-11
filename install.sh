#!/bin/bash

command -v bun --version >/dev/null ||  curl -Ss https://bun.sh/install | bash
~/.bun/bin/bun upgrade --canary
