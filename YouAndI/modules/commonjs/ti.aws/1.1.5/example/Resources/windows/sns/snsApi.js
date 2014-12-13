

// In order to make the app work with your AWS credentials, you will have to put your AWS secret, keys and accountID in tiapp.xml 


// Global variable for the arn - amazon resource name - for the test topic created for test account
var arn ;   // this will hold the ARN for the topic created in 'createTopic' call and will look like : 'arn:aws:sns:us-east-1:723565023896:TestTopic0927121';
var sarn;

windowFunctions['createTopic'] = function(evt) {
	
		AWS.SNS.createTopic({
			'Name' : 'TestTopic0927121'//Required
		},
		function(data, response) {
		arn = data.CreateTopicResult.TopicArn;
		alert('arn'+ arn);
		alert('Success: '+ JSON.stringify(response));
		Ti.API.info(JSON.stringify(response));

  	},  function(message,error) {
		alert('Error: '+ JSON.stringify(error));
		Ti.API.info(JSON.stringify(error));

	});
	
};

windowFunctions['getTopicAttributes'] = function(evt) {
	

	AWS.SNS.getTopicAttributes({
		'TopicArn' : arn
	},
		function(data, response) {
		
		alert('Success: '+ JSON.stringify(response));
		Ti.API.info(JSON.stringify(response));

  	},  function(message,error) {
		alert('Error: '+ JSON.stringify(error));
		Ti.API.info(JSON.stringify(error));

	});
	

};

windowFunctions['listTopics'] = function(evt) {
	
		AWS.SNS.listTopics({
			
		},
		function(data, response) {
		alert('Success: '+ JSON.stringify(response));
		Ti.API.info(JSON.stringify(response));

  	},  function(message,error) {
		alert('Error: '+ JSON.stringify(error));
		Ti.API.info(JSON.stringify(error));

	});
	
};


// Executing this will send a confirmation email to email address provided below. The email body will have a Token as a part of URL like:
// https://sns.us-east-1.amazonaws.com/confirmation.html?TopicArn=arn:aws:sns:us-east-1:723565023896:TestTopic0927121&Token=2336412f37fb687f5d51e6e241d09c81deeb447a6b9592450ca6c37b5d6b91f5b2fdf1329cd43e420436cac7206097781bb8811d88b08dabc19dbb61ce756af757a8a646c526c56d40a3f43796b91e2ce012b3e099cab691390cd5964ab9b52076980bc01d8d369fff3637f62789184ecdf9d1bce04449f65bcebf1dc4eefa11&Endpoint=appcel321@gmail.com
//which needs to be passed to 'confirmsubscription' call below. 

windowFunctions['subscribe'] = function(evt) {
	AWS.SNS.subscribe({
			
			 'Endpoint' : 'appcel321@gmail.com', //Required
			 'Protocol' : 'email', //Required
			 // 'Endpoint' : '', //Required
			 // 'Protocol' : 'sms', //Required
			 'TopicArn' : arn//'arn:aws:sns:us-east-1:723565023896:TestTopic0927121' //Required
		},
		function(data, response) {
		alert('Success: '+ JSON.stringify(data) + JSON.stringify(response));
		Ti.API.info('Success: '+ JSON.stringify(data) + JSON.stringify(response));

  	},  function(message, response) {
		
		alert('Success: '+ JSON.stringify(message) + JSON.stringify(response));
		Ti.API.info('Success: '+ JSON.stringify(message) + JSON.stringify(response));
		// alert('Error: '+ JSON.stringify(error));
		// Ti.API.info(JSON.stringify(error));

	});
	
};




windowFunctions['confirmSubscription'] = function(evt) {

		AWS.SNS.confirmSubscription({
			// Copy from email you received after executing 'subscribe' call.
			'Token' : '2336412f37fb687f5d51e6e241d09c81deeb447a6b95930a1d148c456dc71d5ef5e738643a19b923a721ec4556a5dc87513f338784a5a122ab8aabfccb9aac08cb31c4187737d6436d579c99f488b0e3bf16b21fe65c6547921ffa3b6606c26fd5d7d7823acfc280aebe06a843aca0d3d3933bfd2cf1241f6b061b0bd776e898',			
			'TopicArn' : arn//'arn:aws:sns:us-east-1:723565023896:TestTopic0927121'
			//'TopicArn' : arn
			// can get it from sns managment console or arn
		},
		function(data, response) {
		sarn = data.ConfirmSubscriptionResult.SubscriptionArn;
		alert('Success: '+ JSON.stringify(response));
		Ti.API.info(JSON.stringify(response));

  	},  function(message,error) {
		alert('Error: '+ JSON.stringify(error));
		Ti.API.info(JSON.stringify(error));

	});
	
};


windowFunctions['addPermission (SNS)'] = function(evt) {

AWS.SNS.addPermission({
					'TopicArn' : arn,
					'Label' : 'MyPermission',
					'ActionName.member.1' : 'GetTopicAttributes',
					'AWSAccountId.member.1' : awsAccountId
		},
		function(data, response) {
		alert('Success: '+ JSON.stringify(response));
		Ti.API.info(JSON.stringify(response));

  	},  function(message,error) {
		alert('Error: '+ JSON.stringify(error));
		Ti.API.info(JSON.stringify(error));

	});
	
};


windowFunctions['removePermission (SNS)'] = function(evt) {
	
	AWS.SNS.removePermission({
		'Label' : 'MyPermission',
		'TopicArn' : arn,
	}, function(data, response) {
		alert('Success: '+ JSON.stringify(response));
		Ti.API.info(JSON.stringify(response));

  	},  function(message,error) {
		alert('Error: '+ JSON.stringify(error));
		Ti.API.info(JSON.stringify(error));
	});
	win.open();

};


windowFunctions['getSubscriptionAttributes'] = function(evt) {
	

	AWS.SNS.getSubscriptionAttributes({
		'SubscriptionArn' : sarn
	},
		function(data, response) {
		alert('Success: '+ JSON.stringify(response));
		Ti.API.info(JSON.stringify(response));

  	},  function(message,error) {
		alert('Error: '+ JSON.stringify(error));
		Ti.API.info(JSON.stringify(error));

	});
	
};

windowFunctions['listSubscriptions'] = function(evt) {
	

	AWS.SNS.listSubscriptions({

	}, function(data, response) {
		alert('Success: '+ JSON.stringify(response));
		Ti.API.info(JSON.stringify(response));

  	},  function(message,error) {
		alert('Error: '+ JSON.stringify(error));
		Ti.API.info(JSON.stringify(error));

	});

};

windowFunctions['listSubscriptionsByTopic'] = function(evt) {
	

	AWS.SNS.listSubscriptionsByTopic({
		'TopicArn' : arn
	}, function(data, response) {
		alert('Success: '+ JSON.stringify(response));
		Ti.API.info(JSON.stringify(response));

  	},  function(message, response) {
		alert('Error: '+ JSON.stringify(message) + JSON.stringify(response));
		Ti.API.info('Error: '+ JSON.stringify(message) + JSON.stringify(response));
	});
	win.open();

};

windowFunctions['unsubscribe'] = function(evt) {
	
	AWS.SNS.unsubscribe({
		'SubscriptionArn' : sarn
	}, function(data, response) {
		alert('Success: '+ JSON.stringify(response));
		Ti.API.info(JSON.stringify(response));

  	},  function(message,error) {
		alert('Error: '+ JSON.stringify(error));
		Ti.API.info(JSON.stringify(error));

	});

};


windowFunctions['publish'] = function(evt) {
	

	AWS.SNS.publish({
		'TopicArn' : arn,
		'Message' : 'Hello,Test this side'
	}, function(data, response) {
		alert('Success: '+ JSON.stringify(response));
		Ti.API.info(JSON.stringify(response));

  	},  function(message,error) {
		alert('Error: '+ JSON.stringify(error));
		Ti.API.info(JSON.stringify(error));

	});
	

};




windowFunctions['deleteTopic'] = function(evt) {
	

	AWS.SNS.deleteTopic({
		'TopicArn' : arn
	}, function(data, response) {
		alert('Success: '+ JSON.stringify(response));
		Ti.API.info(JSON.stringify(response));

  	},  function(message,error) {
		alert('Error: '+ JSON.stringify(error));
		Ti.API.info(JSON.stringify(error));

	});

};


windowFunctions['setSubscriptionAttributes'] = function(evt) {
	var win = createWindow();
	var offset = addBackButton(win);
	var table = Ti.UI.createTableView({
		top : 44
	});
	win.add(table);
	var arrDomains = [];

	AWS.SNS.setSubscriptionAttributes({
		'AttributeName' : '',//DeliveryPolicy
		'AttributeValue' : '',
		'SubscriptionArn' : ''
	}, function(data, response) {
		alert('success' + JSON.stringify(response));
	}, function(message,error) {
		alert('error' + error);
	});
	win.open();

};
windowFunctions['setTopicAttributes'] = function(evt) {
	var win = createWindow();
	var offset = addBackButton(win);

	var table = Ti.UI.createTableView({
		top : 44
	});
	win.add(table);
	var arrDomains = [];

	AWS.SNS.setTopicAttributes({
		AttributeName : '',//DisplayName
		AttributeValue : '',
		TopicArn : ''
	}, function(data, response) {
		alert('success' + JSON.stringify(response));
	}, function(message,error) {
		alert('error' + error);
	});
	win.open();

};

