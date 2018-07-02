"use strict";
(function() {
    const G = 9.81;
    const SPEED = 400;
    let timer;
    let xspeed;
    let yspeed;
    const REFRESH = 60;

    window.onload = function() {
        reset();
        $("reset").onclick = reset;
        $("go").onclick = start;
    }

    function start() {
        let angle = $("angle").value;
        xspeed = SPEED * Math.sin(angle);
        yspeed = SPEED * Math.cos(angle);
        timer = setInterval(update, 1 / REFRESH * 1000);
    }

    function update() {
        let ball = $("ball");
        ball.style.left = parseFloat(ball.style.left) + xspeed * (1 / REFRESH) + "px";
        ball.style.top = parseFloat(ball.style.top) - (yspeed - G * 1 / REFRESH) * (1 / REFRESH) + "px";
    }

    function reset() {
<<<<<<< HEAD
        $("container").innerHTML = "";
        clearInterval(timer);
        let ball = gen("div");
        ball.id = "ball";
        ball.classList.add("ball");
        let radius = 20;
        ball.style.left = "0px";
        ball.style.height = radius + "px";
        ball.style.width = radius + "px";
        ball.style.top = parseInt(window.getComputedStyle($("container")).height) - radius - 2 + "px";
=======
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
>>>>>>> c7e2552958e8547ee19edff72960c1236b81db2c
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