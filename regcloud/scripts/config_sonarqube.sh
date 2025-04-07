#!/bin/bash

SSH_KEY_NAME="$1"
IP="$2"
ROOT_FOLDER="$3"
SSH_KEY_PATH="$ROOT_FOLDER/ssh/.ssh/$SSH_KEY_NAME"

# Check if all required arguments are provided
if [ -z "$SSH_KEY_NAME" ] || [ -z "$IP" ] || [ -z "$ROOT_FOLDER" ]; then
  echo "Usage: $0 SSH_KEY_NAME IP ROOT_FOLDER"
  exit 1
fi

# Check if the SSH key exists
if [ ! -f "$SSH_KEY_PATH" ]; then
  echo "SSH key not found at $SSH_KEY_PATH"
  exit 1
fi

# Check if the sonarqube directory exists
if [ ! -d "$ROOT_FOLDER/scripts/sonarqube" ]; then
  echo "Sonarqube directory not found at $ROOT_FOLDER/scripts/sonarqube"
  exit 1
fi

# Set proper permissions for SSH key
chmod 600 "$SSH_KEY_PATH"

# Create a temporary directory for rsync
TMP_DIR=$(mktemp -d)

# Copy the sonarqube directory to the temporary directory
rsync -avz "$ROOT_FOLDER/scripts/sonarqube" "$TMP_DIR/"

# Transfer the sonarqube directory to the remote server
rsync -avz -e "ssh -i $SSH_KEY_PATH -o StrictHostKeyChecking=no" "$TMP_DIR/sonarqube" "root@$IP:/tmp/"

# Execute the build.sh script on the remote server
#&& docker compose down --rmi all
ssh -i "$SSH_KEY_PATH" -o StrictHostKeyChecking=no "root@$IP" "sudo sysctl -w vm.max_map_count=262144 && echo 'vm.max_map_count=262144' | sudo tee -a /etc/sysctl.conf"
ssh -i "$SSH_KEY_PATH" -o StrictHostKeyChecking=no "root@$IP" "cd /tmp/sonarqube && docker compose down && docker-compose down -v && docker system prune -a --volumes && docker-compose up -d --build"

# Clean up temporary directory
rm -rf "$TMP_DIR"

echo "Sonarqube build script executed successfully on $IP"
