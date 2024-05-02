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
        calculateBMR(uID, userInformation.age, userInformation.sex, userInformation.height, userInformation.weight);
    }

    // Check if uID is available before making the fetch request
    if (uID) {
        try {
            const populateLoginInfo = await fetch(`/getLoginInformation/${uID}`);
            const populateUserInfo = await fetch(`/getUserInformation/${uID}`);
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
        else if (fName != undefined && lName != undefined && userAge != undefined && userSex != undefined && height != undefined && weight != undefined){
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

    //Calculate BMR based off of populated data
    async function calculateBMR(uID, age, sex, weight, height){
       let BMR = 0;
       console.log(age, height, weight, sex)
       const cmHeight = height * 2.54;
        if (sex == 'Male'){
            BMR = 88.362 + (13.397 * weight) + (4.799 * cmHeight) - (5.677 * age);
        } else {
            BMR = 447.593 + (9.247 * weight) + (3.098 * cmHeight) - (4.330 * age) 
        }

        //update BMR
        if (BMR !== null){
            try {
                const response = await fetch(`/updateBMR/${uID}?BMR=${BMR}`, {
                    method: 'GET',
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
        }
    }

    /*Men: BMR = 88.362 + (13.397 x weight in kg) + (4.799 x height in cm) – (5.677 x age in years) 
    Women: BMR = 447.593 + (9.247 x weight in kg) + (3.098 x height in cm) – (4.330 x age in years)*/

document.addEventListener("DOMContentLoaded", initializeForm);
