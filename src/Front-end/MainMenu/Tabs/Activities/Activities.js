let totalCalories = 0;
let activityType;
const urlParams = new URLSearchParams(window.location.search);
const uID = urlParams.get('uID');

document.addEventListener("DOMContentLoaded", async () => {

    let currentDate = getCurrentDate(); // Set default value to current date
    // Add activity pop up logic
    const addActivity = document.getElementById('addNewActivityButton');
    const span = document.getElementById('close');
    const modal = document.getElementById('modal');

    // Modal button
    const addActivityModal = document.getElementById('addActivity');
    const addToActivityCompleted = document.getElementById('addToActivities');

    // Event listener for clicking "Add Activity" button
    addActivity.addEventListener("click", () => {
        modal.style.display = "block";
    });

    span.onclick = function () {
        modal.style.display = "none";
    };

    window.onclick = function (event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    };

    // Add event listener for addActivityModal
    addActivityModal.addEventListener("click", async () => {
        await addActivitys();
    });

    // Fetch activities from the database
    const fetchActivities = async () => {
        try {
            const response = await fetch('/activities');
            if (response.ok) {
                return await response.json();
            } else {
                throw new Error('Failed to fetch activities from the server');
            }
        } catch (error) {
            console.error('Error fetching activities:', error);
            return [];
        }
    };

    // Define addActivities function to add activities
    const addActivitys = async () => {
        const activityName = document.getElementById('activityName').value;
        const caloriesOut = document.getElementById('ssCalories').value;
        const activityType = document.getElementById('activityTypePopup').value;
        const newActivity = { activityName, caloriesOut, activityType };

        try {
            const response = await fetch('/addActivity', {
                method: 'POST',
                body: JSON.stringify(newActivity),
                headers: {
                    'content-type': 'application/json'
                }
            });

            if (response.ok) {
                console.log('Successfully Added activity:', newActivity);
                modal.style.display = "none";
                window.location.reload();
            }
        } catch (error) {
            console.error("Error adding activity", error);
        }
    };

    // Populate activity dropdown menus
const populateActivityDropdown = async () => {
    try {
        const activities = await fetchActivities();
        console.log('Populating activities dropdown with:', activities);
        const activitiesDropdowns = {
            'workoutOne': document.getElementById('workoutOne'),
            'workoutTwo': document.getElementById('workoutTwo'),
            'misc': document.getElementById('misc')
        };

        // Clear dropdowns
        Object.values(activitiesDropdowns).forEach(dropdown => {
            dropdown.innerHTML = '';
        });

        // Populate dropdowns based on activity type
        activities.forEach((activity) => {
            const option = document.createElement('option');
            option.value = activity.activityName;
            option.textContent = `${activity.activityName} (${activity.caloriesOut} calories)`;

            if (activitiesDropdowns.hasOwnProperty(activity.activityType)) {
                activitiesDropdowns[activity.activityType].appendChild(option);
            }
        });
    } catch (error) {
        console.error('Error populating activity dropdowns:', error);
    }
};

await populateActivityDropdown();

// Populate activity data
const populateActivityData = async () => {
    try {
        // Make API call to retrieve completed activities
        const response = await fetch('/retrieveCompletedActivities', {
            method: 'POST',
            body: JSON.stringify({ uID, currentDate }),
            headers: {
                'content-type': 'application/json'
            }
        });

        if (!response.ok) {
            console.error('Error retrieving completed activities');
            return;
        }

        const activitiesData = await response.json();

        // Update activity input fields in the UI
        activitiesData.forEach((activity) => {
            switch (activity.activityType) {
                case 'workoutOne':
                    document.getElementById('tdworkout1').value = activity.activityName;
                    document.getElementById('workout1Calories').value = activity.calories;
                    break;
                case 'workoutTwo':
                    document.getElementById('tdworkout2').value = activity.activityName;
                    document.getElementById('workout2Calories').value = activity.calories;
                    break;
                case 'misc':
                    document.getElementById('tdmisc').value = activity.activityName;
                    document.getElementById('miscWorkoutCalories').value = activity.calories;
                    break;
                default:
                    console.error('Invalid activity type:', activity.activityType);
            }
        });

        // Calculate total calories and update UI
        totalCalories = addAllCalories();
        document.getElementById('calorieTotal').innerHTML = totalCalories + ' Calories';
    } catch (error) {
        console.error('Error populating activity data:', error);
    }
};
    // Call populateActivityData function
    await populateActivityData();

   // Add event listener for adding completed activities
addToActivityCompleted.addEventListener("click", () => {
    const activityTypes = ['workoutOne', 'workoutTwo', 'misc'];
    const activitiesData = [];

    activityTypes.forEach(activityType => {
        const dropdown = document.getElementById(activityType);
        if (dropdown) {
            const selectedOption = dropdown.options[dropdown.selectedIndex];
            if (selectedOption) {
                if (selectedOption.value !== '' && selectedOption.value !== null) {
                    const activityName = selectedOption.value;
                    const caloriesRegex = /\((\d+(\.\d+)?)\s*calories\)/; // Adjusted regex to match decimal numbers
                    const match = caloriesRegex.exec(selectedOption.textContent);
                    if (match && match.length >= 2) {
                        const caloriesOut = parseFloat(match[1]); // Use parseFloat for non-integer values
                        const activityData = { activityName, caloriesOut, activityType };
                        activitiesData.push(activityData);
                    }
                }
            }
        }
    });

    const totalCalories = addAllCalories();
    console.log('Total calories:', totalCalories);

    const activitiesCompleted = { uID, activitiesData, caloriesOut: totalCalories, currentDate, activityType};

    fetch('/addcompletedActivities', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(activitiesCompleted),
    })
    .then(response => {
        if (response.ok) {
            console.log('Activities added successfully!');
            window.location.reload();
        } else {
            console.error('Error adding Activities:', response.status);
        }
    })
    .catch(error => {
        console.error('Error adding Activities:', error);
    });
});

    // Add all calories from activities
    function addAllCalories() {
        const workout1Calories = parseInt(document.getElementById('workout1Calories').value) || 0;
        const workout2Calories = parseInt(document.getElementById('workout2Calories').value) || 0;
        const miscCalories = parseInt(document.getElementById('miscWorkoutCalories').value) || 0;
        return workout1Calories + workout2Calories + miscCalories;
    }

    // Get today's date and format
    function getCurrentDate() {
        const currentDate = new Date();
        const year = currentDate.getFullYear();
        const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
        const day = currentDate.getDate().toString().padStart(2, '0');
        return `${year}-${month}-${day}`;
    }
});
