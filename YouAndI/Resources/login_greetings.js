///////////////////
// Welcome message
var welcome_lbl = Ti.UI.createLabel({
	color:'blue',
  text: Ti.UI.currentWindow.txtmsg,
  textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
  top: 20, left: 60,
  width: 250, height: 40
});
Ti.UI.currentWindow.add(welcome_lbl);