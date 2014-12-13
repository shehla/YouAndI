Ti.include(
    's3Api.js'
    
);

windowFunctions['S3'] = function (evt) {
    var win = createWindow();
    var offset = addBackButton(win);
    var table = Ti.UI.createTableView({
        backgroundColor: '#fff',
        top: offset + u,
        data: createRows([
        		'putBucket',
        		'headBucket',   
        		'getBucket',	
        		'putBucketPolicy',
        		'putObject',
        		'headObject',
        		'getObject',
        		'getObjectTorrent',
        		'putObjectCopy', 		
        		'listMultipartUploads',
        		'initiateMultipartUpload',
        		'listParts',
        		'uploadPart',
        		'uploadPartCopy',
        		'deleteObject',
        		'deleteMultipleObjects',
        		'deleteBucket'	
        ])	
    });
    table.addEventListener('click', handleOpenWindow);
    win.add(table);
    win.open();
};