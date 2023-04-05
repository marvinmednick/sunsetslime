import boto3

# List buckets in the US East (N. Virginia) region
s3_us_east_1 = boto3.client('s3', region_name='us-east-1')
response_us_east_1 = s3_us_east_1.list_buckets()
buckets_us_east_1 = [bucket['Name'] for bucket in response_us_east_1['Buckets']]
print('Buckets in US East (N. Virginia) region:', response_us_east_1)

# List buckets in the US West (Oregon) region
s3_us_west_2 = boto3.client('s3', region_name='us-west-2')
response_us_west_2 = s3_us_west_2.list_buckets()
buckets_us_west_2 = [bucket['Name'] for bucket in response_us_west_2['Buckets']]
print('Buckets in US West (Oregon) region:', response_us_west_2)
