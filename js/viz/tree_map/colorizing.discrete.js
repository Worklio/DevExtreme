function discreteColorizer(options, themeManager, root) {
    var palette = themeManager.createPalette(options.palette, {
        useHighlight: true,
        extensionMode: options.paletteExtensionMode,
    });

    return (options.colorizeGroups ? discreteGroupColorizer : discreteLeafColorizer)(palette, root);
}

function getLeafsCount(root) {
    var allNodes = root.nodes.slice(),
        i,
        ii = allNodes.length,
        count = 0,
        node;

    for(i = 0; i < ii; ++i) {
        node = allNodes[i];
        if(node.isNode()) {
            count = Math.max(count, getLeafsCount(node));
        } else {
            count += 1;
        }
    }

    return count;
}

function discreteLeafColorizer(palette, root) {
    var colors = [],
        count = getLeafsCount(root),
        i;

    for(i = 0; i < count; ++i) {
        colors.push(palette.getNextColor(count));
    }

    return function(node) {
        return colors[node.index];
    };
}

function getNodesCount(root) {
    var allNodes = root.nodes.slice(),
        i,
        ii = allNodes.length,
        count = 0,
        node;

    for(i = 0; i < ii; ++i) {
        node = allNodes[i];
        if(node.isNode()) {
            count += getNodesCount(node) + 1;
        }
    }

    return count;
}

function prepareDiscreteGroupColors(palette, root) {
    var colors = {},
        allNodes = root.nodes.slice(),
        i,
        ii = allNodes.length,
        count = getNodesCount(root),
        node;

    for(i = 0; i < ii; ++i) {
        node = allNodes[i];
        if(node.isNode()) {
            allNodes = allNodes.concat(node.nodes);
            ii = allNodes.length;
        } else if(!colors[node.parent._id]) {
            colors[node.parent._id] = palette.getNextColor(count);
        }
    }
    return colors;
}

function discreteGroupColorizer(palette, root) {
    var colors = prepareDiscreteGroupColors(palette, root);

    return function(node) {
        return colors[node._id];
    };
}

require("./colorizing").addColorizer("discrete", discreteColorizer);
module.exports = discreteColorizer;
