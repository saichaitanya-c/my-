// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyCc2CHbWxVlmLtGGF5L5tY_VxOnfuRo5FU",
    authDomain: "test1-3e832.firebaseapp.com",
    databaseURL: "https://test1-3e832-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "test1-3e832",
    storageBucket: "test1-3e832.firebasestorage.app",
    messagingSenderId: "518093938096",
    appId: "1:518093938096:web:c29cb0c1981327777e4a75",
    measurementId: "G-C0X95TBMCL"
  };
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const database = firebase.database();

// Function to Refresh Battery Level
function refreshLevel(batteryValue) {
    if (isNaN(batteryValue) || batteryValue < 1 || batteryValue > 10) {
        console.error("Invalid battery value:", batteryValue);
        return;
    }

    let level = Math.round((batteryValue / 10) * 100); // Convert to percentage
    let fillHeight = Math.round((batteryValue / 10) * 140); // Adjust fill height

    // Update Acid Fill Height Instantly
    document.documentElement.style.setProperty('--acid-height', `${fillHeight}px`);
    document.querySelector(".waves").style.transform = `translateY(calc(-1 * ${fillHeight}px))`;

    // Ensure percentage is a valid number before updating CountUp.js
    let percentageElement = document.getElementById("percentage");
    let currentValue = parseInt(percentageElement.innerText) || 0; // Get current value safely
    percentageElement.innerText = level + "%"; // Set new percentage immediately

    // CountUp.js Animation with valid values
    let countUp = new CountUp("percentage", currentValue, level, 0, 2);
    if (!countUp.error) {
        countUp.start();
    } else {
        console.error("[CountUp] Error:", countUp.error);
    }

    // Hide Charging Icon (Optional)
    document.documentElement.style.setProperty('--display-charging', "none");
}

// Fetch Battery Level from Firebase
function getBatteryLevel() {
    const batteryRef = database.ref("2490315/node1/battery");
    batteryRef.on("value", (snapshot) => {
        if (snapshot.exists()) {
            let batteryLevel = snapshot.val();
            refreshLevel(Number(batteryLevel)); // Ensure batteryLevel is a number
        } else {
            console.warn("No battery data available.");
        }
    });
}

// Start Fetching Data
getBatteryLevel();