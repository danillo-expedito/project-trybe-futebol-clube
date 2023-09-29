const validPassword = 'secret_admin';
const validEmail = 'admin@admin.com';
const harshedPassword = '$2a$08$xi.Hxk1czAO0nZR..B393u10aED0RQ1N3PAEXQ7HxtLjKPEZBu.PW'
const userBodyWithoutEmail = {
    email: '',
    password: validPassword,
}

const userBodyWithoutPassword = {
    email: validEmail,
    password: '',
}

const userBodyWithInvalidEmail = {
    email: '@admin.com',
    password: validPassword,
}

const userBodyWithInvalidPassword = {
    email: validEmail,
    password: '12345',
}

const validUserBody = {
    email: validEmail,
    password: validPassword,
}

const user = {
    id: 1,
    username: 'Admin',
    role: 'admin',
    email: validEmail,
    password: harshedPassword,
}

export default {
    validPassword,
    validEmail,
    userBodyWithoutEmail,
    userBodyWithoutPassword,
    userBodyWithInvalidEmail,
    userBodyWithInvalidPassword,
    validUserBody,
    user,
}