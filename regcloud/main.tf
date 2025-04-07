provider "local" {}

resource "null_resource" "get_reglet_name" {
  provisioner "local-exec" {
    command = "bash ./scripts/get_reglet_name.sh ${var.reg_ru_api_key} ${path.cwd}"
  }
}

data "local_file" "output_json_name" {
  filename = "${path.module}/output.json"
  depends_on = [null_resource.get_reglet_name]
}

locals {
  vm_name = jsondecode(data.local_file.output_json_name.content)["current"].name
}

resource "null_resource" "generate_ssh_key" {
  depends_on = [data.local_file.output_json_name]
  provisioner "local-exec" {
    command = "bash ./ssh/generate_key.sh ${local.vm_name}"
  }
}

resource "null_resource" "upload_ssh_key" {
  depends_on = [null_resource.generate_ssh_key]

  provisioner "local-exec" {
    command = "bash ./ssh/upload_key_with_id.sh ${var.reg_ru_api_key} ${local.vm_name} ${path.cwd}"
  }
}

data "local_file" "output_json_ssh" {
  filename = "${path.module}/output.json"
  depends_on = [null_resource.upload_ssh_key]
}

locals {
  key_id = jsondecode(data.local_file.output_json_ssh.content)[local.vm_name].key_id
  key_fingerprint = jsondecode(data.local_file.output_json_ssh.content)[local.vm_name].key_fingerprint
}

resource "null_resource" "create_reglet" {
  depends_on = [data.local_file.output_json_ssh]

  provisioner "local-exec" {
    command = "bash ./scripts/create_reglet.sh ${var.reg_ru_api_key} ${local.vm_name} ${var.vm_size} ${var.vm_image} ${local.vm_name} ${local.key_fingerprint} ${path.cwd}"
  }
}

data "local_file" "output_json_reglet" {
  filename = "${path.module}/output.json"
  depends_on = [null_resource.create_reglet]
}

locals {
  reglet_id = jsondecode(data.local_file.output_json_reglet.content)[local.vm_name].reglet_id
}


resource "null_resource" "wait_for_ip" {
  depends_on = [data.local_file.output_json_reglet]

  provisioner "local-exec" {
    command = "bash ./scripts/wait_for_ip.sh ${var.reg_ru_api_key} ${local.vm_name} ${local.reglet_id} ${path.cwd}"
  }
}

data "local_file" "output_json_ip" {
  filename = "${path.module}/output.json"
  depends_on = [null_resource.wait_for_ip]
}

locals {
  reglet_ip = jsondecode(data.local_file.output_json_ip.content)[local.vm_name].ip
}

resource "null_resource" "install_docker" {
  depends_on = [data.local_file.output_json_ip]

  provisioner "local-exec" {
    command = "bash ./scripts/install_docker.sh ${local.vm_name} ${local.reglet_ip} ${path.cwd}"
  }
}

resource "null_resource" "setup_sonarqube" {
  depends_on = [null_resource.install_docker]

  provisioner "local-exec" {
    command = "bash ./scripts/config_sonarqube.sh ${local.vm_name} ${local.reglet_ip} ${path.cwd}"
  }
}

resource "null_resource" "clear_previous_hosts" {
  depends_on = [null_resource.setup_sonarqube]

  provisioner "local-exec" {
    command = "bash ./scripts/aply_port_forward.sh ${local.vm_name} ${local.reglet_ip} ${path.cwd}"
  }
}

resource "null_resource" "setup_port_forward" {
  depends_on = [null_resource.clear_previous_hosts]

  provisioner "local-exec" {
    command = "ssh-keygen -R ${local.reglet_ip}"
  }
}

