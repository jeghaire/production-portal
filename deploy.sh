#!/bin/bash

# Take the first argument as the commit message, or use default
COMMIT_MSG=${1:-"Auto commit: build and push"}

pnpm build
if [ $? -eq 0 ]; then
  git add .
  git commit -m "$COMMIT_MSG"
  git push -u origin main

  # Check if the push was successful immediately after the push
  if [ $? -eq 0 ]; then
    echo "Changes pushed successfully."
  else
    echo "Failed to push changes."
    exit 1
  fi

else
  echo "Build failed. Not committing or pushing."
  exit 1
fi
