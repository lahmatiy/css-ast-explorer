var Node = require('basis.ui').Node;
var parsed = require('../../../source/index.js').parsed;

module.exports = new Node({
    template: resource('./template/view.tmpl'),
    binding: {
        source: parsed.as(function(parsed) {
            return JSON.stringify(parsed.map.tokens, null, 4);
        })
    }
});
