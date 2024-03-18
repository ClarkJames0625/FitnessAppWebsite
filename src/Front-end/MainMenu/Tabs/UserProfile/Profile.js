const infoButton = document.getElementById('infoButton');

 // toggle password visibility
 function togglePasswordVisibility() {
    const passwordInput = document.getElementById("Password");
    const toggleButton = document.getElementById("togglePassword");

    if (passwordInput.type === "password") {
        passwordInput.type = "text";
        toggleButton.textContent = "Hide Password";
    } else {
        passwordInput.type = "password";
        toggleButton.textContent = "Show Password";
    }
}

async function initializeForm() {
    const urlParams = new URLSearchParams(window.location.search);
    const uID = urlParams.get('uID');

    //autopopulate fields
    async function populateFormFields(loginInformation, userInformation) {
        document.getElementById("Username").value = loginInformation.username;
        document.getElementById("Password").value = loginInformation.password;
        document.getElementById("Email").value = loginInformation.email;
        document.getElementById("fName").value = userInformation.fName;
        document.getElementById("lName").value = userInformation.lName;
        document.getElementById("age").value = userInformation.age;
        document.getElementById("sex").value = userInformation.sex;
        document.getElementById("height").value = userInformation.height;
        document.getElementById("weight").value = userInformation.weight;
    }

    // Check if uID is available before making the fetch request
    if (uID) {
        try {
            const populateUserInfo = await fetch(`/getUserInformation/${uID}`);
            const populateLoginInfo = await fetch(`/getLoginInformation/${uID}`);

            //populate login info
            if (populateLoginInfo.ok) {
                const loginInformation = await populateLoginInfo.json();
                
                //populate user info after fetching login info
                if (populateUserInfo.ok) {
                    const userInformation = await populateUserInfo.json();
                    populateFormFields(loginInformation, userInformation);

                    //toggle password shown or hidden
                    const toggleButton = document.getElementById("togglePassword");
                    toggleButton.addEventListener("click", togglePasswordVisibility);
                } else {
                    console.error('Failed to fetch user information:', populateUserInfo.statusText);
                }
            } else {
                console.error('Error during fetch:', populateLoginInfo.statusText);
            }

        } catch (error) {
            console.error('Error during fetch:', error);
        }
    }


    //--------------------------RESOLVE ERROR------------------------------
    document.addEventListener("submit", async (e) => {
        e.preventDefault();
        //get values of form
        const fName = document.getElementById("fName").value;
        const lName = document.getElementById("lName").value;
        const userAge = document.getElementById("age").value;
        const userSex = document.getElementById("sex").value;
        const height = document.getElementById("height").value;
        const weight = document.getElementById("weight").value;
        //userInformationObject
        const existingUserInformation = { fName, lName, userAge, userSex, height, weight, uID };
        const newUserInformation = { uID, fName, lName, userAge, userSex, height, weight };


        if (fName != null && lName != null && userAge != null && userSex != null && height != null && weight != null) {

            try {
                const response = await fetch('/updateUserInformation', {
                    method: 'POST',
                    body: JSON.stringify(existingUserInformation),
                    headers: {
                        'content-type': 'application/json'
                    }
                });
                
                if (response.ok) {
                    
                }
            } catch (error) {
                console.error("Error importing module:", error);
            }
        }
        else {
            try {
                const response = await fetch('/enterUserInformation', {
                    method: 'POST',
                    body: JSON.stringify(newUserInformation),
                    headers: {
                        'content-type': 'application/json'
                    }
                });
                if (response.ok) {
                }
            } catch (error) {
                console.error("Error importing module:", error);
            }
        }
    });
}

document.addEventListener("DOMContentLoaded", initializeForm);
