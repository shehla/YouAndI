// this sets the background color of the master UIView (when there are no windows/tab groups on it)
Titanium.UI.setBackgroundColor('#000');

// create tab group
var tabGroup = Titanium.UI.createTabGroup();


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
    url: 'settings.js'
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
