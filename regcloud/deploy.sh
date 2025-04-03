#!/bin/bash

terraform init

#export TF_LOG=DEBUG
terraform apply -auto-approve
