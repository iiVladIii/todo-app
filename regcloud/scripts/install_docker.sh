#!/bin/bash
set -e

SSH_KEY_NAME="$1"
IP="$2"

ROOT_FOLDER="$3"

PROJECT_DIR=$ROOT_FOLDER

echo "Installing Docker on VM with IP: $IP"

echo "Waiting for SSH to become available..."
until ssh -o StrictHostKeyChecking=no -i $PROJECT_DIR/ssh/.ssh/$SSH_KEY_NAME -o ConnectTimeout=5 root@$IP "echo SSH is up"; do
  echo "Still waiting for SSH..."
  sleep 10
done

echo "SSH is available. Installing Docker..."

ssh -o StrictHostKeyChecking=no -i $PROJECT_DIR/ssh/.ssh/$SSH_KEY_NAME root@$IP '
  echo "Updating package lists..."
  apt-get update

  echo "Installing prerequisites..."
  apt-get install -y apt-transport-https ca-certificates curl software-properties-common

  echo "Adding Docker repository..."
  curl -fsSL https://download.docker.com/linux/ubuntu/gpg | apt-key add -
  add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable"

  echo "Installing Docker..."
  apt-get update
  apt-get install -y docker-ce docker-ce-cli containerd.io

  echo "Enabling and starting Docker service..."
  systemctl enable docker
  systemctl start docker

  echo "Docker installation completed:"
  docker --version
'

echo "Docker installation complete!"
echo "{\"status\": \"completed\"}"
