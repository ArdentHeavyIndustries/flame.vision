var localizedStrings = {
  "cookie_accept_button": [
    "Okay",
    ""
  ],
  "cookie_expand_button": [
    "More Info",
    ""
  ],
  "cookie_expanded": [
    "We assign each visitor a random number and store it in a cookie to keep track of your votes. The random number will expire on September 1, 2017. We may use these identifiers for analytics (such as answering \"how many people voted?\") or to detect cheaters (please don't do this). But we won't use these identifiers for any kind of commercial or marketing purposes. Oh, we also use local storage to record if you accept this cookie. If you don't accept this, please don't use flame.vision",
    ""
  ],
  "cookie_short": [
    "flame.vision uses cookies to help count votes. We don't use cookies for marketing or any other tracking reasons. Is that cool with you?",
    ""
  ],
  "loading_placeholder": [
    "STAND BY",
    ""
  ],
  "not_running_dates": [
    "August 9 – 13",
    ""
  ],
  "not_running_times": [
    "21:00 – late",
    ""
  ],
  "not_running_title": [
    "🔥 Radiance @ Smukfest 🇩🇰",
    ""
  ],
  "not_running_weather_notice": [
    "(weather permitting)",
    ""
  ],
  "player_name_placeholder": [
    "@player1",
    ""
  ],
  "player_ranking_title": [
    "How Awesome?",
    ""
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

var Unicorn = function() {};

Unicorn.prototype = {
    unicornItUp: function() {
        var containerElements = document.querySelectorAll(".container");
        var containerElementCount = containerElements.length;
        for (var i = 0; i < containerElementCount; i++) {
            this._clearPriorHues();
            var containerElement = containerElements[i];
            this._randomizeParagraphColors(containerElement);
        }

        this._clearPriorHues();
        document.body.style.backgroundColor = this._randomHSL(false, new Array());
    },

    _clearPriorHues: function() {
        this.priorHues = new Array();
    },

    _randomizeParagraphColors: function(containerElement) {
        var isDark = false;
        var paragraphs = containerElement.getElementsByTagName("p");

        for (var i = 0; i < paragraphs.length; i++) {
            paragraphs[i].style.backgroundColor = this._randomHSL(isDark);
            if (isDark) {
                paragraphs[i].style.color = "grey";
            }
        }
    },

    _randomHSL: function(isDark) {
        var h;
        var isUnique = false;

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
    this.running = false;

    this.currentPlayer = undefined;
    this.currentAverageScore = undefined;

    this.domCoalescingTimer = undefined;
};

Fire.prototype = {
    updateStatus: function() {
        var self = this;
        api.get("/status.cgi", function(status) {
            var running = self.stringToBoolean(status["running"]);
            if (running !== undefined)
                self.running = running;

            if (typeof(status["currentplayer"]) === "string")
                self.currentPlayer = status["currentplayer"];

            self.reloadCurrentScreen();
        });
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
    },

    showRunningScreen: function() {
        this.addCookieNoticeRowIfNecessary();
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

    addRowWithContents: function(contents, id) {
        var rowElement = document.createElement("div");
        rowElement.className = "row";
        if (id) {
            rowElement.id = id;
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

        var containerElement = document.getElementById("container");
        containerElement.appendChild(rowElement);
    },

    addRowWithLocalizedStringKey: function(key, id) {
        var localizedString = localizedStringManager.localizedStringForKey(key);
        this.addRowWithContents(localizedString, id);
    },

    addCookieNoticeRowIfNecessary: function() {
        if (window.localStorage.getItem("acceptedCookiePolicy") === "true") {
            return;
        }

        var descriptionElement = document.createElement("div");
        descriptionElement.innerText = localizedStringManager.localizedStringForKey("cookie_short");

        var moreDescriptionElement = document.createElement("div");
        moreDescriptionElement.innerText = localizedStringManager.localizedStringForKey("cookie_expanded");
        moreDescriptionElement.className = "hidden";

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

        this.addRowWithContents([descriptionElement, moreDescriptionElement, buttonContainerDivElement], "cookie-notice");
    },

    addArdentLogoRow: function() {
        var imageElement = document.createElement("img");
        imageElement.src = "ardent.png";
        imageElement.alt = "Ardent Heavy Industries";

        var aElement = document.createElement("a");
        aElement.href = "http://www.ardentheavyindustries.com/";
        aElement.appendChild(imageElement);

        this.addRowWithContents(aElement, "ardent-logo");
    },

    addLanguageSelectionRow: function() {
        var self = this;

        var englishButton = document.createElement("input");
        englishButton.type = "button";
        englishButton.value = "English";
        englishButton.addEventListener("click", function() {
            localizedStringManager.setLanguage(0);
            self.reloadCurrentScreen();
        });

        var danishButton = document.createElement("input");
        danishButton.type = "button";
        danishButton.value = "Dansk";
        danishButton.addEventListener("click", function() {
            localizedStringManager.setLanguage(1);
            self.reloadCurrentScreen();
        });

        this.addRowWithContents([englishButton, danishButton]);
    },
}

var fire = new Fire();
