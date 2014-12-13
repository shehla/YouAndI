Ti.include(
    'ddbApi.js'
);

windowFunctions['DDB'] = function (evt) {
    var win = createWindow();
    var offset = addBackButton(win);
    var table = Ti.UI.createTableView({
        backgroundColor: '#fff',
        top: offset + u,
        data: createRows([
        		'getSessionToken',
        		'createTable', 
        		'listTables', 
        		'putItem', 
        		'updateItem', 
        		'updateTable', 
        		'query', 
        		'deleteItem', 
        		'describeTable', 
        		'deleteTable', 
        		'batchWriteItem', 
        		'batchGetItem', 
        		'scan'
        ])
    });
    table.addEventListener('click', handleOpenWindow);
    win.add(table);
    win.open();
};