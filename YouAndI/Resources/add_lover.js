var AWS = require("ti.aws");
var AWSfile = Ti.Filesystem.getFile('AWS_creds.json');
var data = AWSfile.read().text;
var AWS_json = JSON.parse(data);
AWS.authorize(AWS_json['AWSAccessKeyId'], AWS_json['AWSSecretKey']);


/////////////////////
// Lovers number
var lover_phone_lbl = Ti.UI.createLabel({
	color:'blue',
  text: 'Lover\'s #',
  textAlign: Ti.UI.TEXT_ALIGNMENT_LEFT,
  top: 110, left: 10,
  width: 80, height: 40
});
Ti.UI.currentWindow.add(lover_phone_lbl);

var lover_phone_txt = Ti.UI.createTextField({
	borderColor:'black',
	borderStyle:Ti.UI.INPUT_BORDERSTYLE_ROUNDED,
	color: '#336699',
  	top: 110, left: 100,
  	width: 150, height: 40
});
Ti.UI.currentWindow.add(lover_phone_txt);

function check_lover_entered()
{
	return !(lover_phone_txt.value == '');
}

// When:
//		1. Lover existed and sent a request for THIS user earlier
function update_lover_record(lover)
{
	var params = {
				'RequestJSON' : {
					"TableName" : 'lovers',
					"Key" : {
						"HashKeyElement" : {
							"S" : lover['phone']
						},
					},
					"AttributeUpdates" : {
						"lover_phone" : {
							"Value" : {
								"S" : lover['lover_phone']
							},
							"Action" : "PUT"
						},
						"status" : {
							"Value" : {
								"N" : lover['status'].toString()
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
				Ti.API.info(JSON.stringify(response));
	
	  	},  function(message,error) {
				Ti.API.info(JSON.stringify(error));
	
		});	
}

//////////////////////////////////////////////////////////////////////
// Adding register button

var button = Ti.UI.createButton({
	title: 'Request Lover',
	top: 160,	
	width: 100,
	height: 50
});

function get_user_from_global()
{
	return {'name': Ti.App.Properties.getString('name'),
		'phone': Ti.App.Properties.getString('phone')};
	
}

button.addEventListener('click', function(e){				
	// Did user enter name and phone?
	if (check_lover_entered())
	{	
		user_details = get_user_from_global();
		user_details['status'] = '1';
		user_details['lover_phone'] = lover_phone_txt.value;
		msg = 'Welcome aboard :). How about adding your loved one?';
		update_lover_record(user_details);
	}
	else
	{
		alert('Please enter name and phone number to proceed.');
	}		
});
Ti.UI.currentWindow.add(button);

