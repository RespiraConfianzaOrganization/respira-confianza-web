const validateEmail = (email) => {
    const regexp = /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/i;
    return regexp.test(email);
};

const validateUsername = (username) => {
    const regexp = /^(?=[a-zA-Z0-9_]{8,15}$)(?!.*[_]{2})[^_].*[^_]*$/
    return regexp.test(username)
}

module.exports = {
    validateEmail, validateUsername
};