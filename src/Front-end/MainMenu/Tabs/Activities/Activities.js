let totalCalories = 0;
let currentDate = getCurrentDate(); // Set default value to current date
let activityType;
const urlParams = new URLSearchParams(window.location.search);
const uID = urlParams.get('uID');

document.addEventListener("DOMContentLoaded", async () => {
    // Add meal pop up logic
    const addActivity = document.getElementById('addNewActivityButton');
    const span = document.getElementById('close'); // Changed 'var' to 'const'
    const modal = document.getElementById('modal');
    
    // Modal button
    const addActivityModal = document.getElementById('addActivity'); // Corrected typo
    const addToActivityCompleteed = document.getElementById('addToActivitiesEaten');

    //modal open
    // Event listener for clicking "Add Meal" button
    addActivity.addEventListener("click", (e) => {
        modal.style.display = "block";
    });

    span.onclick = function(){
        modal.style.display = "none";
    };

    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    };

    // Add event listener for addMealModal
    addActivityModal.addEventListener("click", async (e) => {
        await addActivitys();
    });

    // Fetch activities from the database
    const fetchActivities = async () => {
        try {
            const response = await fetch('/activities');
            if (response.ok) {
                const activities = await response.json();
                console.log('Fetched activities:', activities); // Log fetched activities
                return activities;
            } else {
                throw new Error('Failed to fetch activities from the server');
            }
        } catch (error) {
            console.error('Error fetching meals:', error);
            return [];
        }
    };

    // Define addMeals function to fetch meals
    const addActivitys = async () => {
        const activityName = document.getElementById('activityName').value;
        const caloriesOut = document.getElementById('ssCalories').value;
        const activityType = document.getElementById('activityTypePopup').value;
        const newActivity = {activityName, caloriesOut, activityType}; // Define the new activity object
    
        try {
            const response = await fetch('/addActivity', {
                method: 'POST',
                body: JSON.stringify(newActivity),
                headers: {
                    'content-type': 'application/json'
                }
            });
            
            if (response.ok) {
                console.log('Successfully Added activity:', newActivity); // Log the new meal object
                modal.style.display = "none";
                window.location.reload();
            }
        } catch (error) {
            console.error("Error adding meal", error);
        }
    };

    const populateActivityDropdown = async () => {
        const activities = await fetchActivities();
        console.log('Populating activities dropdown with:', activities); // Log meals to console

        const activitiesDropdown = {
            'Workout1': document.getElementById('workout1'),
            'Workout2': document.getElementById('workout2'),
            'Misc': document.getElementById('misc')
        };

        // Loop through each dropdown menu and populate meals
        Object.entries(activitiesDropdown).forEach(([dropdown]) => {
            // Clear existing options
            dropdown.innerHTML = '';

            // Add default option
            const defaultOption = document.createElement('option');
            defaultOption.value = '';
            defaultOption.textContent = 'Select a Workout';
            dropdown.appendChild(defaultOption);

            // Add filtered meals to the dropdown
            activities.forEach((activity) => {
                const option = document.createElement('option');
                option.value = activity.activityName; // Set the value to the foodName property
                option.textContent = activity.activityName + ' (' + activity.caloriesOut + ' calories)'; // Display foodName and calories
                dropdown.appendChild(option);
            });
        });
    };

    await populateActivityDropdown();

});


//add all calls from meals populated
function addAllCalories(){
    const workout1Calories = parseInt(document.getElementById('workout1Calories').value) || 0;
    const workout2Calories = parseInt(document.getElementById('workout2Calories').value) || 0;
    const miscCalories = parseInt(document.getElementById('miscWorkoutCalories').value) || 0;

    totalCalories = workout1Calories + workout2Calories + miscCalories;

    return totalCalories;
}

//get todays date and format
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