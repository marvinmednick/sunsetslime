#!/usr/bin/env python

import boto3
import json
import logging
import os
import pprint
import time
import argparse
from botocore.exceptions import ClientError
from decimal import *

logger = logging.getLogger(__name__)

class S3Client:
    def __init__(self, region=None):
        try:
            if region is None:
                self.client = boto3.client('s3')
            else:
                self.client = boto3.client('s3', region_name=region)
        except ClientError as e:
            logging.error(e)
            raise

    def list(self):
        # Retrieve the list of existing buckets
        list_bucket_response = self.client.list_buckets()

        bucket_list = [];

        for b in list_bucket_response['Buckets']:

            try:
                result = self.client.get_bucket_location(Bucket=b["Name"])
            except ClientError as e:
                raise Exception( "boto3 client error in get_bucket_location_of_s3: " + e.__str__())
            except Exception as e:
                raise Exception( "Unexpected error in get_bucket_location_of_s3 function: " +    e.__str__())

            b["LocationConstraint"] = result['LocationConstraint'];
            bucket_list.append(b)

        return bucket_list


class S3Bucket:
    """Encapsulates an Amazon DynamoDB table of movie data."""
    def __init__(self, bucket_name, client=None, region=None):
        """
        :param dyn_resource: A Boto3 DynamoDB resource.
        """

        if client is None:
            self.s3_client = S3Client(region)

        else:
            self.s3_client = client
            
        self.region = region
        self.bucket_name = bucket_name

    def objects(self,prefix=None):
        response = self.s3_client.list_objects_v2(Bucket=self.bucket_name,Prefix=prefix)
        files = list(map(lambda x: x["Key"],response))
        print(files)
        return 

    def create_bucket(self, bucket_name):
        """Create an S3 bucket in a specified region

        If a region is not specified, the bucket is created in the S3 default
        region (us-east-1).

        :param bucket_name: Bucket to create
        :return: True if bucket created, else False
        """

        # Create bucket
        try:
            if self.region is None:
                self.s3_client.create_bucket(Bucket=bucket_name)
            else:
                location = {'LocationConstraint': region}
                self.s3_client.create_bucket(Bucket=bucket_name,
                                        CreateBucketConfiguration=location)
        except ClientError as e:
            logging.error(e)
            return False

        return True

    def add_item(self, pk, sk, info):
        """
        Adds a item to the buck

        :param pk: The partion key
        :param sk: Sort Key
        :param info: dictionary with feilds of record to add
        """

        try:
            item={
                'pk': pk,
                'sk': sk,
                }
            item.update(info)
            self.table.put_item(Item=item)

        except ClientError as err:
            logger.error(
                "Couldn't add item %s to table %s. Here's why: %s: %s",
                sk, self.table.name,
                err.response['Error']['Code'], err.response['Error']['Message'])
            raise

    def get_item(self, pk, sk):
        """
        Gets movie data from the table for a specific item.

        :param pk: The partition key
        :param pk: The sort key
        :return: The data about the requested .
        """
        try:
            response = self.table.get_item(Key={'pk': sk, 'sk': sk})
        except ClientError as err:
            logger.error(
                "Couldn't get movie %s from table %s. Here's why: %s: %s",
                sk, self.table.name,
                err.response['Error']['Code'], err.response['Error']['Message'])
            raise
        else:
            return response['Item']

    def update_item(self, pk, sk, info):
        """
        Updates rating and plot data for a movie in the table.

        :param sk: The sk of the movie to update.
        :param pk: The release pk of the movie to update.
        :param rating: The updated rating to the give the movie.
        :param plot: The updated plot summary to give the movie.
        :return: The fields that were updated, with their new values.
        """
        try:
            response = self.table.update_item(
                Key={'pk': pk, 'sk': sk},
                UpdateExpression="set info.rating=:r, info.plot=:p",
                ExpressionAttributeValues={
                    ':r': rating, ':p': plot},
                ReturnValues="UPDATED_NEW")
        except ClientError as err:
            logger.error(
                "Couldn't update movie %s in table %s. Here's why: %s: %s",
                sk, self.table.name,
                err.response['Error']['Code'], err.response['Error']['Message'])
            raise
        else:
            return response['Attributes']


    def delete_item(self, sk, pk):
        """
        Deletes a movie from the table.

        :param sk: The sk of the movie to delete.
        :param pk: The release pk of the movie to delete.
        """
        try:
            self.table.delete_item(Key={'pk': pk, 'sk': sk})
        except ClientError as err:
            logger.error(
                "Couldn't delete movie %s. Here's why: %s: %s", sk,
                err.response['Error']['Code'], err.response['Error']['Message'])
            raise

    def query_item(self, pk):
        """
        Queries for movies that were released in the specified pk.

        :param pk: The pk to query.
        :return: The list of movies that were released in the specified pk.
        """
        try:
            response = self.table.query(KeyConditionExpression=Key('pk').eq(pk))
        except ClientError as err:
            logger.error(
                "Couldn't query for movies released in %s. Here's why: %s: %s", pk,
                err.response['Error']['Code'], err.response['Error']['Message'])
            raise
        else:
            return response['Items']

    def table_scan(self):
        return self.table.scan()


if __name__ == '__main__':

    parser = argparse.ArgumentParser(
                prog = 'S3 Util',
                description = 'Test program for working with S3',
                epilog = 'dun dun te dun... '
    )

    parser.add_argument('-b', '--buckets', action='store_true', help='List all buckets')
    parser.add_argument('-l', '--list', action='store_true', help='list objects in a bucket')
#    parser.add_argument('-c', '--create', action='store_true', help='create a DynamoDB table with the specified name')
    parser.add_argument('-r', '--region', metavar='REGION_NAME', type=str, help='use the specified regiion')
    parser.add_argument('-v', '--verbose', action='store_true')  # on/off flag')
    parser.add_argument('bucket', nargs='?', metavar='S3 BUCKET', type=str, help='the name of a S3 Bucket to work with')

    # Define the optional argument "-a" or "--add"
    parser.add_argument('-a', '--add',nargs=3, metavar=("PK", "SK", "<JSON Attibutes>"), help='pk sk and a list attributes as JSON String')

    # Parse the arguments from the command line
    args = parser.parse_args()

    print(f'Args are {args}')

    if args.region:
        s3client = S3Client(region=args.region)
        region_description = args.region + " region"
    else:
        s3client = S3Client()
        region_description = "default region"

    # Print the buckets
    if args.buckets:
        bucket_list = s3client.list()

        print(f"Current Buckets in {region_description}")
        for b in bucket_list:
            print(f"   - {b['Name']}  Location Constraint: {b['LocationConstraint']}")
        exit(0)

    if args.bucket is None:
        print("Bucket name is required for all commands except --list")
        exit(1)
    

    if args.create:
        print("TODO Create a bucket")

    else:
        bucket = S3Bucket(args.bucket)

    if args.list:
        objects = buicket.objects()
        for obj in objects:
            print(f"   - {obj}")


