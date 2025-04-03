#!/bin/bash

if [ -z "$1" ]; then
  echo "Использование: $0 <имя_ключа>"
  exit 1
fi

SCRIPT__PATH="$(realpath "$0")"
SCRIPT__DIR="$(dirname "$SCRIPT__PATH")"

mkdir -p "$SCRIPT__DIR/.ssh"

ssh-keygen -t rsa -b 2048 -f "$SCRIPT__DIR/.ssh/$1" -N ""

echo "SSH ключ с именем $1 создан в директории .ssh"
