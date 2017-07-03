var priorHues = new Array();

function randomColor() {
    _randomParagraphColor(false);
}

function randomColorDark() {
    _randomParagraphColor(true);
}

function _randomParagraphColor(isDark) {
    var paragraphs = document.getElementsByTagName("p");
    var i;
    for (i = 0; i < paragraphs.length; i++) {
        var h = randomHSL(isDark);
        paragraphs[i].style.backgroundColor = h;

        paragraphs[i].style.backgroundColor = randomHSL(isDark);
        if (isDark) {
            paragraphs[i].style.color = "grey";
        }
    }

    document.body.style.backgroundColor = randomHSL(isDark);
}

function randomHSL(isDark) {
    var h;
    var isUnique = false;

    while(!isUnique) {
        var i;
        var minRange = 1;
        h = randomHue();
        isUnique = true;

        for (i = 0; i < priorHues.length; i++) {
            if (Math.abs(h - priorHues[i]) < minRange) {
                isUnique = false;
                break;
            }
        }
    }

    priorHues.push(h);

    var s = "75";
    var l = "70";

    if (isDark) {
        s = "20";
        l = "15";
    }

    return "hsl(" + h + ", " + s + "%, " + l + "%)";
}

function randomHue() {
    return Math.floor(Math.random() * (360 + 1));
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
    fire = new Fire();

    window.setInterval(function() {
        fire.updateStatus();
    }, 10 * 1000);
    fire.updateStatus();
}, false);
