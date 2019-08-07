import cdk = require('@aws-cdk/core');
import ecsPatterns = require('@aws-cdk/aws-ecs-patterns');
import ecs = require('@aws-cdk/aws-ecs');
import elbv2 = require('@aws-cdk/aws-elasticloadbalancingv2');
import ec2 = require('@aws-cdk/aws-ec2');


export class CdkStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps){
    super(scope, id, props);
   
    const vpc =  ec2.Vpc.fromLookup(this, "VPC", {
      tags: {"Name": "VpcStack/VPC"}
    });
    
    const cluster  = new ecs.Cluster(this, "Cluster", {
      vpc: vpc
    });

    const loadBalancedFargateService = new ecsPatterns.LoadBalancedFargateService(this, 'Service', {
      cluster,
      memoryLimitMiB: 1024,
      cpu: 512,
      publicLoadBalancer: true,
      image: ecs.ContainerImage.fromRegistry("amazon/amazon-ecs-sample"),
    });

    const internal_lb = new elbv2.ApplicationLoadBalancer(this, 'LB', {
      vpc,
      internetFacing: false
    });

    const listener = internal_lb.addListener('Listener', {
      port: 80,
      open: true,
    });

    listener.addTargets("ECSTG", {
      port: 80,
      targets: [loadBalancedFargateService.service]
    });

    new cdk.CfnOutput(this, "InternalLD", {value: internal_lb.loadBalancerDnsName})
  }
}
