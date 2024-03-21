//Initialize form
async function initializeForm() {
    const urlParams = new URLSearchParams(window.location.search);
    const uID = urlParams.get('uID');

    //autopopulate current weight
    async function populateFormFields(populateWeight){
        document.getElementById('').value = populateWeight.currentWeight;
    }
    
    // Check if uID is available before making the fetch request
    if (uID) {
        try {
            const populateCurrentWeight = await fetch(`/getCurrentWeight/${uID}`);

            //populate current weight
            if (populateCurrentWeight.ok){
                const weight = await populateCurrentWeight.json();

                populateFormFields(weight);
            } else {
                console.error('Error during fetch current weight:', populateCurrentWeight.statusText);
            }
            
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
        const dietType = document.getElementById('dietType').value;
        const dietDuration = document.getElementById('dietDuration').value;
        const weightGoal = document.getElementById('weightGoal').value;
    
        const setFittnessGoal = {uID, dietType, dietDuration, weightGoal};
    
        if (dietType !== null && dietDuration !== null && weightGoal !== null) {
            try {
                const response = await fetch('/setFitnessGoal', {
                    method: 'POST',
                    body: JSON.stringify(setFittnessGoal),
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