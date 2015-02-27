Ti.include('notifications.js');
Ti.include();
var AWS = require("ti.aws");
var AWSfile = Ti.Filesystem.getFile('AWS_creds.json');
var data = AWSfile.read().text;
var AWS_json = JSON.parse(data);
AWS.authorize(AWS_json['AWSAccessKeyId'], AWS_json['AWSSecretKey']);

var loveBtn;
var missingBtn;
var sadBtn;
var madBtn;

createButtons();
function createButtons()
{
	loveBtn = Ti.UI.createButton({
		title: 'Love you',
		font: {fontSize:40, fontColor:'black', fontFamily:'Verdana', fontWeight:'bold'},
		color:'white',
		backgroundColor:'#FF83FA',
		top: 0,
		bubbleParent: false,
		left: '0%',	
		width: '100%',		
		height: '25%'
	});
	loveBtn.addEventListener('click', function(e){				
		send_notification(1, 'love ya');		
		var milliseconds = (new Date).getTime();				
		add_emotion(milliseconds, 1);
	});	
	Ti.UI.currentWindow.add(loveBtn);

	missingBtn = Ti.UI.createButton({
		title: 'Missing you',
		font: {fontSize:40, fontColor:'black', fontFamily:'Verdana', fontWeight:'bold'},
		color:'white',
		backgroundColor:'#8A2BE2',
		top: '25%',
		bubbleParent: false,
		left: 0,	
		width: '100%',
		height: '25%'
	});
	missingBtn.addEventListener('click', function(e){
		send_notification(2, 'missing you');				
		var milliseconds = (new Date).getTime();					
		add_emotion(milliseconds, 2);
	});	
	Ti.UI.currentWindow.add(missingBtn);
	
	sorryBtn = Ti.UI.createButton({
		title: 'I am Sorry',
		font: {fontSize:40, fontColor:'black', fontFamily:'Verdana', fontWeight:'bold'},
		color:'white',
		backgroundColor:'#6495ED',
		top: '50%',
		bubbleParent: false,
		left: 0,	
		width: '100%',
		height: '25%'
	});
	sorryBtn.addEventListener('click', function(e){
		send_notification(3, 'so sorry');				
		var milliseconds = (new Date).getTime();				
		add_emotion(milliseconds, 3);
	});		
	Ti.UI.currentWindow.add(sorryBtn);
	
	madBtn = Ti.UI.createButton({
		title: 'Mad at you',
		font: {fontSize:40, fontColor:'black', fontFamily:'Verdana', fontWeight:'bold'},
		color:'white',
		backgroundColor:'#388E8E',
		top: '75%',
		bubbleParent: false,
		left: 0,	
		width: '100%',
		height: '25%'
	});
	madBtn.addEventListener('click', function(e){
		send_notification(4, "so mad at you");				
		var milliseconds = (new Date).getTime();				
		add_emotion(milliseconds, 4);
	});		
	Ti.UI.currentWindow.add(madBtn);			
} 

function add_emotion(milliseconds, emotion_type)
{
	cur_time = milliseconds.toString();
	var params = {
			'RequestJSON' : {
				"TableName" : 'messages',
				"Item" : {
					"from" : { "S" : Ti.App.Properties.getString('phone')}, //Required					
					'to' : { 'S' : Ti.App.Properties.getString('lover_phone')},
					'timestamp': { 'N' : cur_time},
					'emotion': {'N': emotion_type.toString()}						
				}
			} //Required
		};
		
			
	Ti.API.info('add_message: '+JSON.stringify(params));
	
	
		
		AWS.DDB.putItem(params,
			
		function(data, response) {
		Ti.API.info(JSON.stringify(response));
		this_msgs = eval(Ti.App.global_messages);		
		
		this_msgs.push({'from': Ti.App.Properties.getString('phone'),
			'to': Ti.App.Properties.getString('lover_phone'),
			'emotion': emotion_type,
			'from_me': true,
			'timestamp': cur_time
		});
		//alert(JSON.stringify(Ti.App.global_messages[Ti.App.global_messages.length-1]));
		
		Ti.App.global_messages = this_msgs;
		disable_Btn(emotion_type);
  	},  function(message,error) {
		alert('Error: '+ JSON.stringify(error));
		Ti.API.info(JSON.stringify(error));

	});	
}

function disable_Btn(emotion)
{	
	if(emotion==1)
	{
		loveBtn.enabled = false;
		loveBtn.title = 'Love sent..';
		setTimeout(function() {
			loveBtn.enabled = true;
			loveBtn.title = 'Send love';
		}, 5000);		
	}
	else if(emotion==2)
	{
		missingBtn.enabled = false;
		missingBtn.title = 'Its good to tell';
		setTimeout(function() {
			missingBtn.enabled = true;
			missingBtn.title = 'Missing you';
		}, 5000);		
	}
	else if(emotion==3)
	{
		sorryBtn.enabled = false;
		sorryBtn.title = 'Aww, cute';
		setTimeout(function() {
			sorryBtn.enabled = true;
			sorryBtn.title = 'I am sorry';
		}, 5000);		
	}
	else if(emotion==4)
	{
		madBtn.enabled = false;
		madBtn.title = 'It\'ll get better';
		setTimeout(function() {
			madBtn.enabled = true;
			madBtn.title = 'Mad at you';
		}, 5000);		
	}
	else
	{
		alert('ERROR: in disabling button');
	}
}

//////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////
/*
var deviceToken = null;
// Check if the device is running iOS 8 or later
if (Ti.Platform.name == "iPhone OS" && parseInt(Ti.Platform.version.split(".")[0]) >= 8) { 	
 // Wait for user settings to be registered before registering for push notifications
    Ti.App.iOS.addEventListener('usernotificationsettings', function registerForPush() {
 
 // Remove event listener once registered for push notifications
        Ti.App.iOS.removeEventListener('usernotificationsettings', registerForPush); 
 		alert('Sending req to APNS');
        Ti.Network.registerForPushNotifications({
            success: deviceTokenSuccess,
            error: deviceTokenError,
            callback: receivePush
        });
    });
 
 // Register notification types to use
    Ti.App.iOS.registerUserNotificationSettings({
	    types: [
            Ti.App.iOS.USER_NOTIFICATION_TYPE_ALERT,
            Ti.App.iOS.USER_NOTIFICATION_TYPE_SOUND,
            Ti.App.iOS.USER_NOTIFICATION_TYPE_BADGE
        ]
    });
}
 
// For iOS 7 and earlier
else {
    Ti.Network.registerForPushNotifications({
 // Specifies which notifications to receive
        types: [
            Ti.Network.NOTIFICATION_TYPE_BADGE,
            Ti.Network.NOTIFICATION_TYPE_ALERT,
            Ti.Network.NOTIFICATION_TYPE_SOUND
        ],
        success: deviceTokenSuccess,
        error: deviceTokenError,
        callback: receivePush
    });
}
// Process incoming push notifications
function receivePush(e) {
    alert('Received push: ' + JSON.stringify(e));
}
// Save the device token for subsequent API calls
function deviceTokenSuccess(e) {	
    deviceToken = e.deviceToken;
    alert('Rad .. push ->'+deviceToken);
    Ti.API.info('dev ->'+deviceToken);
}
function deviceTokenError(e) {
    alert('Failed to register for push notifications! ' + e.error);
}
//////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////

// You first need to get a device token (see previous section):

// Require the Cloud module
var Cloud = require("ti.cloud");
function subscribeToChannel () {
 // Subscribes the device to the 'news_alerts' channel
 // Specify the push type as either 'android' for Android or 'ios' for iOS
 	alert('Dev tok->'+deviceToken);
    Cloud.PushNotifications.subscribeToken({
        device_token: deviceToken,
        channel: 'news_alerts',
        //type: Ti.Platform.name == 'android' ? 'android' : 'ios'
        type: 'ios'
    }, function (e) {
 if (e.success) {
            alert('Subscribed');
        } else {
            alert('Error: here\n' + ((e.error && e.message) || JSON.stringify(e)));
        }
    });
}
function unsubscribeToChannel () {
 // Unsubscribes the device from the 'test' channel
    Cloud.PushNotifications.unsubscribeToken({
        device_token: deviceToken,
        channel: 'news_alerts',
    }, function (e) {
 if (e.success) {
            alert('Unsubscribed');
        } else {
            alert('Error:\n' + ((e.error && e.message) || JSON.stringify(e)));
        }
    });
}
 

var subscribe = Ti.UI.createButton({title:'Subscribe',top:100});
subscribe.addEventListener('click', subscribeToChannel);
Ti.UI.currentWindow.add(subscribe);
var unsubscribe = Ti.UI.createButton({title:'Unsubscribe', top:300});
unsubscribe.addEventListener('click', unsubscribeToChannel);
Ti.UI.currentWindow.add(unsubscribe);
*/
//win.open();