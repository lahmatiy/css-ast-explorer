var Node = require('basis.ui').Node;

module.exports = require('basis.app').create({
    title: 'CSS AST explorer',

    init: function() {
        return new Node({
            template: resource('./template/layout.tmpl'),
            binding: {
                editor: resource('./editor/index.js'),
                info: resource('./info/index.js')
            }
        });
    }
});
