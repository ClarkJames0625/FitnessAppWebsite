async function initializeForm() {
    const urlParams = new URLSearchParams(window.location.search);
    const uID = urlParams.get('uID');
    const daysTillSunday = getDaysLeftInWeekFromSunday();
    const initialDate = '0000-00-00';
    const currentDate = await getCurrentDate();
    const weekStartDate = await getDateFromPlaceInWeek(currentDate, daysTillSunday);
    //calculate place in week
    const placeInWeek = Math.abs(daysTillSunday - 7);
    const totalCalories =  await avgCalories(uID, weekStartDate, currentDate);
    

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
        console.log( uID, weekStartDate, currentDate);
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

    //----------Values to populate
    const weightDifferential = document.getElementById('weightDifferential');
    const offTrack = document.getElementById('offTrack');
    const avgOut = document.getElementById('avgCalsOut');
    //get # of days left in week
    function getDaysLeftInWeekFromSunday() {
        const today = new Date(); // Get the current date
        const currentDay = today.getDay();
    
        // Calculate the number of days left until Sunday (assuming Sunday is the end of the week)
        const daysLeftInWeek = 7 - currentDay;
    
        // Return the number of days left in the week
        return daysLeftInWeek;
    }

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

/*According to doc
~3500 caloric surplus a week is ~1 lb a week gained and the inverse is for weight loss*/