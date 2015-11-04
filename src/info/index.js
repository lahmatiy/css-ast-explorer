var Node = require('basis.ui').Node;
var Value = require('basis.data').Value;

module.exports = new Node({
    template: resource('./template/layout.tmpl'),
    binding: {
        content: 'satellite:'
    },

    selection: true,
    childClass: {
        template: resource('./template/tab.tmpl'),
        binding: {
            title: 'title'
        }
    },
    childNodes: [
        {
            selected: true,
            title: 'Map',
            content: resource('./viewer/map/index.js')
        },
        {
            title: 'JSON',
            content: resource('./viewer/json/index.js')
        },
        {
            title: 'Tokens',
            content: resource('./viewer/tokens/index.js')
        }
    ],

    satellite: {
        content: Value.query('selection.pick()').as(function(tab) {
            if (tab) {
                return tab.content();
            }
        })
    }
});
