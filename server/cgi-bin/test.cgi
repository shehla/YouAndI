#!/usr/bin/env python
# -*- coding: UTF-8 -*-

# enable debugging
import cgitb
import boto.dynamodb2
con = boto.dynamodb2.connect_to_region('us-east-1',
	aws_access_key_id='AKIAJNOEIFDREVVF62NQ',
	aws_secret_access_key='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')
cgitb.enable()

print "Content-Type: text/plain;charset=utf-8"
print

print "Hello World!"
print con.list_tables()
