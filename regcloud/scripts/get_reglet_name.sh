#!/bin/bash

if [ -z "$1" ]; then
  echo "Использование: $0 <api key>"
  exit 1
fi


TOKEN="$1"
ROOT_FOLDER="$2"

OUTPUT_FILE="$ROOT_FOLDER/output.json"

response=$(curl -s -X GET \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d "{\"name\": \"$1\", \"public_key\": \"$PUBLIC_KEY\"}" \
  'https://api.cloudvps.reg.ru/v1/random_reglet_name')

REGLET_NAME=$(echo "$response" | jq -r '.reglet_name' | sed 's/ /_/g')

if [ -f "$OUTPUT_FILE" ]; then
  jq --arg key_name "current" --arg name "$REGLET_NAME" \
    --arg file_name "$REGLET_NAME" \
    '.[$key_name] += { "name": $name } | .[$file_name] = { "name": $name }' "$OUTPUT_FILE" > "$OUTPUT_FILE.tmp" && mv "$OUTPUT_FILE.tmp" "$OUTPUT_FILE"
else
  echo "{\"current\": { \"name\": \"$REGLET_NAME\" }, \"$REGLET_NAME\": { \"name\": \"$REGLET_NAME\" }}" > "$OUTPUT_FILE"
fi
