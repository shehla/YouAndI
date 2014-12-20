// this sets the background color of the master UIView (when there are no windows/tab groups on it)
//clear_fields();
var AWS = require("ti.aws");
var AWSfile = Ti.Filesystem.getFile('AWS_creds.json');
var data = AWSfile.read().text;
var AWS_json = JSON.parse(data);
AWS.authorize(AWS_json['AWSAccessKeyId'], AWS_json['AWSSecretKey']);

Titanium.UI.setBackgroundColor('#000');
// create tab group
var tabGroup = Titanium.UI.createTabGroup();

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
			user_details = extract_lover_details(response["data"]["Responses"]["lovers"]["Items"][0]);		
		}
		else
		{
			// User and lover both exist
			user_details = extract_lover_details(response["data"]["Responses"]["lovers"]["Items"][0]);
			lover_details = extract_lover_details(response["data"]["Responses"]["lovers"]["Items"][1]);
			if (user_details['lover_phone'] == lover_details['phone'])
			{
				//Bingo: They're in love :D
				final_registration_window();
			}
		}

  	},  function(message,error) {
		alert('Error: '+ JSON.stringify(error));
		Ti.API.info(JSON.stringify(error));

	});			
}

function final_registration_window()
{
	var emptyView = Titanium.UI.createView({});	
	add_lover_win = Ti.UI.createWindow({
		backgroundColor:'#fff', 		
		url: 'login_greetings.js',
		leftNavButton: emptyView,
		txtmsg: 'Registration done ;)'
	});		
	//Ti.UI.currentWindow.hide();
	//add_lover_win.show();
	tab2.add(add_lover_win);
	tab2.open(add_lover_win);	
	//Ti.UI.currentTab.window = add_lover_win;
} 

if (Ti.App.Properties.getString('is_logged_in') =='request_sent')
{
	
	settings_win = 'add_lover.js';
}
else if(Ti.App.Properties.getString('is_logged_in') == "true")
{	
	settings_win = 'basic_registration.js';
}
else{
	settings_win = 'basic_registration.js';
}

function clear_fields()
{
	Ti.App.Properties.removeProperty('name');
	Ti.App.Properties.removeProperty('phone');
	Ti.App.Properties.removeProperty('is_logged_in');
	Ti.App.Properties.removeProperty('lover_phone');
}

//
// create base UI tab and root window
//
var win1 = Titanium.UI.createWindow({  
    title:'Loves',
    backgroundColor:'#fff',
    url:'love.js'
});
var tab1 = Titanium.UI.createTab({  
    icon:'KS_nav_views.png',
    title:'Loves',
    window:win1
});

//
// create controls tab and root window
//
var win2 = Titanium.UI.createWindow({  
    title:'Settings',
    backgroundColor:'#fff',
    url: settings_win
});
var tab2 = Titanium.UI.createTab({  
    icon:'KS_nav_ui.png',
    title:'Settings',
    window:win2
});

//
//  add tabs
//
tabGroup.addTab(tab2);
tabGroup.addTab(tab1); 


// open tab group
tabGroup.open();
if (Ti.App.Properties.getString('phone') != null)
	fetch_status(); 

