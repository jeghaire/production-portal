#!/bin/bash
run_until_success() {
  local cmd="$*"
  until $cmd; do
    echo "Command failed: $cmd"
    echo "Retrying in 2 seconds..."
    sleep 2
  done
}

run_until_success git reset --hard
run_until_success git pull
run_until_success pnpm install
run_until_success pnpm build
run_until_success pnpm start