async function initializeForm() {
    const urlParams = new URLSearchParams(window.location.search);
    const uID = urlParams.get('uID');
    const currentDate = getCurrentDate();

    // Function to fetch existing goal data
    async function fetchExistingGoal(uID) {
        try {
            const response = await fetch(`/existingGoal/${uID}`);
            if (response.ok) {
                const data = await response.json();
                return data;
            } else {
                throw new Error('Failed to fetch existing goal data');
            }
        } catch (error) {
            console.error('Error fetching existing goal data:', error);
            return null;
        }
    }

    // Function to fetch current weight
    async function fetchCurrentWeight(uID) {
        try {
            const response = await fetch(`/getCurrentWeight/${uID}`);
            if (response.ok) {
                const weight = await response.json();
                return weight;
            } else {
                throw new Error('Failed to fetch current weight');
            }
        } catch (error) {
            console.error('Error fetching current weight:', error);
            return null;
        }
    }

    async function setFitnessGoal(uID, dietType, dietDuration, currentWeight, weightGoal, formattedStartDate) {
        try {
            const response = await fetch('/setFitnessGoal', {
                method: 'POST',
                body: JSON.stringify({ uID, dietType, dietDuration, currentWeight, weightGoal, formattedStartDate }),
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            if (response.ok) {
                const data = await response.json();
                console.log(data.message); // Log success message
                // Handle success as needed (redirect, display message, etc.)
            } else {
                throw new Error('Failed to set fitness goal');
            }
        } catch (error) {
            console.error('Error setting fitness goal:', error);
            // Handle error as needed
        }
    }

    async function updateFitnessGoal(dietType, dietDuration, weightGoal, formattedStartDate, uID) {
        try {
            const response = await fetch(`/updateGoal/${uID}`, {
                method: 'PUT', // Use PUT for updating existing resource
                body: JSON.stringify({ dietType, dietDuration, weightGoal, formattedStartDate, uID }),
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            if (response.ok) {
                const data = await response.json();
                console.log(data.message); // Log success message
                // Handle success as needed (redirect, display message, etc.)
            } else {
                throw new Error('Failed to update fitness goal');
            }
        } catch (error) {
            console.error('Error updating fitness goal:', error);
            // Handle error as needed
        }
    }

    async function timeRemaining(uID){
        try {
            const response = await fetch(`/timeRemaining/${uID}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            if (response.ok) {
                const data = await response.json();
                console.log('Data from API:', data); // Log the data object
                return data;
            } else {
                throw new Error('Invalid data structure returned from API');
            }
        } catch (error) {
            console.error('Error retrieving time remaining:', error);
            return null;
        }
    }

    

    // Check if uID is available before making the fetch requests
    if (uID) {
        const existingGoalData = await fetchExistingGoal(uID);
        
        if (existingGoalData) {
            // Populate fields with existing goal data
            document.getElementById('dietType').value = existingGoalData.dietType;
            document.getElementById('dietDuration').value = existingGoalData.duration;
            document.getElementById('weightGoal').value = existingGoalData.goalWeight;
        }

        const currentWeight = await fetchCurrentWeight(uID);
        if (currentWeight !== null) {
            // Populate current weight in the form
            document.getElementById('currentWeight').value = currentWeight;
        }

        const daysRemaining = await timeRemaining(uID);
        //display remaining days
        document.getElementById('timeRemaining').value = `${daysRemaining.daysRemaining} Days`;
        //display K/g off weight goal
        document.getElementById('offTrack').value = Math.round(document.getElementById('currentWeight').value - document.getElementById('weightGoal').value) + " Kg left";
        
    }

    const fitnessGoalButton = document.getElementById('fitnessGoalButton');
    fitnessGoalButton.addEventListener("click", async (e) => {
        e.preventDefault();
        // Get values from form
        const dietType = document.getElementById('dietType').value;
        const dietDuration = document.getElementById('dietDuration').value;
        const currentWeight = document.getElementById('currentWeight').value;
        const weightGoal = document.getElementById('weightGoal').value;
        const start_date = getCurrentDate(); // Use getCurrentDate() to get the current date

        // Call function to set or update fitness goal based on conditions
        if (dietDuration !== undefined && weightGoal !== undefined) {
            await updateFitnessGoal(dietType, dietDuration, weightGoal, start_date, uID);
        } else {
            await setFitnessGoal(uID, dietType, dietDuration, currentWeight, weightGoal, start_date);
        }

        window.location.reload();
    });
}

//get current date function
function getCurrentDate() {
    const currentDate = new Date();
    // Extract year, month, and day
    const year = currentDate.getFullYear();
    // Months are zero-based, so add 1
    const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
    const day = currentDate.getDate().toString().padStart(2, '0');
    // Return date in YYYY-MM-DD format
    return `${year}-${month}-${day}`;
}

document.addEventListener("DOMContentLoaded", initializeForm);
