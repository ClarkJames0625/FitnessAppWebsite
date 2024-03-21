//Initialize form
async function initializeForm() {
    const urlParams = new URLSearchParams(window.location.search);
    const uID = urlParams.get('uID');

    //autopopulate fields
    async function populateFormFields(loginInformation, userInformation) {
        
    }

    // Check if uID is available before making the fetch request
    if (uID) {
        try {
            //see profile.js for body content
        } catch (error) {
            console.error('Error during fetch:', error);
        }
    }

    //Submit/Update Fitness goal logic
    //see why document.addEventListener("submit", async (e) => {} doesn't work
    const fitnessGoalButton = document.getElementById('fitnessGoalButton');
    fitnessGoalButton.addEventListener("click", async (e) => {
        e.preventDefault();
        //get Values from form
        const dietType = document.getElementById('dietType');
        const dietDuration = document.getElementById('dietDuration');
        const weightGoal = document.getElementById('weightGoal');
    
        const setFittnessGoal = {uID, dietType, dietDuration, weightGoal};
    
        if (dietType !== null && dietDuration !== null && weightGoal !== null) {
            try {
                const response = await fetch('/setFitnessGoal', {
                    method: 'POST',
                    body: JSON.stringify(existingUserInformation),
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
                
                if (response.ok) {
                    // Handle success response
                } else {
                    // Handle error response
                    console.error('Failed to set fitness goal. Status:', response.status);
                }
            } catch (error) {
                console.error('Error importing module:', error);
            }
        }
    })
}






document.addEventListener("DOMContentLoaded", initializeForm);