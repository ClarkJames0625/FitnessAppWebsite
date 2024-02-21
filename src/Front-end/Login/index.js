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
    //new user submission
    createAccountForm.addEventListener("submit", async (e) => {
        //get values of form
        const username = document.getElementById("newUsername").value;
        const email = document.getElementById("email").value;
        const password = document.getElementById("newPassword").value;
        //new user object
        const newUser = {username, password, email};

        try {
            const response = await fetch('/newUser', {
                method: 'POST',
                body: JSON.stringify(newUser),
                headers: {
                    'content-type': 'application/json'
                }
            })

            const json = await response.json();
        } catch (error) {
            console.error("Error importing module:", error);
        }
    })

    //existing user login
    loginForm.addEventListener("submit", async (e) => {
        //get username and password
        const username = document.getElementById("username").value;
        const password = document.getElementById("password").value;

        //user object
        const user = {username, password};

        try {
            const response = await fetch('/login', {
                method: 'POST',
                body: JSON.stringify(user),
                headers: {
                    'content-type': 'application/json'
                }
            })
            .then(response => response.json())
            .then(data => {
                if (data.redirectTo) {
                    window.location.href = data.redirectTo;
                }
                else {
                    console.error('Login failed: ', data.error);
                }
            })
            .catch(error => console.error('Error during login: ', error));

            const json = await response.json();

        } catch (error) {
            console.error("Error importing module:", error);
        }
    });
    

    document.querySelectorAll(".form__input").forEach(inputElement => {
        inputElement.addEventListener("blur", e => {

        });
    });
});