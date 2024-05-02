let totalCalories = 0;
let currentDate = '0000-00-00'; // Default value should be changed
let mealType;
const urlParams = new URLSearchParams(window.location.search);
const uID = urlParams.get('uID');

function addCalories(){
    // Create function to add all values from calories input group and display inside HTML for total calories
}

document.addEventListener("DOMContentLoaded", async () => {
    // Add meal pop up logic
    const addActivity = document.getElementById('addNewActivityButton');
    const span = document.getElementById('close'); // Changed 'var' to 'const'
    const modal = document.getElementById('modal');
    
    // Modal button
    const addActivityModal = document.getElementById('addActivity'); // Corrected typo
    const addToActivityEaten = document.getElementById('addToActivitiesEaten');

    // Add event listener for addMealModal
    addActivityModal.addEventListener("click", async (e) => {
        await addMeals();
    });

    // Add Meals Logic
    addActivity.onclick = function(){
        modal.style.display = "block";
    };

    span.onclick = function(){
        modal.style.display = "none";
    };

    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    };

    // Populate meals
    const populateMealsDropdown = async () => {
        const meals = await fetchMeals();
        console.log('Populating meals dropdown with:', meals); // Log meals to console

        const mealDropdowns = {
            'Breakfast': document.getElementById('breakfast'),
            'Lunch': document.getElementById('lunch'),
            'Dinner': document.getElementById('dinner'),
            'Snack': document.getElementById('snack')
        };

        // Loop through each dropdown menu and populate meals
        Object.entries(mealDropdowns).forEach(([mealType, dropdown]) => {
            // Clear existing options
            dropdown.innerHTML = '';

            // Add default option
            const defaultOption = document.createElement('option');
            defaultOption.value = '';
            defaultOption.textContent = `Select a ${mealType.toLowerCase()}`;
            dropdown.appendChild(defaultOption);

            // Filter meals by meal type
            const filteredMeals = meals.filter(meal => meal.mealType.toLowerCase() === mealType.toLowerCase());

            // Add filtered meals to the dropdown
            filteredMeals.forEach((meal) => {
                const option = document.createElement('option');
                option.value = meal.foodName; // Set the value to the foodName property
                option.textContent = `${meal.foodName} (${meal.caloriesIn} calories)`; // Display foodName and calories
                dropdown.appendChild(option);
            });
        });
    };

    // Call the function to populate meals into dropdown menus
    await populateMealsDropdown();

    // Populate meal data if there are already meals in the food eaten table for today
    currentDate = getCurrentDate();
    await populateMealData();

    // Function to add all calories
    function addAllCalories(){
        const breakfastCalories = parseInt(document.getElementById('breakfastCalories').value) || 0;
        const lunchCalories = parseInt(document.getElementById('lunchCalories').value) || 0;
        const dinnerCalories = parseInt(document.getElementById('dinnerCalories').value) || 0;
        const snackCalories = parseInt(document.getElementById('snackCalories').value) || 0;

        totalCalories = breakfastCalories + lunchCalories + dinnerCalories + snackCalories;

        return totalCalories;
    }

    // Function to get today's date and format it
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
});

// Fetch meals from the database
const fetchMeals = async () => {
    try {
        const response = await fetch('/meals');
        if (response.ok) {
            const meals = await response.json();
            console.log('Fetched meals:', meals); // Log fetched meals
            return meals;
        } else {
            throw new Error('Failed to fetch meals from the server');
        }
    } catch (error) {
        console.error('Error fetching meals:', error);
        return [];
    }
};

// Function to add meals
const addMeals = async () => {
    const foodName = document.getElementById('foodName').value;
    const caloriesIn = document.getElementById('ssCalories').value;
    const mealType = document.getElementById('mealTypePopup').value;
    const newMeal = {foodName, caloriesIn, mealType}; // Define the new meal object

    try {
        const response = await fetch('/addMeals', {
            method: 'POST',
            body: JSON.stringify(newMeal),
            headers: {
                'content-type': 'application/json'
            }
        });

        if (response.ok) {
            console.log('Successfully Added Meal:', newMeal); // Log the new meal object
            modal.style.display = "none";
            window.location.reload();
        }
    } catch (error) {
        console.error("Error adding meal", error);
    }
};

// Function to populate meal data
const populateMealData = async () => {
    // Make API call to retrieve eaten meals
    console.log(uID, currentDate);
    const response = await fetch('/retrieveEatenMeals', {
        method: 'POST',
        body: JSON.stringify({uID, currentDate}),
        headers: {
            'content-type': 'application/json'
        }
    });

    if (!response.ok) {
        console.error('Error retrieving eaten meals');
        return;
    }
    const mealsData = await response.json();

    // Update meal input fields in the UI
    mealsData.forEach((meal, index) => {
        const mealNameElement = document.getElementById(`todays${meal.mealType}`);
        if (mealNameElement) {
            mealNameElement.value = meal.foodName;

            const caloriesElement = document.getElementById(`${meal.mealType}Calories`);
            if (caloriesElement) {
                caloriesElement.value = meal.calories;
            }
        }
    });

    totalCalories = addAllCalories();
    // Populate calories Total
    document.getElementById('calorieTotal').innerHTML = `${totalCalories} Calories`;
};
