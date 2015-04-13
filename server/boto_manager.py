import boto.dynamodb2
from boto.dynamodb2.table import Table

import json


class BotoManager:
    def __init__(self):
        self.AWS_creds = self.get_AWS_creds()
        print(self.AWS_creds)

    def get_AWS_creds(self):
        with open('AWS_creds.json') as fd:
            return json.load(fd)

    def get_connection(self, region):
        return boto.dynamodb2.connect_to_region(
            region,
            aws_access_key_id=self.AWS_creds['AWSAccessKeyId'],
            aws_secret_access_key=self.AWS_creds['AWSSecretKey']
        )

    def get_table(self, table_name, region):
        return Table(table_name, connection=self.get_connection(region))
