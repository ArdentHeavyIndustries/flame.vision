var localizedStrings = {
  "cookie_accept_button": [
    "Okay",
    "OK"
  ],
  "cookie_expand_button": [
    "More Info",
    "Mere info"
  ],
  "cookie_expanded": [
    "We assign each visitor a random number and store it in a cookie to keep track of your votes. The random number will expire on September 1, 2017. We may use these identifiers for analytics (such as answering \"how many people voted?\") or to detect cheaters (please don't do this). But we won't use these identifiers for any kind of commercial or marketing purposes. Oh, we also use local storage to record if you accept this cookie. If you don't accept this, please don't use flame.vision",
    "Vi tildeler hver besøgende et tilfældigt nummer og gemmer det i en cookie for at kunne holde styr på dine afgivne stemmer. det tilfældige nummer vil udløbe den 1. september 2017. Vi kan bruge denne identifikation til analyse (såsom at få svar på: \"hvor mange personer har stemt?\") eller for at opdage snyd (please, lad vær at snyde). Men vi bruger ikke denne identifikation til nogen former for kommercielt eller markedsførings øjemed. Nå ja, vi anvender også lokal datalagring for at registrere, hvis du accepterer denne cookie. Hvis ikke du accepterer dette, så brug venligst ikke flame.vision"
  ],
  "cookie_short": [
    "flame.vision uses cookies to help count votes. We don't use cookies for marketing or any other tracking reasons. Is that cool with you?",
    "flame.vision anvender alene cookies for at kunne tælle point. Vi bruger ikke cookies til nogen form for markedsføring elle andre formål. Er det cool med dig?"
  ],
  "loading_placeholder": [
    "STAND BY",
    "standby"
  ],
  "not_running_dates": [
    "August 9 – 13",
    "9.-13. august"
  ],
  "not_running_times": [
    "21:00 – late",
    "21.00 - sent"
  ],
  "not_running_title": [
    "Radiance @ Smukfest",
    "Radiance @ Smukfest"
  ],
  "not_running_weather_notice": [
    "(weather permitting)",
    "Hvis vejret tillader det"
  ],
  "player_name_title": [
    "Currently Playing",
    "Spiller nu"
  ],
  "player_name_no_player": [
    "No Player",
    "Ingen spilelr"
  ],
  "vote_title": [
    "Vote",
    "Stem"
  ],
  "website_title": [
    "Radiance @ Smukfest",
    "Radiance @ Smukfest"
  ]
};

Element.prototype.remove = function() {
    var parent = this.parentElement;
    parent.removeChild(this);
}

var API = function() {};

API.prototype = {
    get: function(url, callback) {
        var request = new XMLHttpRequest();
        request.responseType = "json";
        request.addEventListener("load", function() {
            if (request.status !== 200) {
                console.error("Request to " + url + " failed with status " + request.status);
            } else {
                callback(request.response);
            }
        });
        request.open("GET", url, true);
        request.send();

        return request;
    },
}

var api = new API();

var LocalizedStringManager = function() {
    this.languageIndex = undefined; // Index into the localizedStrings object.

    var savedLangaugePreference = window.localStorage.getItem("preferredLanguage");
    if (savedLangaugePreference === "0") {
        this.languageIndex = 0;
    } else if (savedLangaugePreference === "1") {
        this.languageIndex = 1;
    }

    if (this.languageIndex === undefined) {
        var navigatorLanguage = navigator.languageIndex;
        if (navigatorLanguage && navigatorLanguage.indexOf("nl") !== -1) { // I have no idea if this is cool.
            this.languageIndex = 1;
        } else {
            this.languageIndex = 0;
        }
    }
}

LocalizedStringManager.prototype = {
    localizedStringForKey: function(key) {
        var stringArray = localizedStrings[key];
        if (!stringArray) {
            return key;
        }

        if (stringArray.length < this.languageIndex) {
            return key;
        }

        var localizedString = stringArray[this.languageIndex];
        if (localizedString.length == 0) {
            return key;
        }

        return localizedString;
    },

    setLanguage: function(languageIndex) {
        this.languageIndex = languageIndex;
        window.localStorage.setItem("preferredLanguage", languageIndex.toString());
    },
};

localizedStringManager = new LocalizedStringManager();

var Unicorn = function() {
    this.priorHues = new Array();
};

Unicorn.prototype = {
    unicornUpThatBody: function() {
        document.body.style.backgroundColor = this.nextUnicornHSLString();
    },

    nextUnicornHSLString: function(isDark) {
        var h;
        var isUnique = false;

        if (this.priorHues.length >= 5) {
            this.priorHues = new Array();
        }

        while(!isUnique) {
            var i;
            var minRange = 30;
            h = this._randomHue();
            isUnique = true;

            for (i = 0; i < this.priorHues.length; i++) {
                if (Math.abs(h - this.priorHues[i]) < minRange) {
                    isUnique = false;
                    break;
                }
            }
        }

        this.priorHues.push(h);

        var s = "75";
        var l = "70";

        if (isDark) {
            s = "20";
            l = "15";
        }

        return "hsl(" + h + ", " + s + "%, " + l + "%)";
    },

    _randomHue: function() {
        return Math.floor(Math.random() * (360 + 1));
    },
}

var unicorn = new Unicorn();

var Fire = function() {
    this.running = undefined;

    this.currentPlayer = undefined;
    this.currentAverageScore = undefined;

    this.statusRequest = undefined;
    this.statusNextUpdateTimer = undefined;
    this.statusTimeoutTimer = undefined;

    this.domUpdateTimer = undefined;
};

Fire.prototype = {
    pollStatus: function() {
        var self = this;

        if (this.statusRequest) {
            return;
        }

        this.clearStatusTimeoutTimer();

        this.statusRequest == api.get("/status.cgi", function(status) {
            self.clearStatusTimeoutTimer();
            self.statusRequest = undefined;

            self.statusCallback(status);

            window.setTimeout(function() {
                self.pollStatus();
            }, 10 * 1000);
        });

        this.statusTimeoutTimer = window.setTimeout(function() {
            self.statusRequest.abort();
            self.statusRequest = undefined;
            self.pollStatus();
        }, 30 * 1000);
    },

    clearStatusTimeoutTimer: function() {
        if (this.statusTimeoutTimer) {
            window.clearTimeout(this.statusTimeoutTimer);
            this.statusTimeoutTimer = undefined;
        }
    },

    statusCallback: function(status) {
        var reloadScreen = false;

        var running = this.stringToBoolean(status["running"]);
        if (running === undefined)
            running = false;

        var currentPlayer = status["currentplayer"];
        if (typeof(currentPlayer) === "string" && this.currentPlayer !== currentPlayer) {
            this.currentPlayer = currentPlayer;
            reloadScreen = true;
        }

        if (this.running !== running) {
            this.running = running;
            reloadScreen = true;
        }

        if (reloadScreen) {
            this.reloadCurrentScreen();
        } else {
            this.updateDOMSoon();
        }
    },

    stringToBoolean: function(string) {
        if (string === "true")
            return true;
        else if (string === "false")
            return false;
        else
            return undefined;
    },

    showLoadingScreen: function() {
        this.removeAllRows();
        this.addRowWithLocalizedStringKey("loading_placeholder");
    },

    reloadCurrentScreen: function(idToShow) {
        this.removeAllRows();
        if (this.running) {
            this.showRunningScreen();
        } else {
            this.showNotRunningScreen();
        }
        this.updateDOMSoon();
    },

    showRunningScreen: function() {
        this.addCookieNoticeRowIfNecessary();

        this.addRowWithLocalizedStringKey("player_name_title");
        this.addCurrentPlayerRow();
        this.addRowWithLocalizedStringKey("vote_title");
        this.addVotingRow();

        this.addArdentLogoRow();
        this.addLanguageSelectionRow();
    },

    showNotRunningScreen: function() {
        this.addCookieNoticeRowIfNecessary();

        this.addRowWithLocalizedStringKey("not_running_title");
        this.addRowWithLocalizedStringKey("not_running_dates");
        this.addRowWithLocalizedStringKey("not_running_times");
        this.addRowWithLocalizedStringKey("not_running_weather_notice");

        this.addArdentLogoRow();
        this.addLanguageSelectionRow();
    },

    removeAllRows: function() {
        var containerElement = document.getElementById("container");
        var parentElement = containerElement.parentElement;

        var newContainerElement = document.createElement("div");
        newContainerElement.id = "container";
        parentElement.replaceChild(newContainerElement, containerElement);
    },

    addRow: function(contents, dataKey, dataValue, id, suppressRandomColor) {
        var rowElement = document.createElement("div");
        rowElement.className = "row";
        if (id) {
            rowElement.id = id;
        }

        if (!suppressRandomColor) {
            rowElement.style.backgroundColor = unicorn.nextUnicornHSLString();
        }

        if (typeof(contents) === "string") {
            rowElement.innerText = contents;
        } else if (typeof(contents) === "object" && Array.isArray(contents)) {
            var itemCount = contents.length;
            // TODO: Should we not assume all items are Elements?
            for (var i = 0; i < itemCount; i++) {
                var childElement = contents[i];
                rowElement.appendChild(childElement);
            }
        } else if (typeof(contents) === "object") {
            rowElement.appendChild(contents);
        }

        if (dataKey && dataValue) {
            rowElement.setAttribute(dataKey, dataValue);
        }

        var containerElement = document.getElementById("container");
        containerElement.appendChild(rowElement);

        this.updateDOMSoon();
    },

    addRowWithLocalizedStringKey: function(key, id) {
        this.addRow(undefined, "data-row-localized-string-key", key, id, false);
    },

    addRowWithFunctionBinding: function(functionName, id) {
        this.addRow(undefined, "data-row-function", functionName, id, false);
    },

    addCookieNoticeRowIfNecessary: function() {
        if (window.localStorage.getItem("acceptedCookiePolicy") === "true") {
            return;
        }

        this.addRow(undefined, "data-row-function", "updateCookieNoticeRow", "cookie-notice", true);
    },

    addCurrentPlayerRow: function() {
        this.addRowWithFunctionBinding("updateCurrentPlayerRow");
    },

    addVotingRow: function() {

    },

    addArdentLogoRow: function() {
        var imageElement = document.createElement("img");
        imageElement.src = "ardent.png";
        imageElement.alt = "Ardent Heavy Industries";

        var aElement = document.createElement("a");
        aElement.href = "http://www.ardentheavyindustries.com/";
        aElement.appendChild(imageElement);

        this.addRow(aElement, undefined, undefined, "ardent-logo");
    },

    addLanguageSelectionRow: function() {
        var self = this;

        var englishButton = document.createElement("input");
        englishButton.type = "button";
        englishButton.value = "English";
        englishButton.addEventListener("click", function() {
            localizedStringManager.setLanguage(0);
            self.updateDOMSoon();
        });

        var danishButton = document.createElement("input");
        danishButton.type = "button";
        danishButton.value = "Dansk";
        danishButton.addEventListener("click", function() {
            localizedStringManager.setLanguage(1);
            self.updateDOMSoon();
        });

        this.addRow([englishButton, danishButton]);
    },

    updateDOMSoon: function() {
        if (this.domUpdateTimer) {
            return;
        }

        var self = this;
        this.domUpdateTimer = window.setTimeout(function() {
            self.updateDOMNow();
        }, 0);
    },

    updateDOMNow: function() {
        if (this.domUpdateTimer) {
            window.clearTimeout(this.domUpdateTimer);
            this.domUpdateTimer = undefined;
        }

        var allRows = document.querySelectorAll("#container .row");
        var rowCount = allRows.length;
        for (var i = 0; i < rowCount; i++) {
            var row = allRows[i];

            if (row.hasAttribute("data-row-localized-string-key")) {
                var key = row.getAttribute("data-row-localized-string-key");
                this.updateLocalizedStringRow(row, key);
            } else if (row.hasAttribute("data-row-function")) {
                var functionName = row.getAttribute("data-row-function");
                if (typeof(this[functionName]) != "function") {
                    console.error("Could not find data-row-function " + functionName);
                    continue;
                }

                this[functionName](row);
            }
        }
    },

    updateLocalizedStringRow(rowElement, key) {
        var localizedString = localizedStringManager.localizedStringForKey(key);
        rowElement.innerText = localizedString;
    },

    updateCookieNoticeRow(rowElement) {
        if (rowElement.hasAttribute("data-cookie-notice-configured")) {
            return;
        }

        var descriptionElement = document.createElement("div");
        descriptionElement.innerText = localizedStringManager.localizedStringForKey("cookie_short");
        rowElement.appendChild(descriptionElement);

        var moreDescriptionElement = document.createElement("div");
        moreDescriptionElement.innerText = localizedStringManager.localizedStringForKey("cookie_expanded");
        moreDescriptionElement.className = "hidden";
        rowElement.appendChild(moreDescriptionElement);

        var buttonContainerDivElement = document.createElement("div");

        var moreInfoButton = document.createElement("input");
        moreInfoButton.type = "button";
        moreInfoButton.value = localizedStringManager.localizedStringForKey("cookie_expand_button");
        moreInfoButton.addEventListener("click", function() {
            moreInfoButton.remove();
            moreDescriptionElement.classList.remove("hidden");
        });

        var acceptCookiesButton = document.createElement("input");
        acceptCookiesButton.type = "button";
        acceptCookiesButton.value = localizedStringManager.localizedStringForKey("cookie_accept_button");
        acceptCookiesButton.addEventListener("click", function() {
            document.getElementById("cookie-notice").remove();
            window.localStorage.setItem("acceptedCookiePolicy", "true");
        });

        buttonContainerDivElement.appendChild(moreInfoButton);
        buttonContainerDivElement.appendChild(acceptCookiesButton);
        row.appendChild(buttonContainerDivElement);

        rowElement.setAttribute("data-cookie-notice-configured", "true");
    },

    updateCurrentPlayerRow(rowElement) {
        var currentPlayer = localizedStringManager.localizedStringForKey("player_name_no_player");
        if (this.currentPlayer && this.currentPlayer.length > 0) {
            currentPlayer = this.currentPlayer;
        };

        rowElement.innerText = currentPlayer;
    },
}

var fire = new Fire();
