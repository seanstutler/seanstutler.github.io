"use strict";
(function() {
    window.onload = function() {
        $("start").onclick = start;
    }

    function start() {
        let all = $("all").value;
        let type = $("type").value;
        let missing = $("missing").value;
        let missingArray = missing.split(" ");
        let output = type + ": ";
        for (let i = 1; i <= all; i++) {
            if (!missingArray.includes(i.toString())) {
                if (i < 10) {
                    output += "00" + i + " ";
                } else if (i < 100) {
                    output += "0" + i + " "
                }
            }
        }
        $("output").value = output;
    }

    function $(id) {
        return document.getElementById(id);
    }
})();