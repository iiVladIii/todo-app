#!/bin/bash

if [ -z "$1" ]; then
  echo "Использование: $0 <имя_ключа>"
  exit 1
fi

SCRIPT__PATH="$(realpath "$0")"
SCRIPT__DIR="$(dirname "$SCRIPT__PATH")"
PROJECT__DIR="$( cd "$SCRIPT__DIR/.." && pwd )"
TFVARS__PATH="$PROJECT__DIR/terraform.tfvars"

TOKEN=$(grep 'reg_ru_api_key' "$TFVARS__PATH" | sed -n 's/.*= "\(.*\)"/\1/p')

if [ -z "$TOKEN" ]; then
  echo "Не удалось найти reg_ru_api_key в файле ../terraform.tfvars"
  exit 1
fi

PUBLIC_KEY=$(cat ".ssh/$1.pub")

curl -X POST \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d "{\"name\": \"$1\", \"public_key\": \"$PUBLIC_KEY\"}" \
  'https://api.cloudvps.reg.ru/v1/account/keys'

echo "Публичный ключ $1 загружен"
