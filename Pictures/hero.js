// ===============================
// SOLACE SEARCH BAR JAVASCRIPT
// ===============================

const destination = document.querySelector('input[type="text"]');
const checkIn = document.querySelectorAll('input[type="date"]')[0];
const checkOut = document.querySelectorAll('input[type="date"]')[1];
const guests = document.querySelector("select");
const searchBtn = document.querySelector(".search-btn");

// Set today's date as the minimum check-in date
const today = new Date().toISOString().split("T")[0];
checkIn.min = today;

// Update minimum check-out date
checkIn.addEventListener("change", () => {

    checkOut.min = checkIn.value;

    if (checkOut.value < checkIn.value) {
        checkOut.value = "";
    }

});

// Search button
searchBtn.addEventListener("click", function (e) {

    e.preventDefault();

    const searchData = {

        destination: destination.value.trim(),

        checkIn: checkIn.value,

        checkOut: checkOut.value,

        guests: guests.value

    };

    // Validation

    if (searchData.destination === "") {

        alert("Please enter a destination.");

        destination.focus();

        return;

    }

    if (searchData.checkIn === "") {

        alert("Select a check-in date.");

        return;

    }

    if (searchData.checkOut === "") {

        alert("Select a check-out date.");

        return;

    }

    // Save recent search
    let recentSearches = JSON.parse(localStorage.getItem("recentSearches")) || [];

    recentSearches.unshift(searchData);

    if (recentSearches.length > 5) {

        recentSearches.pop();

    }

    localStorage.setItem("recentSearches", JSON.stringify(recentSearches));

    console.log(searchData);

    // Redirect to search results page
    // Change this to your actual page

    const params = new URLSearchParams({

        destination: searchData.destination,

        checkIn: searchData.checkIn,

        checkOut: searchData.checkOut,

        guests: searchData.guests

    });

    window.location.href = `search.html?${params.toString()}`;

});

// Display recent searches in console
window.addEventListener("load", () => {

    const recentSearches = JSON.parse(localStorage.getItem("recentSearches")) || [];

    console.log("Recent Searches:", recentSearches);

}); 

// =====================================
// GUEST SELECTOR
// =====================================


const guestButton =
document.getElementById("guestButton");
const guestMenu =
document.getElementById("guestMenu");

const adultsCount =
document. getElementById("adultsCount");
const childrenCount =
document. getElementById("childrenCount");
const roomsCount =
document. getElementById("roomsCount");

let adults = 1;
let chidren = 0;
let rooms = 1;


//open / close guest menu

guestButton.addEventListener("click", function(){
    guestMenu.classList.toggle("show");

});


// plus buttons
document.querySelectorAll(".plus").forEach(function(){
    guestMenu.classList.toggle("show");
});
