async function initializeForm() {
    const urlParams = new URLSearchParams(window.location.search);
    const uID = urlParams.get('uID');
    
    async function fetchBMR(uID) {
        const userInfo = await fetch(`/getUserInformation/${uID}`);
        const data = await userInfo.json();
        return data.BMR;
    }

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

    const existingGoalData = await fetchExistingGoal(uID);
    const goalWeight = existingGoalData.goalWeight;

    //get # of days left in week
    function getDaysLeftInWeekFromSunday() {
        const today = new Date(); // Get the current date
        const currentDay = today.getDay();
    
        // Calculate the number of days left until Sunday (assuming Sunday is the end of the week)
        const daysLeftInWeek = 7 - currentDay;
    
        // Return the number of days left in the week
        return daysLeftInWeek;
    }

    async function calculateWeightChange(uID, goalWeight) {
        const avgCalsIn = parseFloat(document.getElementById('avgCalsIn').value.split(' ')[0]); // Get avg calories in
        const avgCalsOut = parseFloat(document.getElementById('avgCalsOut').value.split(' ')[0]); // Get avg calories out
        const BMR = await fetchBMR(uID); // Get BMR

        // Calculate net calories
        const netCals = (avgCalsIn - avgCalsOut) / 3500;

        // Calculate caloric balance
        const caloricBalance = netCals - BMR;

        // Output weight differential
        const weightDiff = (caloricBalance / 3500).toFixed(2); // Calculate weight difference
        document.getElementById('weightDifferential').value = weightDiff + ' Kg weight difference';

        const currentWeight = await fetchCurrentWeight(uID);
        if (!isNaN(currentWeight) && !isNaN(weightDiff)) {
            const offTrackValue = ((parseFloat(currentWeight) + parseFloat(weightDiff)) - goalWeight).toFixed(2);
            document.getElementById('offTrack').value = offTrackValue + ' Kg from goal';
        } else {
            console.error('Error: currentWeight or weightDiff is NaN');
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
    
    const daysTillSunday = getDaysLeftInWeekFromSunday();
    const currentDate = await getCurrentDate();
    const weekStartDate = await getDateFromPlaceInWeek(currentDate, daysTillSunday);
    
    //calculate place in week
    const placeInWeek = Math.abs(daysTillSunday - 7);
    const totalCalories = await avgCalories(uID, weekStartDate, currentDate);
    const totalCaloriesOut = await avgCaloriesOut(uID, weekStartDate, currentDate);

    document.getElementById('timeRemaining').value = daysTillSunday + ' Days Left!';
    
    async function getDateFromPlaceInWeek(currentDate, placeInWeek) {
        // Convert currentDate string to Date object
        const date = new Date(currentDate);
        
        // Calculate the new date by subtracting placeInWeek days
        date.setDate(date.getDate() - placeInWeek);
        
        // Return the new date
        return date.toISOString().split('T')[0]; // Return date in YYYY-MM-DD format
    }

    async function avgCalories(uID, weekStartDate, currentDate) {
        try {
            const response = await fetch(`/weeklyAvgCalories/${uID}?weekStartDate=${weekStartDate}&currentDate=${currentDate}`, {
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
            
    if (totalCalories != null){
        document.getElementById('avgCalsIn').value = (totalCalories.results[0].total_calories / placeInWeek) + ' Calories Per. Day';
    }

    async function avgCaloriesOut(uID, weekStartDate, currentDate) {
        try {
            const response = await fetch(`/weeklyAvgCaloriesOut/${uID}?weekStartDate=${weekStartDate}&currentDate=${currentDate}`, {
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

    if(totalCaloriesOut !== null){
        document.getElementById('avgCalsOut').value = (totalCaloriesOut.results[0].total_calories / placeInWeek) + ' Calories Per. Day';
    }

    await calculateWeightChange(uID, goalWeight);

    //get current date function
    async function getCurrentDate() {
        const currentDate = new Date();
        // Extract year, month, and day
        const year = currentDate.getFullYear();
        // Months are zero-based, so add 1
        const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
        const day = currentDate.getDate().toString().padStart(2, '0');
        // Return date in YYYY-MM-DD format
        return `${year}-${month}-${day}`;
    }
}

document.addEventListener("DOMContentLoaded", initializeForm);
