// Validation for register/login - not empty , match , valid email address..


module.exports.validateRegisterInput = (
    username,
    password,
    confirmPassword
) => {
    const errors = {};
    if(username.trim() === ''){
        errors.username = 'Username must not be empty';
    }
    if(password === ''){
        errors.password = 'password must not be empty';
    }
    else if(confirmPassword !== password){
        errors.confirmPassword = 'passwords must match';
    }

    return {
        errors,
        valid: Object.keys(errors).length < 1
    }
};

module.exports.validateLoginInput = (username , password) => {

    const errors = {};
    if(username.trim() === ''){
        errors.username = 'Username must not be empty';
    }
    if(password.trim() === ''){
        errors.password = 'Password must not be empty';
    }
    return {
        errors,
        valid: Object.keys(errors).length < 1
    }
}