const validateEmail = (email) => {
    const regexp = /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/i;
    return regexp.test(email);
};

const validateUsername = (username) => {
    const regexp = /^(?=[a-zA-Z0-9_]{8,15}$)(?!.*[_]{2})[^_].*[^_]*$/
    return regexp.test(username)
}

const validateNumber = (number) => {
    const regexp = /^\d+$/
    return regexp.test(number)
}

const validateUmbrals = (form, umbrals) => {
    let isValid = true;
    let umbralValue = 0
    umbrals.forEach(umbral => {
        console.log(umbral)
        if (form[umbral]) {
            if (umbralValue < form[umbral]) {
                umbralValue = form[umbral]
            }
            else {
                isValid = false;
            }
        }
    })
    return isValid
}

module.exports = {
    validateEmail, validateUsername, validateNumber, validateUmbrals
};