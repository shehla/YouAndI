request_sent_label = Ti.UI.createLabel({
	color: 'pink',
	text: Ti.App.Properties.getString('username')+' your love request is sent ;)',
	font:{fontSize:20,fontFamily:'Helvetica Neue'},
	textAlign:'center',
	width:'auto'
});
Ti.UI.currentWindow.backgroundColor=Ti.App.Properties.getString('back_color');
Ti.UI.currentWindow.add(request_sent_label);
	
