var localizedStrings = {
"website_title" : ["Radiance @ Smukfest", "Radiance @ Smukfest"],

"cookie_short" : ["flame.vision uses cookies to help count votes. We don't use cookies for marketing or any other tracking reasons. Is that cool with you?", ""],

"cookie_expanded" : ["We assign each visitor a random number and store it in a cookie to keep track of your votes. The random number will expire on September 1, 2017. We may use these identifiers for analytics (such as answering \"how many people voted?\") or to detect cheaters (please don't do this). But we won't use these identifiers for any kind of commercial or marketing purposes. Oh, we also use local storage to record if you accept this cookie. If you don't accept this, please don't use flame.vision", ""],

"cookie_expand_button" : ["More Info", ""],
"cookie_accept_button" : ["Okay", ""],

"loading_placeholder" : ["THIS IS IT", ""],
"loading_placeholder_2" : ["STAND BY", ""],

"not_running_title" : ["🔥 Radiance @ Smukfest 🇩🇰", ""],
"not_running_dates" : ["August 9 – 13", ""],
"not_running_times" : ["21:00 – late", ""],
"not_running_weather_notice" : ["(weather permitting)", ""],

"ardent_alt_text" : ["Ardent Heavy Industries", ""],

"player_name_placeholder" : ["@player1", ""],
"player_ranking_title" : ["How Awesome?", ""]
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

            self.updateDOMSoon();
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

    updateDOMSoon: function() {
        if (this.domCoalescingTimer)
            return;
        var self = this;
        this.domCoalescingTimer = window.setTimeout(function() {
            self.updateDOMNow();
        })
    },

    updateDOMNow: function() {
        if (this.domCoalescingTimer)
            window.clearTimeout(this.domCoalescingTimer);
        this.domCoalescingTimer = undefined;

        if (this.running) {
            this.showContainer("running");
            document.getElementById("currentPlayer").innerText = this.currentPlayer;
        } else
            this.showContainer("not-running");
    },

    showContainer: function(idToShow) {
        var allContainers = document.querySelectorAll(".container");
        var allContainersCount = allContainers.length;
        for (var i = 0; i < allContainersCount; i++) {
            var containerElement = allContainers[i];
            if (containerElement.id === idToShow) {
                containerElement.classList.remove("hidden");
            } else {
                containerElement.classList.add("hidden");
            }
        }
    },
}

var fire = new Fire();
