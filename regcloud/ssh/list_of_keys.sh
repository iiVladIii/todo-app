#!/bin/bash

SCRIPT__PATH="$(realpath "$0")"
SCRIPT__DIR="$(dirname "$SCRIPT__PATH")"
PROJECT__DIR="$( cd "$SCRIPT__DIR/.." && pwd )"
TFVARS__PATH="$PROJECT__DIR/terraform.tfvars"

TOKEN=$(grep 'reg_ru_api_key' "$TFVARS__PATH" | sed -n 's/.*= "\(.*\)"/\1/p')

curl -X GET \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d "{\"name\": \"$1\", \"public_key\": \"$PUBLIC_KEY\"}" \
  'https://api.cloudvps.reg.ru/v1/account/keys'
