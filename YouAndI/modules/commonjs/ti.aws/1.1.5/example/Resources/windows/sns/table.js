Ti.include(
    'snsApi.js'
);

windowFunctions['SNS'] = function (evt) {
    var win = createWindow();
    var offset = addBackButton(win);
    var table = Ti.UI.createTableView({
        backgroundColor: '#fff',
        top: offset + u,
        data: createRows([
        		'createTopic',
        		'getTopicAttributes',
        		'listTopics',
        		'subscribe',
        		'confirmSubscription',
        		'getSubscriptionAttributes',
        		'listSubscriptions',
        		'listSubscriptionsByTopic',
        		'unsubscribe',
        		'addPermission (SNS)',
        		'removePermission (SNS)',
        		'publish',
        		'deleteTopic'
        		
        ])
    });
    table.addEventListener('click', handleOpenWindow);
    win.add(table);
    win.open();
};