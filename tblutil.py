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

class DynTable:
    """Encapsulates an Amazon DynamoDB table of movie data."""
    def __init__(self, dyn_resource):
        """
        :param dyn_resource: A Boto3 DynamoDB resource.
        """
        self.dyn_resource = dyn_resource
        self.table = None
        self.table_name = None

    def open_table(self, table_name):
        self.table_name = table_name
        tbl = dynamodb.Table(table_name)
        self.table = tbl
        print(f"Table Status {tbl.table_status}")

    def table_status(self):
        self.table.table_status

    def create_table(self, table_name):
        """
        Creates an Amazon DynamoDB table that can be used to store movie data.
        The table uses the release pk of the movie as the partition key and the
        sk as the sort key.

        :param table_name: The name of the table to create.
        :return: The newly created table.
        """
        try:
            self.table = self.dyn_resource.create_table(
                TableName=table_name,
                KeySchema=[
                    {'AttributeName': 'pk', 'KeyType': 'HASH'},  # Partition key
                    {'AttributeName': 'sk', 'KeyType': 'RANGE'}  # Sort key
                ],
                AttributeDefinitions=[
                    {'AttributeName': 'pk', 'AttributeType': 'S'},
                    {'AttributeName': 'sk', 'AttributeType': 'S'}
                ],
                ProvisionedThroughput={'ReadCapacityUnits': 10, 'WriteCapacityUnits': 10})
            self.table.wait_until_exists()
        except ClientError as err:
            logger.error(
                "Couldn't create table %s. Here's why: %s: %s", table_name,
                err.response['Error']['Code'], err.response['Error']['Message'])
            raise
        else:
            return self.table

    def add_item(self, pk, sk, info):
        """
        Adds a movie to the table.

        :param pk: The partion key
        :param sk: Sort Key
        :param info: dictionary with feilds of record to add
        """

        print(f"Adding entry PK: {pk} SK: {sk} Info: {info}")

        try:
            item={
                'PK': pk,
                'SK': sk,
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
                prog = 'Dynamo DB ',
                description = 'Test program for working with dynamo db',
                epilog = 'dun dun te dun... '
    )

    parser.add_argument('-l', '--list', action='store_true', help='list the available DynamoDB tables')
    parser.add_argument('-c', '--create', action='store_true', help='create a DynamoDB table with the specified name')
    parser.add_argument('-r', '--region', metavar='REGION_NAME', type=str, help='use the specified regiion')
    parser.add_argument('-v', '--verbose', action='store_true')  # on/off flag')
    parser.add_argument('table', nargs='?', metavar='TABLE', type=str, help='the name of a DynamoDB table to open or create')

    # Define the optional argument "-a" or "--add"
    parser.add_argument('-a', '--add',nargs=3, metavar=("PK", "SK", "<JSON Attibutes>"), help='pk sk and a list attributes as JSON String')

    # Parse the arguments from the command line
    args = parser.parse_args()

    print(f'Args are {args}')

    endpoint_url = None
    if args.region == "local":
        endpoint_url='http://localhost:8000'
    dynamodb = boto3.resource('dynamodb',endpoint_url=endpoint_url,region_name=args.region)
    table =  DynTable(dynamodb)

    # Print the table names
    if args.list:
        table_list = list(dynamodb.tables.all())

        print("Tables in the current database:")
        for table in table_list:
            print(table.name)
        exit(0)

    if args.table is None:
        print("Table name is required for all commands except --list")
        exit(1)

    if args.create:
        table.create_table(args.table)
    else:
        table.open_table(args.table)

    print(f"Table Status {table.table_status}")

    # Check if the optional argument "-a" or "--add" was specified
    if args.add:
        # Split args into primary, sort key and additional attributes
        pk, sk, attr = args.add
        # Retrieve the two parameters passed with the "-a" argument
        parsed = json.loads(attr,parse_float=Decimal)
        # Do something with the id and text values, such as adding them to a table
        print(f"Adding entry PK: {pk} SK: {sk} {parsed}")
        table.add_item(str(pk),str(sk),parsed)


    contents = table.table_scan()
    print(f"Contents {contents}")
