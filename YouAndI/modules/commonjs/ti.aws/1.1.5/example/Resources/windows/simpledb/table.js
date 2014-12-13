Ti.include(
    'simpledbApi.js'
);

windowFunctions['SimpleDb'] = function (evt) {
    var win = createWindow();
    var offset = addBackButton(win);
    var table = Ti.UI.createTableView({
        backgroundColor: '#fff',
        top: offset + u,
        data: createRows([
            'List Domains',
            'createDomain',
            'domainMetadata',
            'getAttributes',           
            'putAttributes',
            'batchPutAttributes',
            'batchDeleteAttributes',
            'deleteAttributes',
            'select',
            'deleteDomain'
        ])
    });
    table.addEventListener('click', handleOpenWindow);
    win.add(table);
    win.open();
};