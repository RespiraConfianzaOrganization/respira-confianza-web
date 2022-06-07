export const validateEmail = (email) => {
    const regexp = /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/i;
    return regexp.test(email);
};

export const validateUsername = (username) => {
    const regexp = /^(?=[a-zA-Z0-9_]{8,15}$)(?!.*[_]{2})[^_].*[^_]*$/
    return regexp.test(username)
}

export const validateNumber = (number) => {
    const regexp = /^\d+$/
    return regexp.test(number)
}

export const validateUmbrals = (form, umbrals) => {
    let umbralValue = -1
    for (const umbral of umbrals) {
        if (form[umbral]) {
            if (umbralValue < form[umbral]) {
                umbralValue = form[umbral]
            }
            else {
                return false;
            }
        }
    }
    return true;
}
