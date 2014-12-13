Ti.include(
    'sesApi.js'
);

windowFunctions['SES'] = function (evt) {
    var win = createWindow();
    var offset = addBackButton(win);
    var table = Ti.UI.createTableView({
        backgroundColor: '#fff',
        top: offset + u,
        data: createRows([
            'listVerifiedEmailAddresses',
            'verifyEmailAddress',
            'getSendQuota',
            'getSendStatistics',
            'sendEmail',
            'sendRawEmail',
            'deleteVerifiedEmailAddress',
        ])
    });
    table.addEventListener('click', handleOpenWindow);
    win.add(table);
    win.open();
};