output "vm_name" {
  value = local.vm_name
}
output "vm_ip" {
  value = local.reglet_ip
}

output "vm_id" {
  value = local.reglet_id
}
output "vm_ssh_key" {
  value = local.vm_name
}

output "vm_ssh" {
  value = "ssh -i ${path.cwd}/ssh/.ssh/${local.vm_name} root@${local.reglet_ip}"
}
output "vm_ssh_skip" {
  value = "ssh -i ${path.cwd}/ssh/.ssh/${local.vm_name} root@${local.reglet_ip} -o StrictHostKeyChecking=no"
}
output "vm_ssh_port_forward_solarqube" {
  value = "ssh -i ${path.cwd}/ssh/.ssh/${local.vm_name} -L 9000:localhost:9000 root@${local.reglet_ip} -o StrictHostKeyChecking=no"
}
