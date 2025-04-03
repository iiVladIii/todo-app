#!/bin/bash
set -e

API_KEY="$1"
VM_NAME="$2"
VM_SIZE="$3"
VM_IMAGE="$4"
KEY_NAME="$5"
KEY_FINGERPRINT="$6"
ROOT_FOLDER="$7"
OUTPUT_FILE="$ROOT_FOLDER/output.json"


curl -s -X POST https://api.cloudvps.reg.ru/v1/reglets \
  -H "Authorization: Bearer $API_KEY" \
  -H "Content-Type: application/json" \
  -d "{
    \"name\": \"$VM_NAME\",
    \"size\": \"$VM_SIZE\",
    \"image\": \"$VM_IMAGE\",
    \"ssh_keys\": [\"$KEY_FINGERPRINT\"]
  }" > reglet_response.json

REGLET_ID=$(jq -r '.reglet.id' reglet_response.json)

echo "{\"reglet_id\": \"$REGLET_ID\"}"

jq --arg key_name "$KEY_NAME" --arg reglet_id "$REGLET_ID" \
  'if .[$key_name] then .[$key_name] += { "reglet_id": $reglet_id } else .[$key_name] = { "reglet_id": $reglet_id } end' \
  "$OUTPUT_FILE" > "$OUTPUT_FILE.tmp" && mv "$OUTPUT_FILE.tmp" "$OUTPUT_FILE"
