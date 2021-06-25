export function validateConfigReferenceSyntax(str) {
    if (str.startsWith("$configure")) {
        const splittedString = str.split("--")
        if (splittedString.length !== 3) {
            return false;
        }

        let references = ['$body', '$header', '$query', '$path']
        if (splittedString[1] === "$request" || splittedString[1] === "$response") {
            for(let i = 0; i < references.length; i ++ ){
                if ((splittedString[2].includes(references[i]))) {
                    return true;
                }
            }
           return false;

        }
        return false;
    }
    return true;
}

export function traverseObj(val, listKey = [], resultObj = {}) {
    console.log("val traverseObj is ")
    console.log(val)

    if (typeof val == 'object') {
        if (Array.isArray(val)) {
            for (let i = 0; i < val.length; i++) {
                if (typeof (val[i]) === 'string') {
                    const validationResult = validateConfigReferenceSyntax(val[i])

                    // if validation is false
                    if (!validationResult) {
                        resultObj[constructArrayOfKeyToString([...listKey, i.toString()])] = val[i]
                    }
                } else if (typeof (val[i]) == 'object' && !Array.isArray(val[i])) {
                    resultObj = traverseObj(val[i],
                        [...listKey, i.toString()], resultObj)
                }
            }

        } else {
            // pure key value object
            for (const [key, value] of Object.entries(val)) {
                console.log(`${key}: ${value}`);
                if (typeof (value) === 'string') {
                    const validationResult = validateConfigReferenceSyntax(value)

                    // if validation is false
                    if (!validationResult) {
                        resultObj[constructArrayOfKeyToString([...listKey, key])] = value
                    }
                } else {
                    resultObj = traverseObj(value, [...listKey, key], resultObj)
                }
            }

        }
    }

    return resultObj
}

export function constructArrayOfKeyToString(listKey) {
    let result = ""
    for (let i = 0; i < listKey.length; i++) {
        if (i > 0) {
            result += "."
        }
        result += listKey[i]
    }
    return result
}


/* https://eslint.org/docs/rules/no-prototype-builtins */
export function isObjectEmpty(obj) {
    for (let key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key))
            return false;
    }
    return true;
}