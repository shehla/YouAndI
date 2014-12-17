// this sets the background color of the master UIView (when there are no windows/tab groups on it)
clear_fields();
Titanium.UI.setBackgroundColor('#000');
// create tab group
var tabGroup = Titanium.UI.createTabGroup();

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
