const ID_TOKEN_KEY = 'id_token_single_middleware'

export const getToken = () => {
    return getCookie(ID_TOKEN_KEY)
}

export const saveToken = token => {
    setCookie(token)
}

export const decodeToken = token => {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
}

export const destroyToken = () => {
    document.cookie =
        ID_TOKEN_KEY + '=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'
}

function setCookie(cvalue) {
    let d = new Date()
    d.setTime(d.getTime() + 3 * 24 * 60 * 60 * 1000) // 3 days
    let expires = 'expires=' + d.toUTCString()
    document.cookie = ID_TOKEN_KEY + '=' + cvalue + ';' + expires + ';path=/'
}

function getCookie(cname) {
    const name = cname + '=';
    const decodedCookie = decodeURIComponent(document.cookie);
    const ca = decodedCookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') {
            c = c.substring(1)
        }
        if (c.indexOf(name) === 0) {
            return c.substring(name.length, c.length)
        }
    }
    return ''
}

export default { getToken, saveToken, destroyToken }
