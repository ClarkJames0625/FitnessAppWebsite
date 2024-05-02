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

    // Function to get current date in 'YYYY-MM-DD' format
    function getCurrentDate() {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    // Add event listener for addActivityModal
    addActivityModal.addEventListener("click", async (e) => {
        await addActivityFunction();
    });

    // Function to handle adding activity
    async function addActivityFunction() {
        // Add your logic here
        // For example:
        // await addMeals();
    }

    // Add Activities Logic
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
});
