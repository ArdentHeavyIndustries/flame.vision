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
        var minRange = 30;
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