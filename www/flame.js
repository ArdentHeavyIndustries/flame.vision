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
