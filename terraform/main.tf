provider "aws" {
  region = "eu-west-1"
}

data "aws_vpc" "default" {
  default = true
}

data "aws_subnet_ids" "all" {
  vpc_id = "${data.aws_vpc.default.id}"
}

module "security_group" {
  source  = "terraform-aws-modules/security-group/aws"
  version = "3.12.0"

  name        = "http"
  description = "Security group for the example"
  vpc_id      = "${data.aws_vpc.default.id}"

  ingress_cidr_blocks = ["0.0.0.0/0"]
  ingress_rules       = ["http-80-tcp", "ssh-tcp"]
  egress_rules        = ["all-all"]
}

module "ec2-instance" {
  source  = "terraform-aws-modules/ec2-instance/aws"
  version = "2.15.0"

  name                        = "kubes-clouds-test-tf"
  ami                         = "ami-0c3e74fa87d2a4227"
  key_name                    = "cdk-key"
  instance_type               = "t2.micro"
  subnet_id                   = "${sort(data.aws_subnet_ids.all.ids)[0]}"
  vpc_security_group_ids      = ["${module.security_group.this_security_group_id}"]
  associate_public_ip_address = true
  user_data                   = "${file("../install_server.sh")}"

  tags = {
    Owner       = "Kubes&Clouds"
    Environment = "test"
  }



}
