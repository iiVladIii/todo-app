#!/bin/bash

SSH_KEY_NAME="$1"
IP="$2"
ROOT_FOLDER="$3"
SSH_KEY_PATH="$ROOT_FOLDER/ssh/.ssh/$SSH_KEY_NAME"

if [ $# -ne 3 ]; then
    echo "Usage: $0 SSH_KEY_NAME IP ROOT_FOLDER"
    exit 1
fi

if [ ! -f "$SSH_KEY_PATH" ]; then
    echo "SSH key not found at: $SSH_KEY_PATH"
    exit 1
fi

# Make sure key has proper permissions
chmod 600 "$SSH_KEY_PATH"

# Connect to remote server and enable SSH port forwarding
ssh -i "$SSH_KEY_PATH" -o StrictHostKeyChecking=no root@"$IP" "sed -i 's/^#*GatewayPorts.*/GatewayPorts yes/' /etc/ssh/sshd_config && \
    sed -i 's/^#*AllowTcpForwarding.*/AllowTcpForwarding yes/' /etc/ssh/sshd_config && \
    reboot"

if [ $? -eq 0 ]; then
    echo "SSH port forwarding has been enabled on $IP"
else
    echo "Failed to enable SSH port forwarding on $IP"
    exit 1
fi

exit 0
