const loginPage = "http://localhost:5500";

document.addEventListener("DOMContentLoaded", ()=>{
    //TAB LINKS
    const ProfileLink = document.getElementById('userProfile');
    const urlParams = new URLSearchParams(window.location.search);
    const uID = urlParams.get('uID');
    const signOut = document.getElementById('signOut');
    
    ProfileLink.addEventListener('click', (e) =>
    {
        e.preventDefault();
        //priofileLink logic to get ID of user logged in and pass to userProfile
        const profileURL = `/MainMenu/Tabs/UserProfile/Profile.html?uID=${uID}` //put path in config file don't hardcode in final project
        window.location.href = profileURL;
    })

    signOut.addEventListener('click', (e) => {
        e.preventDefault();
        //send back to login page w/o query string
        window.location.href = loginPage;
    })

    


});