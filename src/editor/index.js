var Node = require('basis.ui').Node;
var source = require('../source/index.js').source;

module.exports = new Node({
    template: resource('./template/view.tmpl'),
    binding: {
        value: source
    },
    action: {
        input: function(e) {
            source.set(e.target.value);
        }
    }
});
