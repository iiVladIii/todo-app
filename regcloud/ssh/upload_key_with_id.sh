#!/bin/bash

if [ -z "$1" ]; then
  echo "Использование: $2 <api_key>"
  exit 1
fi

if [ -z "$2" ]; then
  echo "Использование: $0 <имя_ключа>"
  exit 1
fi

TOKEN=$1
KEY_NAME=$2
ROOT_FOLDER="$3"

OUTPUT_FILE="$ROOT_FOLDER/output.json"
SCRIPT_DIR="$ROOT_FOLDER/ssh"


if [ ! -f "$SCRIPT_DIR/.ssh/$KEY_NAME.pub" ]; then
  echo "Публичный ключ .ssh/$KEY_NAME.pub не найден"
  exit 1
fi

PUBLIC_KEY=$(cat "$SCRIPT_DIR/.ssh/$KEY_NAME.pub")

RESPONSE=$(curl -s -X POST \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d "{\"name\": \"$KEY_NAME\", \"public_key\": \"$PUBLIC_KEY\"}" \
  'https://api.cloudvps.reg.ru/v1/account/keys')

KEY_ID=$(echo "$RESPONSE" | grep -o '"id": [0-9]*' | head -1 | awk '{print $2}')
FINGERPRINT=$(echo "$RESPONSE" | grep -o '"fingerprint": "[^"]*"' | head -1 | sed 's/"fingerprint": "\(.*\)"/\1/')

echo "Ключ успешно загружен"

if [ -f "$OUTPUT_FILE" ]; then
  jq --arg key_name "$KEY_NAME" --arg key_id "$KEY_ID" --arg fingerprint "$FINGERPRINT" \
    '.[$key_name] += { "key_id": $key_id, "key_fingerprint": $fingerprint }' "$OUTPUT_FILE" > "$OUTPUT_FILE.tmp" && mv "$OUTPUT_FILE.tmp" "$OUTPUT_FILE"
else
  echo "{\"$KEY_NAME\": { \"key_id\": \"$KEY_ID\", \"key_fingerprint\": \"$FINGERPRINT\" }}" > "$OUTPUT_FILE"
fi
