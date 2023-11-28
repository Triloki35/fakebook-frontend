export const LoginStart = () => ({
    type : "LOGIN_START"
})
export const LoginSuccess = (user) => ({
    type : "LOGIN_SUCCESS",
    payload : user
})
export const LoginFailure = (error) => ({
    type : "LOGIN_FAILURE",
    payload : error
})
export const UpdateUser = (updatedUser) => ({
    type: "UPDATE_USER",
    payload: updatedUser,
});

