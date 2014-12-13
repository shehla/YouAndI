// In order to make the app work with your AWS credentials, you will have to put your AWS secret, keys and accountID in tiapp.xml 

windowFunctions['List Domains'] = function (evt) {
  	
	AWS.SimpleDB.listDomains({},
		
		function(data, response){
		
		alert('Success: '+ JSON.stringify(data));
		Ti.API.info(JSON.stringify(data));

  	},  function(message,error) {
		alert('Error: '+ JSON.stringify(error));
		Ti.API.info(JSON.stringify(error));

	});
		 
};


windowFunctions['createDomain'] = function (evt) {
	
	AWS.SimpleDB.createDomain({
			DomainName : 'TestDomain0928121'
		},
		function(data, response){
		
		alert('Success: '+ JSON.stringify(data));
		Ti.API.info(JSON.stringify(data));

  	},  function(message,error) {
		alert('Error: '+ JSON.stringify(error));
		Ti.API.info(JSON.stringify(error));

	});
	
};

windowFunctions['domainMetadata'] = function (evt) {
	
	AWS.SimpleDB.domainMetadata({
			DomainName : 'TestDomain0928121',
			
		},
		function(data, response){
		
		alert('Success: '+ JSON.stringify(data));
		Ti.API.info(JSON.stringify(data));

  	},  function(message,error) {
		alert('Error: '+ JSON.stringify(error));
		Ti.API.info(JSON.stringify(error));

	});
	
};

//Returns all of the attributes associated with the item. 
//Optionally, the attributes returned can be limited to one or more specified attribute name parameters.

windowFunctions['getAttributes'] = function (evt) {
	
	AWS.SimpleDB.getAttributes({
			'DomainName' : 'TestDomain0928121',
			'ItemName' : 'testItemName1',
		},
		function(data, response){
		
		alert('Success: '+ JSON.stringify(data));
		Ti.API.info(JSON.stringify(data));

  	},  function(message,error) {
		alert('Error: '+ JSON.stringify(error));
		Ti.API.info(JSON.stringify(error));

	});
	
};


//The PutAttributes operation creates or replaces attributes in an item. 
//You specify new attributes using a combination of the Attribute.X.Name and Attribute.X.Value parameters. 
//You specify the first attribute by the parameters Attribute.1.Name and Attribute.1.Value, the second attribute by the parameters Attribute.2.Name and Attribute.2.Value, and so on.


windowFunctions['putAttributes'] = function (evt) {
	
	AWS.SimpleDB.putAttributes({
			'DomainName' : 'TestDomain0928121',
			'ItemName' : 'testItemName1',
			'Attribute.1.Name' : 'testAttributeName1',
			'Attribute.1.Value' : 'testAttributeValue1',
			'Attribute.2.Name' : 'testAttributeName2',
			'Attribute.2.Value' : 'testAttributeValue2',
			
		},
		function(data, response){
		
		alert('Success: '+ JSON.stringify(data));
		Ti.API.info(JSON.stringify(data));

  	},  function(message,error) {
		alert('Error: '+ JSON.stringify(error));
		Ti.API.info(JSON.stringify(error));

	});
	
};

//With the BatchPutAttributes operation, you can perform multiple PutAttribute operations in a single call. 
//This helps you yield savings in round trips and latencies, and enables Amazon SimpleDB to optimize requests, which generally yields better throughput.

windowFunctions['batchPutAttributes'] = function (evt) {
	
	AWS.SimpleDB.batchPutAttributes({
			DomainName : 'TestDomain0928121',
			'Item.1.ItemName' : 'testItemName1',
			'Item.1.Attribute.3.Name' : 'testAttributeName3',
			'Item.1.Attribute.3.Value' : 'testAttributeValue3',
			'Item.2.ItemName' : 'testItemName2',
			'Item.2.Attribute.1.Name' : 'testAttributeName1',
			'Item.2.Attribute.1.Value' : 'testAttributeValue1'
		},
		function(data, response){
		
		alert('Success: '+ JSON.stringify(data));
		Ti.API.info(JSON.stringify(data));

  	},  function(message,error) {
		alert('Error: '+ JSON.stringify(error));
		Ti.API.info(JSON.stringify(error));

	});
	
};


//Performs multiple DeleteAttributes operations in a single call, which reduces round trips and latencies. 
//This enables Amazon SimpleDB to optimize requests, which generally yields better throughput.


windowFunctions['batchDeleteAttributes'] = function (evt) {
	
	AWS.SimpleDB.batchDeleteAttributes({
			DomainName : 'TestDomain0928121',
			'Item.1.ItemName' : 'testItemName1',
			'Item.1.Attribute.3.Name' : 'testAttributeName3',
			'Item.1.Attribute.3.Value' : 'testAttributeValue3',
			'Item.2.ItemName' : 'testItemName2',
			'Item.2.Attribute.1.Name' : 'testAttributeName1',
			'Item.2.Attribute.1.Value' : 'testAttributeValue1',
		},
		function(data, response){
		
		alert('Success: '+ JSON.stringify(data));
		Ti.API.info(JSON.stringify(data));

  	},  function(message,error) {
		alert('Error: '+ JSON.stringify(error));
		Ti.API.info(JSON.stringify(error));

	});
	
};

//Deletes one or more attributes associated with the item. If all attributes of an item are deleted, the item is deleted.

windowFunctions['deleteAttributes'] = function (evt) {

	AWS.SimpleDB.deleteAttributes({
					'ItemName' : 'testItemName1',
					'DomainName' : 'TestDomain0928121'
					},
					function(data, response){
		
						alert('Success: '+ JSON.stringify(data));
						Ti.API.info(JSON.stringify(data));
			
			  	},  function(message,error) {
						alert('Error: '+ JSON.stringify(error));
						Ti.API.info(JSON.stringify(error));

	});
	
};

//The Select operation returns a set of Attributes for ItemNames that match the select expression. 
//Select is similar to the standard SQL SELECT statement.


windowFunctions['select'] = function (evt) {
	
	AWS.SimpleDB.select({
			'SelectExpression' : 'select * from TestDomain0928121',
		},
		function(data, response){
		
		alert('Success: '+ JSON.stringify(data));
		Ti.API.info(JSON.stringify(data));

  	},  function(message,error) {
		alert('Error: '+ JSON.stringify(error));
		Ti.API.info(JSON.stringify(error));

	});
	
};

windowFunctions['deleteDomain'] = function (evt) {
	
	AWS.SimpleDB.deleteDomain({
			DomainName : 'TestDomain0928121'
		},
		function(data, response){
		
		alert('Success: '+ JSON.stringify(data));
		Ti.API.info(JSON.stringify(data));

  	},  function(message,error) {
		alert('Error: '+ JSON.stringify(error));
		Ti.API.info(JSON.stringify(error));

	});
	
};