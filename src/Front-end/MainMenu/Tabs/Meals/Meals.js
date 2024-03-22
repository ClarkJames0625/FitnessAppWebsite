const loginPage = "http://localhost:5500";

function addCalories(){
    // Create function to add all values from calories input group and display inside HTML for total calories
}

document.addEventListener("DOMContentLoaded", async () => {
    // TAB LINKS
    const ProfileLink = document.getElementById('userProfile');
    const signOut = document.getElementById('signOut');
    const homeLink = document.getElementById('homeLink');
    const settingsLink = document.getElementById('settingsLink');
    // Add meal pop up logic
    const addMeal = document.getElementById('addNewMealButton');
    var span = document.getElementById('close');
    var modal = document.getElementById('modal');
    // USERID for query strings
    const urlParams = new URLSearchParams(window.location.search);
    const uID = urlParams.get('uID');
    // Modal button
    const addMealModal = document.getElementById('addMeal'); // Corrected typo
    const addToMealsEaten = document.getElementById('addToMealsEaten');

// Add event listener for addMealModal
addMealModal.addEventListener("click", async (e) => {

    await addMeals();
});


    // Tab Navigation
    ProfileLink.addEventListener('click', (e) => {
        e.preventDefault();
        // ProfileLink logic to get ID of user logged in and pass to userProfile
        const profileURL = `/MainMenu/Tabs/UserProfile/Profile.html?uID=${uID}`; // Put path in config file, don't hardcode in final project
        window.location.href = profileURL;
    })

    signOut.addEventListener('click', (e) => {
        e.preventDefault();
        // Send back to login page w/o query string
        window.location.href = loginPage;
    })

    homeLink.addEventListener('click', (e) => {
        e.preventDefault();
        // HomeLink logic to retain userID
        const homeLink = `/MainMenu/MainMenu.html?uID=${uID}`;
        window.location.href = homeLink;
    })

    settingsLink.addEventListener('click', (e) => {
        e.preventDefault();
        // Fill in the rest of the logic once a valid profile page is set up
    })

    // Add Meals Logic
    addMeal.onclick = function(){
        modal.style.display = "block";
    }

    span.onclick = function(){
        modal.style.display = "none";
    }

    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }

    // Populate meals

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

    // Define addMeals function to fetch meals
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
                option.textContent = meal.foodName + ' (' + meal.caloriesIn + ' calories)'; // Display foodName and calories
                dropdown.appendChild(option);
            });
        });
    };

    // Call the function to populate meals into dropdown menus
    await populateMealsDropdown();

    //add to meals eaten via submit button
    addToMealsEaten.addEventListener("click", (e) => {
        if ('Breakfast' !== null || 'Lunch' !== null || 'Dinner' !== null || 'Snack' !== null){
            
        }
    })
});
