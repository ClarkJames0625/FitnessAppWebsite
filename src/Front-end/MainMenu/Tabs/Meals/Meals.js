const loginPage = "http://localhost:5500";

function addCalories(){
    //Create function to add all values from calories input group and display inside HTML for total calories
}

document.addEventListener("DOMContentLoaded", ()=>{
    //TAB LINKS
    const ProfileLink = document.getElementById('userProfile');
    const signOut = document.getElementById('signOut');
    const homeLink = document.getElementById('homeLink');
    const settingsLink = document.getElementById('settingsLink');
    const addMeal = document.getElementById('addNewMealButton');
    //USERID for query strings
    const urlParams = new URLSearchParams(window.location.search);
    const uID = urlParams.get('uID');
    
    //Tab Navigation
    ProfileLink.addEventListener('click', (e) =>
    {
        e.preventDefault();
        //priofileLink logic to get ID of user logged in and pass to userProfile
        const profileURL = `/MainMenu/Tabs/UserProfile/Profile.html?uID=${uID}`; //put path in config file don't hardcode in final project
        window.location.href = profileURL;
    })

    signOut.addEventListener('click', (e) => {
        e.preventDefault();
        //send back to login page w/o query string
        window.location.href = loginPage;
    })

    homeLink.addEventListener('click', (e) => {
        e.preventDefault();
        //homeLink logic to retain userID
        const homeLink = `/MainMenu/MainMenu.html?uID=${uID}`;
        window.location.href = homeLink;
    })

    settingsLink.addEventListener('click', (e) => {
        e.preventDefault();
        //fill in the rest of the logic once a valid profile page is set up
    })

    //Add Meals Logic

    //GPT MODAL JS CODE
    addMeal.addEventListener('click', (e) => {
        e.preventDefault();
        const modal = document.getElementById("myModal");
        modal.style.display = "block";
    
        // When the user clicks on <span> (x), close the modal
        const span = modal.querySelector(".close");
        span.onclick = function() {
            modal.style.display = "none";
        };
    
        // When the user clicks anywhere outside of the modal, close it
        window.onclick = function(event) {
            if (event.target == modal) {
                modal.style.display = "none";
            }
        };
    });


});

