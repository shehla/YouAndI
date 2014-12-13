// The SES service with AWS account having no production privilege requires all sender and receiver email
// addresses to be verified in SES system. So please make sure that those are managed correcetly from console.aws.amazon.com/ses
// In order to make the app work with your AWS credentials, you will have to put your AWS secret, keys and accountID in tiapp.xml 

windowFunctions['listVerifiedEmailAddresses'] = function(evt) {
	

	AWS.SES.listVerifiedEmailAddresses({

		}, function(response) {
			alert('Success: '+ JSON.stringify(response));
			Ti.API.info('~~~~~~~~~~~~~~~~~~~~Success: '+ JSON.stringify(response));
		}, function(message,error) {
			alert('Error: '+ JSON.stringify(error));
			Ti.API.info('~~~~~~~~~~~~~~~~~~~~Error: '+ JSON.stringify(error));
	
		});
	

};


//This API send Verification Request to an email
//For email address verification go to the email and follow the link


windowFunctions['verifyEmailAddress'] = function(evt) {
	

	AWS.SES.verifyEmailAddress({
		'EmailAddress' : 'appcel321@gmail.com'
		}, function(response) {
			alert('Success: '+ JSON.stringify(response));
			Ti.API.info('~~~~~~~~~~~~~~~~~~~~Success: '+ JSON.stringify(response));
		}, function(message,error) {
			alert('Error: '+ JSON.stringify(error));
			Ti.API.info('~~~~~~~~~~~~~~~~~~~~Error: '+ JSON.stringify(error));
	
		});
};

windowFunctions['getSendQuota'] = function(evt) {
	

	AWS.SES.getSendQuota({
		
		}, function(response) {
			alert('Success: '+ JSON.stringify(response));
			Ti.API.info('~~~~~~~~~~~~~~~~~~~~Success: '+ JSON.stringify(response));
		}, function(message,error) {
			alert('Error: '+ JSON.stringify(error));
			Ti.API.info('~~~~~~~~~~~~~~~~~~~~Error: '+ JSON.stringify(error));
	
		});
};

windowFunctions['getSendStatistics'] = function(evt) {
	

	AWS.SES.getSendStatistics({

		}, function(response) {
			alert('Success: '+ JSON.stringify(response));
			Ti.API.info('~~~~~~~~~~~~~~~~~~~~Success: '+ JSON.stringify(response));
		}, function(message,error) {
			alert('Error: '+ JSON.stringify(error));
			Ti.API.info('~~~~~~~~~~~~~~~~~~~~Error: '+ JSON.stringify(error));
	
		});
	

};



windowFunctions['sendEmail'] = function(evt) {
	

	AWS.SES.sendEmail({
			'Source' : 'appcel321@gmail.com',
			'Destination' : {
				'ToAddresses' : ['etcarev@appcelerator.com'],
				'CcAddresses' : ['appcel321@gmail.com'],
				'BccAddresses' : ['appcel321@gmail.com']
			},
			'Message' : {
				'Subject' : {
					'Data' : 'Hello Message'
				},
				'Body' : {
					'Text' : {
						'Data' : 'Hi... This is a test message.'
					}
				}
			}
		}, function(response) {
				alert('Success: '+ JSON.stringify(response));
				Ti.API.info('~~~~~~~~~~~~~~~~~~~~Success: '+ JSON.stringify(response));
		}, function(message,error) {
				alert('Error: '+ JSON.stringify(error));
				Ti.API.info('~~~~~~~~~~~~~~~~~~~~Error: '+ JSON.stringify(error));
			
		});
	

};

windowFunctions['sendRawEmail'] = function(evt) { //doesn't work
			
   // var param =  ['Received: from smtp-out.gmail.com (123.45.67.89) by',
   				// 'in.appcelerator.com (87.65.43.210); Fri, 17 Dec 2010 14:26:22',
   				// 'From: "Andrew" <appcel321@gmail.com>',
	            // 'To: "Bob" <etcarev@appcelerator.com>', 
	            // 'Date: Fri, 17 Dec 2010 14:26:21 -0800',
	            // 'Subject: Hello',
	            // 'Message-ID: <61967230-7A45-4A9D-BEC9-87CBCF2211C9@appcelerator.com>',
	            // 'Accept-Language: en-US',
	            // 'Content-Language: en-US',
	            // 'Content-Type: text/plain; charset="us-ascii"',
	            // 'Content-Transfer-Encoding: quoted-printable',
	            // 'MIME-Version: 1.0',
	            // ' ',             
	            // 'Hello, I hope you are having a good day.',                 
	            // '-Andrew'].join('\n');
	  
	  var param = [
	  				'From: appcel321@gmail.com',
					'To: appcel321@gmail.com',
					'Cc: appcel321@gmail.com',
					'Subject: Hello Message',
					'MIME-Version: 1.0',
					'Content-Type: text/plain; charset=UTF-8',
					'Content-Transfer-Encoding: 7bit',
					'Date: Tue, 2 Oct 2012 22:08:17 +0000',
					' ',
					'Hi... This is a test message.'
	  			].join('\n');
	

	AWS.SES.sendRawEmail({
			'RawMessage' : {
				'Data' : Ti.Utils.base64encode(param)
			}
		},
		function(data, response){
			alert('Success: '+ JSON.stringify(data) + JSON.stringify(response));
			Ti.API.info('~~~~~~~~~~~~~~~~~~~~Success: '+ JSON.stringify(response));
			
		},
		function(message,error){
			//alert('Error: '+ JSON.stringify(error));
			alert('error');
			Ti.API.info('~~~~~~~~~~~~~~~~~~~~Error: '+ JSON.stringify(error));
			//error handling code here.
		});
	

};


windowFunctions['deleteVerifiedEmailAddress'] = function(evt) {
	

	AWS.SES.deleteVerifiedEmailAddress({
			'EmailAddress' : 'appcel321@gmail.com'
		}, function(response) {
			alert('Success: '+ JSON.stringify(response));
			Ti.API.info('~~~~~~~~~~~~~~~~~~~~Success: '+ JSON.stringify(response));
		}, function(message,error) {
			alert('Error: '+ JSON.stringify(error));
			Ti.API.info('~~~~~~~~~~~~~~~~~~~~Error: '+ JSON.stringify(error));
				
		});
	

};
