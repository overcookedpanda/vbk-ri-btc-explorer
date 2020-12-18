const xssModule = require('xss')

const parseCommaSeparated = (param, inner) => {
    var parts = param.split(",");
    if(parts.length === 0) {
        throw new Error("Empty argument")
    }

    return parts.map((el, i) => inner(el, i))
}

const shouldParseInt = (i, base = 10) => {
    const parsed = parseInt(i, base);
    if(isNaN(parsed)) {
        throw new Error("Element " + i + " is not an int with base=" + base)
    }
    return parsed
}

const parseCommaSeparatedInts = (param) => {
    return parseCommaSeparated(param, (el, i) => {
        return shouldParseInt(el)
    });
}

function parseHexString(str) {
    try {
        if(str.length < 2) {
            return shouldParseInt(str, 16)
        }
        while (str.length >= 2) {
            var el = str.substring(0, 2)
            shouldParseInt(el, 16)
            str = str.substring(2, str.length);
        }
        return str;
    } catch(e) {
        throw new Error(`Expected HEX string, got: ${str} (error: ${e})`)
    }
}

const parseCommaSeparatedHexStrings = (param) => {
    return parseCommaSeparated(param, (el, i) => {
        return parseHexString(el)
    })
}

const xss = (s) => {
    return xssModule.filterXSS(s)
}

module.exports = {
    parseCommaSeparated,
    shouldParseInt,
    parseCommaSeparatedInts,
    parseHexString,
    parseCommaSeparatedHexStrings,
    xss
}
