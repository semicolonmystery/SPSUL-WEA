const MAX_AGE = 34560000;
const DEFAULT_PATH = "/SPSUL-WEA/projects/3.12.24%20-%20Hangman%20-%20Gallows%20Game";

function getCookie(key) {
    let cookies = decodeURIComponent(document.cookie);
    cookies = cookies.split("; ");
    for (let cookie of cookies) {
        if (cookie.indexOf(key+"=") == 0)
            return cookie.substring(key.length+1);
    }
    return null;
}

function setCookie(key, value, expiresSeconds = MAX_AGE, path = DEFAULT_PATH) {
    document.cookie = key + "=" + value + ";max-age=" + expiresSeconds + ";path=" + path;
}

function checkCookie(key) {
    return getCookie(key) != null;
}

function renewCookie(key, expiresSeconds = MAX_AGE, path = DEFAULT_PATH) {
    setCookie(key, getCookie(key), path, expiresSeconds);
}

function deleteCookie(key, path = DEFAULT_PATH) {
    setCookie(key, null, 0, path);
}
