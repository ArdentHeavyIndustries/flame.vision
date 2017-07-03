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

        console.log(this.priorHues)
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

var API = function() {};

API.prototype = {
    get: function(url, callback) {
        console.log("Invoking API endpoint " + url);
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
    }
}

var api = new API();

var Fire = function() {
    this.running = false;

    this.currentPlayer = undefined;
    this.currentAverageScore = undefined;

    this.domCoalescingTimer = undefined;

    this.loadingContainerElement = document.getElementById("loading");
    this.notRunningContainerElement = document.getElementById("not-running");
    this.runningContainerElement = document.getElementById("running");
};

Fire.prototype = {
    updateStatus: function() {
        var self = this;
        api.get("/status.cgi", function(status) {
            var running = self.stringToBoolean(status["running"]);
            if (running !== undefined)
                self.running = running;

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

        if (this.running)
            this.displayContainer("running");
        else
            this.displayContainer("not-running");
    },

    displayContainer: function(visibleConatinerId) {
        this.updateContainerVisibility(this.loadingContainerElement, visibleConatinerId);
        this.updateContainerVisibility(this.notRunningContainerElement, visibleConatinerId);
        this.updateContainerVisibility(this.runningContainerElement, visibleConatinerId);
    },

    updateContainerVisibility: function(containerElement, visibleContainerId) {
        if (containerElement.id === visibleContainerId)
            containerElement.classList.remove("hidden");
        else
            containerElement.classList.add("hidden");
    }
}

var fire = undefined;

document.addEventListener("DOMContentLoaded", function() {
    var unicorn = new Unicorn();
    unicorn.unicornItUp();

    fire = new Fire();

    window.setInterval(function() {
        fire.updateStatus();
    }, 10 * 1000);
    fire.updateStatus();
}, false);
