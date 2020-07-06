import * as cdk from '@aws-cdk/core';
import * as ec2 from '@aws-cdk/aws-ec2';
import { readFileSync } from 'fs';

export class TypescriptStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    
    const userdata_file = readFileSync('../install_server.sh', 'utf-8');

    const vpc = new ec2.Vpc(this, 'MyCDK-VPC', {

      cidr: '10.0.0.0/21', 
      maxAzs: 3,

      subnetConfiguration: [
        {
          subnetType: ec2.SubnetType.PUBLIC,
          name: 'Public',
          cidrMask: 24,
        },
      ],
    });

    const securityGroup = new ec2.SecurityGroup(this, 'MyCDKSecurityGroup', {
      vpc,
      securityGroupName: "Instance-SG",
      description: 'Allow http access to ec2 instances from anywhere',
      allowAllOutbound: true 
    });

    securityGroup.addIngressRule(
      ec2.Peer.anyIpv4(), 
      ec2.Port.tcp(80), 
      'allow ingress http traffic'                                                                                                                                                     
    )
    securityGroup.addIngressRule(
      ec2.Peer.anyIpv4(), 
      ec2.Port.tcp(22), 
      'allow ingress ssh traffic'                                                                                                                                                     
    )
  
    const linux = new ec2.AmazonLinuxImage({
      generation: ec2.AmazonLinuxGeneration.AMAZON_LINUX_2,
      edition: ec2.AmazonLinuxEdition.STANDARD,
      virtualization: ec2.AmazonLinuxVirt.HVM,
      storage: ec2.AmazonLinuxStorage.GENERAL_PURPOSE,
    });


    const instance =  new ec2.Instance(this, 'MyCDKInstance', {
      vpc,
      machineImage: linux,
      instanceName: 'kubes-clouds-test-ts',
      instanceType: ec2.InstanceType.of(ec2.InstanceClass.T2, ec2.InstanceSize.MICRO),
      securityGroup: securityGroup,
    })
    instance.addUserData( userdata_file );
    instance.instance.addPropertyOverride('KeyName', `cdk-key`);


  }
}
