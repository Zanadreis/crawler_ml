'use strict';
module.exports = function(app) {
    var crawler = require('../controllers/crawlerController');
    // crawler Routes
    app.route('/crawler')
        .get(crawler.listAllLogs)
        .post(crawler.fetchResult);
};