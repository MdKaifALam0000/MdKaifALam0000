// const API_KEY = "2abeac93af0b0e293967da362a5ac77a";

// //render karwaa rahe hain UI ke upar
// function renderWeatherinfo(data){
//     let newPara = document.createElement('p');
//     newPara.textContent = `${data?.main?.temp.toFixed(2)}°C`;
//     document.body.appendChild(newPara);
// }

// async function showWeather() {
    
//     try {
//         let city = "delhi";
//         //for calling an API we have to fetch functionm so that the could get connect to the server
//         const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}`);

//         //convert into json format
//         const data = await response.json();
//         console.log("weather data -> ", data);

//         renderWeatherinfo(data);
//     }
//     catch (e) {
//         //handle the error
//     }
// }

// async function getCustomWeatherDetails() {
//     try{
//         let latitude = 15.3333;
//         let longitude = 74.0833
//         //calling an API
//         let result =await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}`);
    
//         const data = await result.json();
//         console.log(data);
//     }
//     catch (e){
//         console.log("error found",e);
//     }
    
// }

const userTab = document.querySelector("[data-userweather]");
const searchTab = document.querySelector("[data-searchWeather]");
const weather = document.querySelector(".weatherContainer");

const grantAccessContainer = document.querySelector(".grant-location-container");
const searchForm = document.querySelector("[data-searchForm]");
const loadingScreen = document.querySelector(".loading-container");
const userInfoContainer = document.querySelector(".user-info-container");

//needed a current tab so that we can know on which tab we are at
let currentTab = userTab;
const API_KEY = "2abeac93af0b0e293967da362a5ac77a";
currentTab.classList.add("current-tab");

//ek kaam which is also required
getfromSessionStorage();

function switchTab(clickedTab){
    if(clickedTab != currentTab){
        currentTab.classList.remove("current-tab");
        currentTab = clickedTab;
        currentTab.classList.add("current-tab");

        if(!searchForm.classList.contains("active")){
            //kya search form waala invisible hain , to usko visible kardo
            userInfoContainer.classList.remove("active");
            grantAccessContainer.classList.remove("active");
            searchForm.classList.add("active");
        }
        else{
            //main pehle search waale tab par tha ab your weather tab visibile karna padega
            userInfoContainer.classList.remove("active");
            searchForm.classList.remove("active");
            
            //now i'm in your weather tab , then we have to display your Weather,so let's check local storage first
            //for coordinates if we have saved them there
            getfromSessionStorage();
        }
    }
}

//jis bhi tab ke upar click karunga voh waala tab khul jaana chahiye
userTab.addEventListener("click" ,() =>{
    //passing the clicked tab as input parameter
    switchTab(userTab);
});

searchTab.addEventListener("click" ,() =>{
    //passing the clicked tab as input parameter
    switchTab(searchTab);
});

//check if cooridnates are already present in session storage
function getfromSessionStorage(){
    const localCoordinates = sessionStorage.getItem("user-coordinates");
    if(!localCoordinates){
        //agar local coordinate nahi mile
        grantAccessContainer.classList.add("active");
    }
    else{
        const coordinates = JSON.parse(localCoordinates);
        fetchUserWeatherInfo(coordinates);
    }
}

async function fetchUserWeatherInfo(coordinates){
    const {lat , lon}=coordinates;
    //make the grant container invisible 
    grantAccessContainer.classList.remove("active");
    //make loader visible
    loadingScreen.classList.add("active");

    //call API
    try{
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`);

        const data =await response.json();
        
        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");

        //it will take out the data information
        renderWeatherInfo(data);
    }
    catch (err){
        loadingScreen.classList.remove("active");
    }
}

//firstly we have to fetch the element
function renderWeatherInfo(weatherInfo){
    const cityName = document.querySelector("[data-cityName]");
    const countryIcon = document.querySelector("[data-country-icon]");
    const desc = document.querySelector("[data-Weather-Description]");
    const weatherIcon = document.querySelector("[data-Weather-Icon]");
    const temp = document.querySelector("[data-temperature]");
    const windSpeed = document.querySelector("[data-windSpeed]");
    const humidity = document.querySelector("[data-humidity]");
    const cloudiness = document.querySelector("[data-cloudiness]");

    //fetch values from weather info object and put UI input
    console.log(weatherInfo);
    //optional chaining parameter se we can access the perticular property from the json file
    cityName.innerText = weatherInfo?.name;
    countryIcon.src = `https://flagcdn.com//144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;
    desc.innerText = weatherInfo?.weather?.[0]?.description;
    weatherIcon.src = `https://openweathermap.org/img/w/${weatherInfo?.weather?.[0].icon}.png`;
    temp.innerText =`${weatherInfo?.main?.temp} °C`;
    windSpeed.innerText = `${weatherInfo?.wind?.speed} m/s`;
    humidity.innerText = `${weatherInfo?.main?.humidity} %`;
    cloudiness.innerText = `${weatherInfo?.clouds?.all} %`;
}
function getLocation(){
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(showPosition);
    }
    else{
        // alert("No geo location support available");
    }
}

function showPosition(position){
    const userCoordinates ={
        lat: position.coords.latitude,
        lon: position.coords.longitude,
    }

    sessionStorage.getItem("user-coordinates" , JSON.stringify(userCoordinates));
    fetchUserWeatherInfo(userCoordinates);
}
const grantAccessBtn = document.querySelector("[data-grantaccess]");
grantAccessBtn.addEventListener("click",getLocation);

let searchInput = document.querySelector("[data-searchInput]");
searchForm.addEventListener("submit",(e)=>{
    e.preventDefault();
    let cityname = searchInput.value;
    if(cityname ==="") 
        return;
    else
    fetchSearchWeatherInfo(cityname);
});

async function fetchSearchWeatherInfo(city){
    loadingScreen.classList.add("active");
    userInfoContainer.classList.remove("active");
    grantAccessContainer.classList.remove("active");

    try{
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);
        const data = await response.json();
        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");
        renderWeatherInfo(data);
    }
    catch (err){
    }
}