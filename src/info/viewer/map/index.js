var Node = require('basis.ui').Node;
var Value = require('basis.data').Value;
var Balloon = require('basis.ui.popup').Balloon;
var parsed = require('../../../source/index.js').parsed;
var colorByType = {
    stylesheet: 'green',
    ruleset: 'red',
    selector: 'magenta',
    block: 'yellow',
    declaration: 'blue',
    atrule: 'cyan',
    comment: 'gray'
};

function build(root, map) {
    function getToken(idx) {
        return String(map.tokens[idx])
            .replace(/\n|\r\n?|\f/g, '<span class="symbols">↵</span>$&');
    }

    function walk(node) {
        var result = '<span class="node node-' + node.type + '" type="' + node.type + '" event-mouseenter="enter" event-mouseleave="leave">';

        switch (node.type) {
            case 'stylesheet':
            case 'block':
                var cursor = node.content;
                while (cursor) {
                    result += walk(cursor);
                    cursor = cursor.next;
                }
            break;

            case 'atrule':
                var offset = node.start;

                for (var i = 0; i < node.paramsLength + 1; i++) {
                    if (i === 1) {
                        result += '<span class="node node-atrule-params" type="node-atrule-params" event-mouseenter="enter" event-mouseleave="leave">';
                    }

                    result += getToken(node.start + i);
                    offset++;
                }

                if (node.paramsLength) {
                    result += '</span>';
                }

                if (node.block) {
                    result += getToken(offset);
                    offset++;

                    result += walk(node.block);
                    offset += node.block.length;
                }

                for (var i = offset; i < node.start + node.length; i++) {
                    result += getToken(i);
                }
            break;

            case 'ruleset':
                var offset = node.start;

                result += walk(node.selector);
                offset += node.selector.length;

                if (node.block) {
                    result += getToken(offset);
                    offset++;

                    result += walk(node.block);
                    offset += node.block.length;
                }

                for (var i = offset; i < node.start + node.length; i++) {
                    result += getToken(i);
                }
            break;

            default:
                for (var i = node.start; i < node.start + node.length; i++) {
                    result += getToken(i);
                }
        };

        return result + '</span>';
    }

    return walk(root);
}

var hoverTimer;
var hoverNode = new Value({
    handler: {
        change: function(sender, oldNode) {
            var node = this.value;

            if (node) {
                node.classList.add('hover');
            }

            if (oldNode) {
                oldNode.classList.remove('hover');
            }
        }
    }
});
var hoverInfo = new Balloon({
    template: resource('./template/popup.tmpl'),
    dir: 'left top left bottom',
    binding: {
        path: hoverNode.as(function(node) {
            var result = [];
            var cursor = node;

            if (cursor) {
                while (cursor = cursor.parentNode) {
                    var type = cursor.getAttribute('type');

                    if (!type) {
                        break;
                    }

                    result.unshift(type);
                }
            }

            return result.join(' > ');
        }),
        type: hoverNode.as(function(node) {
            return node ? node.getAttribute('type') : '';
        })
    }
});

hoverNode.link(hoverInfo, function(node) {
    if (node) {
        this.show(node);
    } else {
        this.hide();
    }
});

module.exports = new Node({
    template: resource('./template/view.tmpl'),
    binding: {
        source: parsed.as(function(parsed) {
            return build(parsed.ast, parsed.map);
        })
    },
    action: {
        enter: function(e) {
            clearTimeout(hoverTimer);
            hoverNode.set(e.target);
        },
        leave: function(e) {
            clearTimeout(hoverTimer);

            if (e.toElement && e.toElement.getAttribute('event-mouseenter') === 'enter') {
                hoverNode.set(e.toElement);
            } else {
                hoverTimer = setTimeout(function() {
                    hoverNode.set();
                }, 50);
            }
        }
    }
});
