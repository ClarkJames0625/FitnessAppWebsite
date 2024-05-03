async function initializeForm() {
    const urlParams = new URLSearchParams(window.location.search);
    const uID = urlParams.get('uID');
    const currentDate = getCurrentDate();

    async function fetchBMR(uID) {
        const userInfo = await fetch(`/getUserInformation/${uID}`);
        const data = await userInfo.json();
        return data.BMR;
    }

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
            const response = await fetch(`/geturrentWeight/${uID}`);
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

    async function timeRemaining(uID) {
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

    async function avgCalories(uID, startDate) {
        try {
            const response = await fetch(`/avgCalories/${uID}?startDate=${startDate}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            if (response.ok) {
                const data = await response.json();
                console.log(data)
                return data;
            } else {
                throw new Error('Invalid data structure returned from API');
            }
        } catch (error) {
            console.error('Error retrieving avgCalories:', error);
            return null;
        }
    }

    async function avgCalsOut(uID, startDate) {
        try {
            const response = await fetch(`/avgCaloriesOut/${uID}?startDate=${startDate}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            if (response.ok) {
                const data = await response.json();
                return data;
            } else {
                throw new Error('Invalid data structure returned from API');
            }
        } catch (error) {
            console.error('Error retrieving avgCalories:', error);
            return null;
        }
    }

    async function calculateWeightChange(uID) {
        const avgCalsIn = parseFloat(document.getElementById('avgCalsIn').value.split(' ')[0]); // Get avg calories in
        const avgCalsOut = parseFloat(document.getElementById('avgCalsOut').value.split(' ')[0]); // Get avg calories out
        const BMR = await fetchBMR(uID); // Get BMR

        // Calculate net calories
        const netCals = (avgCalsIn - avgCalsOut) / 3500;

        // Calculate caloric balance
        const caloricBalance = netCals - BMR;

        // Output weight differential
        document.getElementById('weightDifferential').value = (caloricBalance / 3500).toFixed(2) + ' Kg weight difference';
    }

    // Check if uID is available before making the fetch requests
    if (uID) {
        const existingGoalData = await fetchExistingGoal(uID);

        if (existingGoalData) {
            // Populate fields with existing goal data
            document.getElementById('dietType').value = existingGoalData.dietType;
            document.getElementById('dietDuration').value = existingGoalData.duration + ' Weeks';
            document.getElementById('weightGoal').value = existingGoalData.goalWeight;
        }

        const currentWeight = await fetchCurrentWeight(uID);
        if (currentWeight !== null) {
            // Populate current weight in the form
            document.getElementById('currentWeight').value = currentWeight;
        }

        const daysRemaining = await timeRemaining(uID);
        if (daysRemaining !== null) {
            // Format start date selected from table
            const startDate = new Date(daysRemaining.startDate);
            const dateFormatCalories = await formatDate(startDate); //returns the day diet started in YYYY-MM-DD

            // Display remaining days
            document.getElementById('timeRemaining').value = `${daysRemaining.daysRemaining} Days`;

            // Display K/g off weight goal
            document.getElementById('offTrack').value = Math.round(document.getElementById('currentWeight').value - document.getElementById('weightGoal').value) + " Kg left";

            // Get current date
            const currentDate = getCurrentDate();

            // Calculate difference in days between start date and current date
            const differenceInDays = Math.ceil((new Date(currentDate) - new Date(dateFormatCalories)) / (1000 * 60 * 60 * 24));

            // Display avg calories
            const avgCals = await avgCalories(uID, dateFormatCalories);
            if (avgCals !== null) {
                // Display avg calories consumed per day
                if (differenceInDays == 0) {
                    document.getElementById('avgCalsIn').value = avgCals.results[0].total_calories + ' Calories Per. Day';
                } else {
                    document.getElementById('avgCalsIn').value = (avgCals.results[0].total_calories / differenceInDays).toFixed(2) + ' Calories Per. Day';
                }

            }

            const avgCalsOutData = await avgCalsOut(uID, dateFormatCalories);
            if (avgCalsOutData !== null) {
                //display avg calories expended per day
                if (differenceInDays == 0) {
                    document.getElementById('avgCalsOut').value = avgCalsOutData.results[0].total_calories + ' Calories Per. Day';
                } else {
                    document.getElementById('avgCalsOut').value = (avgCalsOutData.results[0].total_calories / differenceInDays).toFixed(2) + ' Calories Per. Day';
                }

                await calculateWeightChange(uID);
            }
        }
    }

    const fitnessGoalButton = document.getElementById('fitnessGoalButton');
    fitnessGoalButton.addEventListener("click", async(e) => {
        e.preventDefault();
        // Get values from form
        const dietType = document.getElementById('dietType').value;
        const dietDurationInput = document.getElementById('dietDuration').value;
        const dietDuration = parseInt(dietDurationInput.replace(' Weeks', '')); // Remove ' Weeks' and parse to integer
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

    async function formatDate(startDate) {
        const year = startDate.getFullYear();
        // Months are zero-based, so add 1
        const month = (startDate.getMonth() + 1).toString().padStart(2, '0');
        const day = startDate.getDate().toString().padStart(2, '0');
        // Return date in YYYY-MM-DD format
        return `${year}-${month}-${day}`;
    }
}

document.addEventListener("DOMContentLoaded", initializeForm);
