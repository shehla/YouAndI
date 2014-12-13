// In order to make the app work with your AWS credentials, you will have to put your AWS secret, keys and accountID in tiapp.xml 


windowFunctions['getSessionToken'] = function(evt) { 	
 	
 		
		AWS.STS.getSessionToken({}, 
			function(data, response) {
			alert('Success: '+ JSON.stringify(response));
			Ti.API.info(JSON.stringify(response));

			Ti.App.Properties.setString('tempSessionToken', data.GetSessionTokenResult.Credentials.SessionToken);
			Ti.App.Properties.setString('tempSecretAccessKey', data.GetSessionTokenResult.Credentials.SecretAccessKey);
			Ti.App.Properties.setString('tempAccessKeyID', data.GetSessionTokenResult.Credentials.AccessKeyId);
			Ti.App.Properties.setString('tempExpiration', data.GetSessionTokenResult.Credentials.Expiration);

			
			
		}, function(message,error) {
			alert('Error: '+ JSON.stringify(error));
			Ti.API.info(JSON.stringify(error));
		});

};


windowFunctions['createTable'] = function(evt) {
	
	var param = {
	"RequestJSON" : {
	"TableName" : "my-ddb-test-tab-0926121",
	"KeySchema" : {
	"HashKeyElement" : {
	"AttributeName" : "name",
	"AttributeType" : "S"
	},
	"RangeKeyElement" : {
	"AttributeName" : "1234",
	"AttributeType" : "N"
	}
	},
	"ProvisionedThroughput" : {
	"ReadCapacityUnits" : 10,
	"WriteCapacityUnits" : 10
	}
	}
	};

AWS.DDB.createTable(param,
			
		function(data, response) {
		alert('Success: '+ JSON.stringify(response));
		Ti.API.info(JSON.stringify(response));

  	},  function(message, error) {
		alert('Error: '+ JSON.stringify(message)+ JSON.stringify(error));
		Ti.API.info(JSON.stringify(message)+ JSON.stringify(error));

	});
	
};

windowFunctions['listTables'] = function(evt) {
	
	var params = {
			'RequestJSON' : {}
		};
		
AWS.DDB.listTables(params,
			
		function(data, response) {
		alert('Success: '+ JSON.stringify(response));
		Ti.API.info(JSON.stringify(response));

  	},  function(message,error) {
		alert('Error: '+ JSON.stringify(error));
		Ti.API.info(JSON.stringify(error));

	});
	
};


windowFunctions['putItem'] = function(evt) {
	
	var params = {
			'RequestJSON' : {
				"TableName" : 'my-ddb-test-tab-0926121',
				"Item" : {
					"name" : { "S" : 'test'}, //Required
					"1234" : { "N" : "12345"}, //Required
					'testatr' : { 'S' : 'appcel tester'}
				}
			} //Required
		};
	
	
		
		AWS.DDB.putItem(params,
			
		function(data, response) {
		alert('Success: '+ JSON.stringify(response));
		Ti.API.info(JSON.stringify(response));

  	},  function(message,error) {
		alert('Error: '+ JSON.stringify(error));
		Ti.API.info(JSON.stringify(error));

	});
	
};
	
windowFunctions['updateItem'] = function(evt) {	
	var params = {
				'RequestJSON' : {
					"TableName" : 'my-ddb-test-tab-0926121',
					"Key" : {
						"HashKeyElement" : {
							"S" : "name"
						},
						"RangeKeyElement" : {
							"N" : "1234"
						}
					},
					"AttributeUpdates" : {
						"status" : {
							"Value" : {
								"S" : "newvalue"
							},
							"Action" : "PUT"
						}
					},
					"ReturnValues" : "ALL_NEW"
				}
				//Required
			};
	
		AWS.DDB.updateItem(params,
			
			function(data, response) {
				alert('Success: '+ JSON.stringify(response));
				Ti.API.info(JSON.stringify(response));
	
	  	},  function(message,error) {
				alert('Error: '+ JSON.stringify(error));
				Ti.API.info(JSON.stringify(error));
	
		});
	
};
	
	
windowFunctions['updateTable'] = function(evt) {
	
		var params = [
		'{"RequestJSON" : ',
		'{"TableName" : "my-ddb-test-tab-0926121","ProvisionedThroughput" : ',
		'{"ReadCapacityUnits" : 9, "WriteCapacityUnits" : 9',
		'}}}'
		].join('');
		AWS.DDB.updateTable(JSON.parse(params),
			function(data, response) {
				alert('Success: '+ JSON.stringify(response));
				Ti.API.info(JSON.stringify(response));
	
	  	},  function(message,error) {
				alert('Error: '+ JSON.stringify(error));
				Ti.API.info(JSON.stringify(error));
	
		});
	
};
	
windowFunctions['query'] = function(evt) {	
	var params = {
			'RequestJSON' : {
				"TableName" : 'my-ddb-test-tab-0926121',
				"HashKeyValue" : {
					"S" : "1"
				}
			} //Required
		};

AWS.DDB.query(params,
			
		function(data, response) {
		alert('Success: '+ JSON.stringify(response));
		Ti.API.info(JSON.stringify(response));

  	},  function(message,error) {
		alert('Error: '+ JSON.stringify(error));
		Ti.API.info(JSON.stringify(error));

	});
	
};


windowFunctions['deleteItem'] = function(evt) {	
	
	var params = {
				'RequestJSON' : {
					"TableName" : 'my-ddb-test-tab-0926121',
					"Key" : {
						"HashKeyElement" : {
							"S" : "test"
						},
						"RangeKeyElement" : {
							"N" : "12345"
						}
					}
				} //Required
			};
			
AWS.DDB.deleteItem(params,
			
		function(data, response) {
		alert('Success: '+ JSON.stringify(response));
		Ti.API.info(JSON.stringify(response));

  	},  function(message,error) {
		alert('Error: '+ JSON.stringify(error));
		Ti.API.info(JSON.stringify(error));

	});
	
};

windowFunctions['describeTable'] = function(evt) {
	
	var params = {
			'RequestJSON' : {
				"TableName" : 'my-ddb-test-tab-0926121' //Required
			}
				};
			
AWS.DDB.describeTable(params,
			
		function(data, response) {
		alert('Success: '+ JSON.stringify(response));
		Ti.API.info(JSON.stringify(response));

  	},  function(message,error) {
		alert('Error: '+ JSON.stringify(error));
		Ti.API.info(JSON.stringify(error));

	});
	
};


windowFunctions['deleteTable'] = function(evt) {
	var params = {
			'RequestJSON' : {
				"TableName" : 'my-ddb-test-tab-0926121' //Required
			}
				};
			
AWS.DDB.deleteTable(params,
			
		function(data, response) {
		alert('Success: '+ JSON.stringify(response));
		Ti.API.info(JSON.stringify(response));

  	},  function(message,error) {
		alert('Error: '+ JSON.stringify(error));
		Ti.API.info(JSON.stringify(error));

	});
	
};


windowFunctions['batchWriteItem'] = function(evt) {
	
	var params ='{"RequestJSON" : {"RequestItems": {"my-ddb-test-tab-0926121": [{"PutRequest":{"Item":{"name":{"S":"2012-04-03T11:04:47.034Z"},"1234":{"N":"6"}}}},{"DeleteRequest":{"Key":{"HashKeyElement":{"S":"1"},"RangeKeyElement":{"N":"1"}}}}], "my-ddb-test-tab": [{"PutRequest":{"Item": {"name":{"S":"Amazon DynamoDB"},"1234":{"N":"6"}}}}]}}}';
			
AWS.DDB.batchWriteItem(JSON.parse(params),
			
		function(data, response) {
		alert('Success: '+ JSON.stringify(response));
		Ti.API.info(JSON.stringify(response));

  	},  function(message,error) {
		alert('Error: '+ JSON.stringify(error));
		Ti.API.info(JSON.stringify(error));

	});
	
};



windowFunctions['batchGetItem'] = function(evt) {
	
	var params = '{"RequestJSON" : {"RequestItems":{"my-ddb-test-tab": {"Keys": [{"HashKeyElement": {"S":"1"}, "RangeKeyElement":{"N":"1"}}],"AttributesToGet":["item2"]},"my-ddb-test-tab-0926121": {"Keys": [{"HashKeyElement": {"S":"a"}, "RangeKeyElement":{"N":"1"}}],"AttributesToGet": ["item1"]}}}}';
			
AWS.DDB.batchGetItem(JSON.parse(params),
			
		function(data, response) {
		alert('Success: '+ JSON.stringify(response));
		Ti.API.info(JSON.stringify(response));

  	},  function(message,error) {
		alert('Error: '+ JSON.stringify(error));
		Ti.API.info(JSON.stringify(error));

	});
	
};

windowFunctions['scan'] = function(evt) {
		var params = {
			'RequestJSON' : {
				"TableName" : 'my-ddb-test-tab',
				"ScanFilter" : {
					"1234" : {
						"AttributeValueList" : [{
							"N" : "1"
						}],
						"ComparisonOperator" : "GT"
					}
				}
			}  //Required
		};
		AWS.DDB.scan(params, 
			function(data, response) {
				alert('Success: '+ JSON.stringify(response));
				Ti.API.info(JSON.stringify(response));
	
	  	},  function(message,error) {
				alert('Error: '+ JSON.stringify(error));
				Ti.API.info(JSON.stringify(error));
	
		});
	
};