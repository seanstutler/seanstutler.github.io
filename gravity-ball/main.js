"use strict";
(function() {
    window.onload = function() {
        reset();
        $("reset").onclick = reset;
    }

    function reset() {
        let radius = 20; // the radius for the ball => TODO add a user input for the ball
        $("container").innerHTML = "";
        let ball = gen("div");
        ball.id = "ball";
        ball.classList.add("ball");
        ball.style.height = radius + "px";
        ball.style.width = radius + "px";
        let containerHeight = parseInt(window.getComputedStyle($("container")).height);
        ball.style.top = containerHeight - radius - 2 + "px";
        ball.style.left = "0px";
        $("container").appendChild(ball);
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