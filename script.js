const userTab= document.querySelector("[data-userWeather]");
const searchTab= document.querySelector("[data-searchWeather");
const userContainer= document.querySelector(".weather-container");
const grantAccessContainer= document.querySelector(".grant-location-container");
const searchForm= document.querySelector("[data-searchForm]");
const loadingScreen= document.querySelector(".loading-container");
const userInfoContainer= document.querySelector(".user-info-container");

// weather api from here
// https://openweathermap.org/current

let currentTab= userTab;
let API_KEY= "a9efe7b02bb2dc226dc3fc7a9fe2dbad";
currentTab.classList.add("current-tab");

getfromSessionStorage();

// switching tabs
userTab.addEventListener("click",()=>{
    switchTab(userTab); // pass clicked tab as input parameter
});
searchTab.addEventListener("click",()=>{
    switchTab(searchTab);   // pass clciked tab as input parameter
});

function switchTab(clickedTab){
    if (currentTab != clickedTab){
        currentTab.classList.remove("current-tab");
        currentTab= clickedTab;
        currentTab.classList.add("current-tab");
    
        if (!searchForm.classList.contains("active")){
            // kya search form wala container is invisible, if yes then make it visible
            userInfoContainer.classList.remove("active");
            grantAccessContainer.classList.remove("active");
            searchForm.classList.add("active");
        }
        else{
            // main phele search wle tab par tha, ab your weather tabh visible karna hai
            searchForm.classList.remove("active");
            userInfoContainer.classList.remove("active");
            // abh main your weather tab me aagya hu, toh weather bhi display karna padhega, so,
            //let's check local storage first for coordinates, if we have saved them there
            getfromSessionStorage();
        }
    }
}
function getfromSessionStorage(){
    const localCoordinates= sessionStorage.getItem("user-coordinates");
    if (!localCoordinates){
        // agar local coordinates mahi mile
        grantAccessContainer.classList.add("active");
    }
    else{
        const coordinates= JSON.parse(localCoordinates);    // json string ko json object mein convert kar raha hota hai
        fetchUserWeatherInfo(coordinates);
    }
}
async function fetchUserWeatherInfo(coordinates){
    const {lat,lon}= coordinates;
    grantAccessContainer.classList.remove("active");// make grant location container invisible
    loadingScreen.classList.add("active");// add the loader
    // api call
    try{
        const response= await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}`);
        const data= await response.json();
        console.log(data);
        loadingScreen.classList.remove("active");   // remove the loading screen
        userInfoContainer.classList.add("active");
        renderWeatherInfo(data);
    }
    catch(err){
        // handle the error
        loadingScreen.classList.remove("active");
        // bakki kya hoga yaha is hw
    }
}
function renderWeatherInfo(weatherInfo){
    // firstly we have to fetch all the details/elements
    const cityName= document.querySelector("[data-cityName]");
    const countryIcon= document.querySelector("[data-countryIcon]");
    const desc= document.querySelector("[data-weatherDesc]");
    const weatherIcon= document.querySelector("[data-weatherIcon]");
    const temp= document.querySelector("[data-temp]");
    const windspeed= document.querySelector("[data-windspeed]");
    const humidity= document.querySelector("[data-humidity]");
    const cloudiness= document.querySelector("[data-cloudiness]");
    // use json formmater on the above link to know kisme kya data kaha hai taki kaise access karna pata chale
    // https://jsonformatter.curiousconcept.com/#
    cityName.innerText= weatherInfo?.name;
    countryIcon.src= `https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;
    desc.innerText= weatherInfo?.weather?.[0]?.description;   // [0] used kuiki array ke first element pe jna
    weatherIcon.src=  `http://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;
    temp.innerText= `${weatherInfo?.main?.temp} °C`;
    windspeed.innerText= `${weatherInfo?.wind?.speed} m/s`;
    humidity.innerText= `${weatherInfo?.main?.humidity} %`;
    cloudiness.innerText= weatherInfo?.clouds?.all;
}

// grantacecess button pe listerner
const grantAccessButton= document.querySelector("[data-grantAccess]");
grantAccessButton.addEventListener("click",getLocation);
function getLocation(){
    if (navigator.geolocation){
        navigator.geolocation.getCurrentPosition(showPosition); // pass showPosition callback function
    }
    else{
        alert("NO GEOLOCATION SUPPORT");
    }
}
function showPosition(position){
    const userCoordinates={
        lat: position.coords.latitude,
        lon: position.coords.longitude,
    };
    sessionStorage.setItem("user-coordinates",JSON.stringify(userCoordinates));
    fetchUserWeatherInfo(userCoordinates);
}

const searchInput= document.querySelector("[data-searchInput]");
searchForm.addEventListener('submit',(e)=>{
    e.preventDefault();
    let cityName= searchInput.value;
    if (cityName==="")return;
    else{
        fetchSearchWeatherInfo(cityName);
    }
});
async function fetchSearchWeatherInfo(city){
    loadingScreen.classList.add("active");
    userInfoContainer.classList.remove("active");
    grantAccessContainer.classList.remove("active");
    try{
        const response= await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);
        const data= await response.json();
        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");
        console.log(data);
        renderWeatherInfo(data);
    }
    catch(err){
        // handle the error- hw
    }
}