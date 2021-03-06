#!/bin/sh 
yum update -y
yum install -y httpd git
git clone https://github.com/mifonpe/cdk-web 
cp ./cdk-web/web/* /var/www/html/
usermod -a -G apache ec2-user
chown -R ec2-user:apache /var/www
chmod 2775 /var/www
find /var/www -type d -exec chmod 2775 {} \;
find /var/www -type f -exec chmod 0664 {} \;
systemctl start httpd
systemctl enable httpd
