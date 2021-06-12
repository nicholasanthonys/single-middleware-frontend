export function validateConfigReferenceSyntax(str) {
    if (str.startsWith("$configure")) {
        const splittedString = str.split("--")
        if (splittedString.length !== 3) {
            return false;
        }

        if (splittedString[1] !== "$request" || splittedString[1] !== "$response") {
            return false
        }
    }
    return true;
}

/**
 *https://stackoverflow.com/questions/15690706/recursively-looping-through-an-object-to-build-a-property-list
 * function to traverse key and value of object/array
 */
function propertiesToArray(obj) {
    const isObject = val =>
        typeof val === 'object' && !Array.isArray(val);

    const addDelimiter = (a, b) =>
        a ? `${a}.${b}` : b;

    const paths = (obj = {}, head = '') => {
        return Object.entries(obj)
            .reduce((product, [key, value]) => {
                console.log("key " + key + " value is : " + value)
                // validate value
                if(validateConfigReferenceSyntax(value)){

                }
                let fullPath = addDelimiter(head, key)
                return isObject(value) ?
                    product.concat(paths(value, fullPath))
                    : product.concat(fullPath)
            }, []);
    }

    return paths(obj);
}