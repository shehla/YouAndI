// this sets the background color of the master UIView (when there are no windows/tab groups on it)
//var AWS = require('aws-sdk');



Ti.App.Properties.setString('back_color','#AFEEEE');
Ti.App.Properties.setString('not_sent_color','#DFEEEE');
Ti.App.Properties.setString('text_color', 'black');
Ti.App.Properties.getString('Num_records', '4');
clear_fields();

Ti.App.global_messages = [];
Ti.App.table_msgs_rows = [];
//alert('user ph->'+ Ti.App.Properties.getString('last_user_msg_timestamp')+' lover ->'+ Ti.App.Properties.getString('last_lover_msg_timestamp'));

Ti.App.Properties.setString('status', 4);
Ti.App.Properties.setString('phone', '2178191112');
Ti.App.Properties.setString('lover_phone', '2178199492');

var AWS = require("ti.aws");
var AWSfile = Ti.Filesystem.getFile('AWS_creds.json');
var data = AWSfile.read().text;
var AWS_json = JSON.parse(data);
AWS.authorize(AWS_json['AWSAccessKeyId'], AWS_json['AWSSecretKey']);
current_window = null;

Titanium.UI.setBackgroundColor('#000');
// create tab group
var tabGroup = Titanium.UI.createTabGroup();
var add_lover_win=null;
function extract_lover_details(lover_ddb)
{
	lover = {'name': lover_ddb['name']['S'],
		'phone': lover_ddb['phone']['S'],
		'status': parseInt(lover_ddb['status']['N'])};
	if (lover_ddb['lover_phone'])
	{
		lover['lover_phone'] = lover_ddb['lover_phone']['S'];
	}	
	return lover;
}
Ti.API.info('Status ---->'+Ti.App.Properties.getString('status'));
if (Ti.App.Properties.getString('status') == 1)
{
	settings_win = 'add_lover.js';
	render_tabs();
	render_app();		
}	
else if(Ti.App.Properties.getString('status') == 2 || Ti.App.Properties.getString('status') == 3)
{	
	fetch_status();		
}
else if(Ti.App.Properties.getString('status') == 4)
{
	final_registration_window('Bingo .. you:'+Ti.App.Properties.getString("phone")+ ' and ->'+Ti.App.Properties.getString("lover_phone")+ ' are in love :D');
}
else
{	
	settings_win = 'basic_registration.js';
	render_tabs();
	render_app();		
}

 
function fetch_status()
{	
	//var params = '{"RequestJSON" : {"RequestItems":{"lovers": {"Keys": [{"HashKeyElement": {"S":"'+phone+'"}}],"AttributesToGet":["phone", "name", "status", "lover_phone"]}}}}';
	if (typeof(Ti.App.Properties.getString('lover_phone')) != 'undefined')
		//var params = '{"RequestJSON" : {"RequestItems":{"lovers": {"Keys": [{"HashKeyElement": {"S":"'+Ti.App.Properties.getString('phone')+'"}}],"AttributesToGet":["phone", "name", "status", "lover_phone"]},"lovers": {"Keys": [{"HashKeyElement": {"S":"'+Ti.App.Properties.getString('lover_phone')+'"}}],"AttributesToGet": ["phone", "name", "status", "lover_phone"]}}}}';
		var params = '{"RequestJSON" : {"RequestItems":{"lovers": {"Keys": [{"HashKeyElement": {"S":"'+Ti.App.Properties.getString('phone')+'"}}, {"HashKeyElement": {"S":"'+Ti.App.Properties.getString('lover_phone')+'"}}],"AttributesToGet":["phone", "name", "status", "lover_phone"]}}}}';
		//var params = '{"RequestJSON" : {"RequestItems":{"lovers": {"Keys": [{"HashKeyElement": {"S":"1112"}}, {"HashKeyElement": {"S":"21d1d"}}],"AttributesToGet":["phone", "name", "status", "lover_phone"]}}}}';
	else
		var params = '{"RequestJSON" : {"RequestItems":{"lovers": {"Keys": [{"HashKeyElement": {"S":"'+Ti.App.Properties.getString('phone')+'"}}],"AttributesToGet":["phone", "name", "status", "lover_phone"]}}}}';
	Ti.API.info('Initial query ->' + params);
	
			
	AWS.DDB.batchGetItem(JSON.parse(params),
			
		function(data, response) {		
		recs = response["data"]["Responses"]["lovers"]["Items"];
		Ti.API.info('Result ->'+JSON.stringify(recs));
		Ti.API.info(' Num recs ->' + recs.length);
		if (recs.length == 1)
		{
			// User didn't mention a lover yet
			//alert('ERROR: not supposed to come here!');
			final_registration_window(Ti.App.Properties.getString("phone")+ ' sent request to ->'+Ti.App.Properties.getString("lover_phone"));				
		}
		else
		{
			// User and lover both exist
			user_details = extract_lover_details(response["data"]["Responses"]["lovers"]["Items"][0]);
			lover_details = extract_lover_details(response["data"]["Responses"]["lovers"]["Items"][1]);
			if (user_details['lover_phone'] == lover_details['phone'])//&& user_details['phone'] == lover_details['lover_phone'])
			{
				//Bingo: They're in love :D
				final_registration_window('Bingo .. you:'+Ti.App.Properties.getString("phone")+ ' and ->'+Ti.App.Properties.getString("lover_phone")+ ' are in love :D');											
			}			
		}								

  	},  function(message,error) {
		alert('Error: '+ JSON.stringify(error));
		Ti.API.info(JSON.stringify(error));

	});			
}

function final_registration_window(custom_msg)
{
	var emptyView = Titanium.UI.createView({});	
	add_lover_win = Ti.UI.createWindow({
		//backgroundColor:Ti.App.Properties.getString('back_color'),
		backgroundImage: 'blue_bg2.jpg', 		
		url: 'login_greetings.js',
		leftNavButton: emptyView
	});			
	custom_label = Ti.UI.createLabel({
		color: Ti.App.Properties.getString('text_color'),
		text: custom_msg,
		font:{fontSize:20,fontFamily:'Helvetica Neue'},
		textAlign:'center',
		width:'auto'
	});	
	add_lover_win.add(custom_label);
	current_window = add_lover_win;
	render_app();		
} 

function clear_fields()
{	
	Ti.App.Properties.setString('last_user_msg_timestamp',2227778696322);	
	Ti.App.Properties.setString('last_lover_msg_timestamp',2227778696322);
	Ti.App.Properties.setString('newest_user_msg_timestamp',0);
	Ti.App.Properties.setString('newest_lover_msg_timestamp',0);
	Ti.App.Properties.setString('controls_rendered','0');
	Ti.App.Properties.removeProperty('name');
	Ti.App.Properties.removeProperty('status');
	Ti.App.Properties.removeProperty('phone');
	Ti.App.Properties.removeProperty('lover_phone');
	Ti.App.Properties.setString('new_messages','0');
}


function render_tabs()
{
	var win2 = Titanium.UI.createWindow({  
	    title:'Settings',
	    //backgroundColor:Ti.App.Properties.getString('back_color'),
	    backgroundImage: 'blue_bg2.jpg',
	    url: settings_win
	});
	current_window = win2;
}

function render_app()
{
	//
	// create base UI tab and root window
	//
	Ti.App.win1 = Titanium.UI.createWindow({  
	    title:'Loves',
	    //backgroundColor:Ti.App.Properties.getString('back_color'),
	    backgroundImage: 'blue_bg2.jpg',
	    url:'love.js'
	});
	var tab1 = Titanium.UI.createTab({  
	    icon:'KS_nav_views.png',
	    title:'Loves',   
	    window:Ti.App.win1
	});
	
	var win3 = Titanium.UI.createWindow({  
	    title:'Emotions',
	    //backgroundColor:Ti.App.Properties.getString('back_color'),
	    backgroundImage: 'blue_bg2.jpg',
	    url:'emotions.js'
	});
	var tab3 = Titanium.UI.createTab({  
	    icon:'KS_nav_views.png',
	    title:'Emotions',   
	    window:win3
	});		
	
	var tab2 = Titanium.UI.createTab({  
	    icon:'KS_nav_ui.png',
	    title:'Settings',
	    window:current_window    
	});
	
	tabGroup.addTab(tab3);
	tabGroup.addTab(tab1);
	tabGroup.addTab(tab2);			
	tabGroup.open(); 	
	tabGroup.addEventListener('focus',function(e){		
	    if(e.index == 1 && Ti.App.Properties.getString('controls_rendered')=='0'){	    	
	    	reload_loves_page();	 
	    }
	});
}
function reload_loves_page()
{
	Ti.App.win1.fireEvent('focus');	    	
	tabGroup.setActiveTab(1);
}

Ti.App.addEventListener('paused',function() {
	Ti.App.Properties.setString('new_messages','1');
	reload_loves_page();
    Ti.API.info("save active tab: " + tabGroup.activeTab);
    Ti.App.Properties.setInt('activeTab',tabGroup.activeTab);
});
//////////////////////////////////////////////////////////////////////////////////////////
var deviceToken = null;
// Check if the device is running iOS 8 or later
if (Ti.Platform.name == "iPhone OS" && parseInt(Ti.Platform.version.split(".")[0]) >= 8) { 	
 // Wait for user settings to be registered before registering for push notifications
    Ti.App.iOS.addEventListener('usernotificationsettings', function registerForPush() {
 
 // Remove event listener once registered for push notifications
        Ti.App.iOS.removeEventListener('usernotificationsettings', registerForPush); 
 		
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
    Ti.App.Properties.setString('new_messages','1');
    Ti.App.win1.fireEvent('focus');
	tabGroup.setActiveTab(1);
}
// Save the device token for subsequent API calls
function deviceTokenSuccess(e) {	
    deviceToken = e.deviceToken;    
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
