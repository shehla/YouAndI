// Some things to be aware of:
// AWS requires each BucketName to be a unique name in S3's global namespace
// Deleting bucket does not release the bucketname from the global namespace right away
// so if you create, delete, recreate in succession, it may not work
// In order to make the app work with your AWS credentials, you will have to put your AWS secret, keys and accountID in tiapp.xml 
windowFunctions['putBucket'] = function(evt) {
	
		AWS.S3.putBucket({
		// you may need to choose diff bucketname if this one is not available 
				'BucketName' : 'test100312_1'
			},
			function(data, response) {
				alert('Success: '+ JSON.stringify(response));
				Ti.API.info(JSON.stringify(response));
	
	  	},  function(message,error) {
				alert('Error: '+ JSON.stringify(error));
				Ti.API.info(JSON.stringify(error));
	
		});
	
};

// For all tests below, we will assume that bucket created above still exists. 


windowFunctions['headBucket'] = function(evt) { 		
	
	AWS.S3.headBucket({
			'BucketName' : 'test100312_1'
		},
			 function(data, response) {
			 	alert('Success: ' + JSON.stringify(response));
				Ti.API.info(JSON.stringify(response));
	  	 },  function(message,error) {
			 	alert('Error: '+ JSON.stringify(error));
				Ti.API.info(JSON.stringify(error));
		});
	
};

windowFunctions['getBucket'] = function(evt) {

	AWS.S3.getBucket({
			 'BucketName' : 'test100312_1'
			},
			function(data, response) {
				alert('Success: '+ JSON.stringify(response));
				Ti.API.info(JSON.stringify(response));
	
	  	},  function(message,error) {
				alert('Error: '+ JSON.stringify(error));
				Ti.API.info(JSON.stringify(error));
	
		});
	
};


windowFunctions['putBucketPolicy'] = function(evt) {
		var jsonObject = {
				"Version" : "2008-10-17",
				//canonical user ID - look up your AWS account and grab one from there
				"Id" : "bdc36625affafdb55b4eef63987c06e225014c5e6cbbe103161eb0833222b364",
				"Statement" : [{
					"Effect" : 'Allow',
					"Sid" : "1",
					"Principal" : {
						"AWS" : "*"
					},
					"Action" : ["s3:*"],
					"Resource" : "arn:aws:s3:::test100312_1/*"
				}]
			};
			
		AWS.S3.putBucketPolicy({
			'BucketName' : 'test100312_1',
			'XMLTemplate' : JSON.stringify(jsonObject)
			},
			function(data, response) {
				alert('Success: '+ JSON.stringify(response));
				Ti.API.info(JSON.stringify(response));
	
	  	},  function(message,error) {
				alert('Error: '+ JSON.stringify(error));
				Ti.API.info(JSON.stringify(error));
	
		});
	
};




windowFunctions['putObject'] = function(evt) {

	var f = Titanium.Filesystem.getFile(Ti.Filesystem.resourcesDirectory, 'KS_nav_views.png');
	
	AWS.S3.putObject({
			'BucketName' : 'test100312_1',
			'ObjectName' : 'KS_nav_views.png',
			'File' : f
			},
			function(data, response) {
				alert('Success: '+ JSON.stringify(response));
				Ti.API.info(JSON.stringify(response));
	
	  	},  function(message,error) {
				alert('Error: '+ JSON.stringify(error));
				Ti.API.info(JSON.stringify(error));
	
		});
	
};


windowFunctions['headObject'] = function(evt) {
	
	AWS.S3.headObject({
			'BucketName' : 'test100312_1',
			'ObjectName' : 'KS_nav_views.png'
		},
			function(data, response) {
				alert('Success: ' + JSON.stringify(response));
				Ti.API.info(JSON.stringify(response));
	
	  	},  function(message,error) {
				alert('Error: '+ JSON.stringify(error));
				Ti.API.info(JSON.stringify(error));
	
		});

};

windowFunctions['getObject'] = function(evt) {

	AWS.S3.getObject({
			 'BucketName' : 'test100312_1',
			 'ObjectName' : 'KS_nav_views.png'
			},
			function(data, response) {
				alert('Success: '+ JSON.stringify(response));
				Ti.API.info(JSON.stringify(response));
	
	  	},  function(message,error) {
				alert('Error: '+ JSON.stringify(error));
				Ti.API.info(JSON.stringify(error));
	
		});
	
};


windowFunctions['getObjectTorrent'] = function(evt) {
	
	AWS.S3.getObjectTorrent({
			'BucketName' : 'test100312_1',
			'ObjectName' : 'KS_nav_views.png'
			},
			function(data, response) {
				alert('Success: '+ JSON.stringify(response));
				Ti.API.info(JSON.stringify(response));
	
	  	},  function(message,error) {
				alert('Error: '+ JSON.stringify(error));
				Ti.API.info(JSON.stringify(error));
	
		});
	
};


windowFunctions['putObjectCopy'] = function(evt) {
	
	AWS.S3.putObjectCopy({
			'BucketName' : 'test100312_1',
			'ObjectName' : 'sample.png',
			'CopySource' : 'https://s3.amazonaws.com/test100312_1/KS_nav_views.png' // Change to file path from where you want to copy the file
			},
			function(data, response) {
				alert('Success: '+ JSON.stringify(response));
				Ti.API.info(JSON.stringify(response));
	
	  	},  function(message,error) {
				alert('Error: '+ JSON.stringify(error));
				Ti.API.info(JSON.stringify(error));
	
		});
	
};

windowFunctions['listMultipartUploads'] = function(evt) {
	
	AWS.S3.listMultipartUploads({
			'BucketName' : 'test100312_1'
			},
			function(data, response) {
				alert('Success: '+ JSON.stringify(response));
				Ti.API.info(JSON.stringify(response));
	
	  	},  function(message,error) {
				alert('Error: '+ JSON.stringify(error));
				Ti.API.info(JSON.stringify(error));
		});
};

var UploadId;

windowFunctions['initiateMultipartUpload'] = function(evt) {
	
	AWS.S3.initiateMultipartUpload({
			'BucketName' : 'test100312_1',
			'ObjectName' : 'KS_nav_views.png'
			},
			function(data, response) {
				UploadId = response.data.UploadId;
				alert('Success: '+ JSON.stringify(response));
				Ti.API.info(JSON.stringify(response));
	
	  	},  function(message,error) {
				alert('Error: '+ JSON.stringify(error));
				Ti.API.info(JSON.stringify(error));
		});
};


windowFunctions['listParts'] = function(evt) {
	
	AWS.S3.listParts({
			'BucketName' : 'test100312_1',
			'ObjectName' : 'KS_nav_views.png',
			'UploadId' : UploadId
			},
			function(data, response) {
				alert('Success: '+ JSON.stringify(response));
				Ti.API.info(JSON.stringify(response));
	
	  	},  function(message,error) {
				alert('Error: '+ JSON.stringify(error));
				Ti.API.info(JSON.stringify(error));
	
		});
	
};

// This function also calls completeMultipartUpload which completes the multi-part upload to the bucket.

windowFunctions['uploadPart'] = function(evt) {
	
	AWS.S3.initiateMultipartUpload({
			'BucketName' : 'test100312_1',
			'ObjectName' : 'testfile.pdf'
			},
			function(data) {
				
				var UploadId = data.UploadId;
				Ti.API.info('Upload ID: ' + UploadId);
				var f1 = Titanium.Filesystem.getFile(Ti.Filesystem.resourcesDirectory, 'testfile.pdf');
				
				AWS.S3.uploadPart({
							'BucketName' : 'test100312_1',
							'ObjectName' : 'testfile.pdf',
							'File' : f1,
							'UploadId' : UploadId,
							'PartNumber' : '1'
							},
						function(data, response) {
							Ti.API.info('Part uploaded successfully: '+ JSON.stringify(data) + JSON.stringify(response));
							var ETag = response.headers.ETag;
							AWS.S3.completeMultipartUpload({
							'BucketName' : 'test100312_1',
							'ObjectName' : 'testfile.pdf',
							'UploadId' : UploadId,
							'XMLTemplate' : '<CompleteMultipartUpload><Part><PartNumber>1</PartNumber><ETag>' + ETag + '</ETag></Part></CompleteMultipartUpload>'
							},
							function(data, response) {
								alert('MultipartUpload completed successfully: '+ JSON.stringify(data) + JSON.stringify(response));
								Ti.API.info('MultipartUpload completed successfully: '+ JSON.stringify(data) + JSON.stringify(response));
							},  function(message,error) {
								alert('Error: '+ JSON.stringify(error));
								Ti.API.info(JSON.stringify(error));
							});
				  	},  function(message,error) {
							alert('Error: '+ JSON.stringify(error));
							Ti.API.info(JSON.stringify(error));
				
					});
			
	
	  	},  function(message,error) {
			alert('Error: '+ JSON.stringify(error));
			Ti.API.info(JSON.stringify(error));
	
		});
	
};

windowFunctions['uploadPartCopy'] = function(evt) { 
	
	AWS.S3.initiateMultipartUpload({
			'BucketName' : 'test100312_1',
			'ObjectName' : 'sample.png'
		},
		function(data) {
			
			var UploadId = data.UploadId;
			Ti.API.info('Upload ID: ' + UploadId);
			AWS.S3.uploadPartCopy({
						'BucketName' : 'test100312_1',
						'ObjectName' : 'sample.png',
						'CopySource' : '/test100312_1/KS_nav_views.png',
						'UploadId' : UploadId,
						'PartNumber' : '2'
					},
				function(data, response) {
					Ti.API.info('PartCopy uploaded successfully: '+ JSON.stringify(data) + JSON.stringify(response));
					var ETag = data.ETag;
					AWS.S3.completeMultipartUpload({
						'BucketName' : 'test100312_1',
						'ObjectName' : 'sample.png',
						'UploadId' : UploadId,
						'XMLTemplate' : '<CompleteMultipartUpload><Part><PartNumber>2</PartNumber><ETag>' + ETag + '</ETag></Part></CompleteMultipartUpload>'
						},
						function(data, response) {
							alert('MultipartUpload completed successfully: '+ JSON.stringify(data) + JSON.stringify(response));
							Ti.API.info('MultipartUpload completed successfully: '+ JSON.stringify(data) + JSON.stringify(response));
						},  function(message,error) {
							alert('Error: '+ JSON.stringify(error));
							Ti.API.info(JSON.stringify(error));
						});			
		  	},  function(message,error) {
		  		
				alert('Error: '+ JSON.stringify(error));
				Ti.API.info(JSON.stringify(error));
		
			});

  	},  function(message,error) {
		alert('Error: '+ JSON.stringify(error));
		Ti.API.info(JSON.stringify(error));

	});
	
};

windowFunctions['deleteObject'] = function(evt) {
	
	AWS.S3.deleteObject({
			'BucketName' : 'test100312_1',
			'ObjectName' : 'KS_nav_views.png'
			},
			function(data, response) {
				alert('Success: '+ JSON.stringify(response));
				Ti.API.info(JSON.stringify(response));
	
	  	},  function(message,error) {
				alert('Error: '+ JSON.stringify(error));
				Ti.API.info(JSON.stringify(error));
	
		});
	
};

windowFunctions['deleteMultipleObjects'] = function(evt) {
	
	AWS.S3.deleteMultipleObjects({
			'BucketName' : 'test100312_1',
			'XMLTemplate' : '<Delete><Object><Key>KS_nav_views.png</Key></Object><Object><Key>sample.png</Key></Object></Delete>'
			
			},
			function(data, response) {
				alert('Success: '+ JSON.stringify(response));
				Ti.API.info(JSON.stringify(response));
	
	  	},  function(message,error) {
				alert('Error: '+ JSON.stringify(error));
				Ti.API.info(JSON.stringify(error));
	
		});
	
};

// to delete bucket be sure that bucket is empty

windowFunctions['deleteBucket'] = function(evt) {
	
	AWS.S3.deleteBucket({
			'BucketName' : 'test100312_1'
			},
			function(data, response) {
				alert('Success: '+ JSON.stringify(response));
				Ti.API.info(JSON.stringify(response));
	
	  	},  function(message,error) {
				alert('Error: '+ JSON.stringify(error));
				Ti.API.info(JSON.stringify(error));
	
		});
	
};






















