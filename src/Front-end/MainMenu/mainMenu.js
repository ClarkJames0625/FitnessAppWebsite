const loginPage = "http://localhost:5500";

document.addEventListener("DOMContentLoaded", ()=>{
    //TAB LINKS
    const ProfileLink = document.getElementById('userProfile');
    const signOut = document.getElementById('signOut');
    const homeLink = document.getElementById('homeLink');
    const settingsLink = document.getElementById('settingsLink');
    const addMealButton = document.getElementById('addMealButton');
    const fitnessGoal = document.getElementsById('fitnessGoal');
    //USERID for query strings
    const urlParams = new URLSearchParams(window.location.search);
    const uID = urlParams.get('uID');
    
    
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

    addMealButton.addEventListener('click', (e) => {
        const profileURL = `/MainMenu/Tabs/Meals/Meals.html?uID=${uID}`;
        window.location.href = profileURL;
    })

    fitnessGoal.addEventListener('click', (e) => {
        const profileURL = `/MainMenu/Tabs/Goals/Goals.html?uID=${uID}`;
        window.location.href = profileURL;
    })
});

