var savedCities = [];
var currentCity;

function Init() {
    savedCities = JSON.parse(localStorage.getItem("weatherCities"));
    var previousSearch;

    if (savedCities) {
        currentCity = savedCities[savedCities.length - 1];
        showPrevious();
        getCurrent(currentCity);
    } else {
        getCurrent("Tucson");
    }

}

function showPrevious() {

    if (savedCities) {
        $("#prevSearches").empty();
        var btns = $("<div>").attr("class", "list-group");
        for (var i = 0; i < savedCities.length; i++) {
            var locBtn = $("<a>").attr("href", "#").attr("id", "loc-btn").text(savedCities[i]);
            if (savedCities[i] == currentCity) {
                locBtn.attr("class", "list-group-item list-group-item-action active");
            } else {
                locBtn.attr("class", "list-group-item list-group-item-action");
            }
            btns.prepend(locBtn);
        }
        $("#prevSearches").append(btns);
    }
}


function getCurrentCity(city) {
    var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&APPID=ebe2b8a78d6c28adbd5523668a5e0c6c";
    $.ajax({
        url: queryURL,
        method: "GET",
        error: function () {
            savedCities.splice(savedCities.indexOf(city), 1);
            localStorage.setItem("weatherCities", JSON.stringify(savedCities));
            initialize();
        }
    }).then(function (response) {
        //create the card
        var currCard = $("<div>").attr("class", "card bg-light");
        $("#earthforecast").append(currCard);

        //add location to card header
        var currCardHead = $("<div>").attr("class", "card-header").text("Current weather for " + response.name);
        currCard.append(currCardHead);

        var cardRow = $("<div>").attr("class", "row no-gutters");
        currCard.append(cardRow);

        //get icon for weather conditions
        var iconURL = "https://openweathermap.org/img/wn/" + response.weather[0].icon + "@2x.png";

        var imgDiv = $("<div>").attr("class", "col-md-4").append($("<img>").attr("src", iconURL).attr("class", "card-img"));
        cardRow.append(imgDiv);

        var textDiv = $("<div>").attr("class", "col-md-8");
        var cardBody = $("<div>").attr("class", "card-body");
        textDiv.append(cardBody);
        //display city name
        cardBody.append($("<h3>").attr("class", "card-title").text(response.name));
        //display last updated
        var currDate = moment(response.dt, "X").format("dddd, MMMM Do YYYY, h:mm a");
        cardBody.append($("<p>").attr("class", "card-text").append($("<small>").attr("class", "text-muted").text("Last updated: " + currDate)));
        //display Temperature
        cardBody.append($("<p>").attr("class", "card-text").html("Temperature: " + response.main.temp + " &#8457;"));
        //display Humidity
        cardBody.append($("<p>").attr("class", "card-text").text("Humidity: " + response.main.humidity + "%"));
        //display Wind Speed
        cardBody.append($("<p>").attr("class", "card-text").text("Wind Speed: " + response.wind.speed + " MPH"));

        //get UV Index
        var uvURL = "https://api.openweathermap.org/data/2.5/uvi?appid=ebe2b8a78d6c28adbd5523668a5e0c6c&lat=" + response.coord.lat + "&lon=" + response.coord.lat;
        $.ajax({
            url: uvURL,
            method: "GET"
        }).then(function (uvResponse) {
            var uvIndex = uvResponse.value;
            var bgColor;
            if (uvIndex <= 3) {
                bgColor = "green";
            }
            else if (uvIndex >= 3 || uvIndex <= 6) {
                bgColor = "yellow";
            }
            else if (uvindex >= 6 || uvindex <= 8) {
                bgColor = "orange";
            }
            else {
                bgColor = "red";
            }
            var uvDisplay = $("<p>").attr("class", "card-text").text("UV Index: ");
            uvDisplay.append($("<span>").attr("class", "uvindex").attr("style", ("background-color:" + bgColor)).text(uvIndex));
            cardBody.append(uvDisplay);

        });

        cardRow.append(textDiv);
        getForecast(response.id);
    });
}






