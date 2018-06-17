"use strict";
(function() {
    window.onload = function() {
        reset();
        $("reset").onclick = reset;
    }

    function reset() {
        let ball = gen("div");
        ball.id = "ball";
        ball.classList.add("ball");
    }



    function $(id) {
        return document.getElementById(id);
    }

    function gen(type) {
        return document.createElement(type);
    }

    function qs(type) {
        return document.querySelector(type);
    }

    function qsa(type) {
        return document.querySelectorAll(type);
    }
})();