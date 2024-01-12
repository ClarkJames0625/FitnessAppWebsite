// import { createConnection } from 'mysql2';
// // create a new MySQL connection
// const connection = createConnection({
//   host: 'localhost',
//   user: 'bedevire\james',
//   password: 'clar9600',
//   database: 'database_name'
// });
// connect to the MySQL database
// connection.connect((error) => {
//   if (error) {
//     console.error('Error connecting to MySQL database:', error);
//   } else {
//     console.log('Connected to MySQL database!');
//   }
// });
// // close the MySQL connection
// connection.end();

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

async function validateLogin(username, password){
    try{
        //create connection
        const pool = new ConnectionPool(config);
        await pool.connect();

        //DB query
        const result = await pool.request().query('Select * FROM dbo.users where Username = @username AND Password = @password');

        //check valid creds
        if(result.recordset.length > 0)
        {
            console.log('Login successful');
        }
        else{
            console.log('Invalid username or password');
        }

        //close connection
        await pool.close();
    } 
    catch(err){
        console.log('Error:', err.message);
    }
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

   

    loginForm.addEventListener("submit", e =>{
        //get username and password once user clicks submit
       const username = document.getElementById("username").value;
       const password = document.getElementById("password").value;
        e.preventDefault();

        //validate login
        validateLogin(username, password);

    });

    document.querySelectorAll(".form__input").forEach(inputElement => {
        inputElement.addEventListener("blur", e => {

        });
    });
});