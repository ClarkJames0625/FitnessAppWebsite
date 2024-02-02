const validLogin = require('../../Back-end/dbConnection/Server/server');

function setFormMessage(formElement, type, message)
{
    const messageElement = formElement.querySelector(".form__message");

    messageElement.textContent = message;

    //dynamic assignmment message
    messageElement.classList.add(`form__message${type}`);
    
}

function setInputError(inputElement, message){
    inputElement.classList.add("form__input--error");
    inputElement.parentElement.querySelector(".form__input-error-message").textContent = message;

}

document.addEventListener("DOMContentLoaded", ()=>{
    const loginForm = document.querySelector("#login");
    const createAccountForm = document.querySelector("#createAccount");
    const forgotPassword = document.querySelector("#forgotPassword");

    document.querySelector("#linkCreateAccount").addEventListener("click", e =>{
        e.preventDefault();
        loginForm.classList.add("form--hidden");
        createAccountForm.classList.remove("form--hidden");
    });

    document.querySelector("#linkLogin").addEventListener("click", e =>{
        e.preventDefault();
        loginForm.classList.remove("form--hidden");
        createAccountForm.classList.add("form--hidden");
    });

    document.querySelector("#linkFPassword").addEventListener("click", e => {
        e.preventDefault();
        forgotPassword.classList.remove("form--hidden");
        loginForm.classList.add("form--hidden");
        createAccountForm.classList.add("form--hidden");
    });
    
    loginForm.addEventListener("submit", async (e) => {
        //get username and password
        const username = document.getElementById("username").value;
        const password = document.getElementById("password").value;

        try {
            validateLogin(username, password);
        } catch (error) {
            console.error("Error importing module:", error);
        }
    });
    

    document.querySelectorAll(".form__input").forEach(inputElement => {
        inputElement.addEventListener("blur", e => {

        });
    });
});