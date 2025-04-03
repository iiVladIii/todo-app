#!/bin/bash
set -e

API_KEY="$1"
KEY_NAME="$2"
REGLET_ID="$3"
ROOT_FOLDER="$4"

OUTPUT_FILE="$ROOT_FOLDER/output.json"

echo "Waiting for IP address for reglet ID: $REGLET_ID"

while true; do
  RESPONSE=$(curl -s -H "Authorization: Bearer $API_KEY" https://api.cloudvps.reg.ru/v1/reglets/$REGLET_ID)
  IP=$(echo $RESPONSE | jq -r '.reglet.ip')
  STATUS=$(echo $RESPONSE | jq -r '.reglet.status')

  echo "Current status: $STATUS, IP: $IP"

  if [ "$STATUS" = "active" ] && [ "$IP" != "null" ] && [ "$IP" != "" ]; then
    echo "VM is active with IP: $IP"
    echo $IP > vm_ip.txt
    break
  fi

  echo "Waiting for VM to become active and get IP address..."
  sleep 15
done

echo "{\"ip_address\": \"$IP\"}"

jq --arg key_name "$KEY_NAME" --arg ip "$IP" \
  'if .[$key_name] then .[$key_name] += { "ip": $ip } else .[$key_name] = { "ip": $ip } end' \
  "$OUTPUT_FILE" > "$OUTPUT_FILE.tmp" && mv "$OUTPUT_FILE.tmp" "$OUTPUT_FILE"
