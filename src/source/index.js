var router = require('basis.router');
var base64 = require('basis.utils.base64');
var getSource = require('basis.utils.source').getSource;
var parse = require('../../node_modules/css-parser/lib/index.js');

var routerSource = router.route(/(.*)/).param(0).as(function(value) {
    return value
        ? base64.decode(value, true)
        : require('./css/test.css').cssText;
});

routerSource.attach(function(value) {
    router.navigate(base64.encode(String(value), true));
});

var parsed = routerSource.as(parse);

module.exports = {
    source: routerSource,
    parsed: parsed
};
