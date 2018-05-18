/**
 * Name: Sean Yang
 * Section: AO
 * Date: 05/15/2018
 * 
 * This is the pokedex.js, the javascript for the website pokedex.html. This 
 * script enables the website to display multiple pokemon sprits in the website
 * When a user selects a found pokemon, the information will be displayed.
 * The user can also use the found pokemon to fight other pokemons using 
 * the moves of the pokemon to attack. When other pokemon is defeated, the
 * user can use them in further fight. 
 */

"use strict";
/* global fetch */
(function() {
    const URL_BASE = "https://webster.cs.washington.edu/pokedex/";
    const POKEMON_FOUND = ["Bulbasaur", "Charmander", "Squirtle"];
    let gameID;
    let playerID;
    let originHP;
    
    /** 
     * When the page is load, get the data about all the pokemons from the
     * server and display them in the page.
     */
    window.onload = function() {
        let url = URL_BASE + "pokedex.php" + "?pokedex=all";
        fetch(url)
            .then(checkStatus)
            .then(displayPokedex)
            .catch(console.log);
    };
    
    /**
     * Display all the pokemons to the web page 
     * param@ {JSON object} response - the data from the server about
     *                                 all the pokemons
     */
    function displayPokedex(response) {
        let pokemons = response.split("\n");
        for (let i = 0; i < pokemons.length; i++) {
            let splitted = pokemons[i].split(":");
            let photoUrl = URL_BASE + "sprites/" + splitted[1];
            let photo = gen("img");
            photo.src = photoUrl;
            photo.id = splitted[0];
            photo.classList.add("sprite");
            if (POKEMON_FOUND.includes(splitted[0])) {
                photo.classList.add("found");
                photo.onclick = showCard;
            }
            $("pokedex-view").appendChild(photo);
        }
    }
    
    /**
     * Start the battle
     * change the apperance of the page to battle mode
     * enable all the buttons of the moves
     * get the data from the server about the game
     * display the information of the opponent on the webpage.
     * update the game when the user makes a move
     * enables the flee button
     * param@ {string} myPokemon - the name of the pokemon of the user
     */
    function startBattle(myPokemon) {
        changeStage(true);
        let buttons = document.querySelectorAll("#my-card button");
        for (let i = 0; i < buttons.length; i++) {
            if (!buttons[i].classList.contains("hidden")) {
                buttons[i].disabled = false;
            }
        }
        let url = URL_BASE + "game.php";
        let data = new FormData();
        data.append("startgame", true);
        data.append("mypokemon", myPokemon);
        fetch(url, {method: "POST", body: data})
            .then(checkStatus)
            .then(JSON.parse)
            .then(function(response) {
                gameID = response["guid"];
                playerID = response["pid"];
                addInformation("#their-card", response["p2"]);
                qs("#my-card .buffs").classList.remove("hidden");
                qs("#their-card .buffs").classList.remove("hidden");
            })
            .catch(console.log);
        let moveButtons = document.querySelectorAll("#my-card .moves button");
        for (let i = 0; i < moveButtons.length; i++) {
            moveButtons[i].onclick = function() {
                let moveName = this.children[0].innerText.replace(" ", "");
                update(moveName);
            }; 
        }
        $("flee-btn").onclick = function() {
            update("flee");
        };
    }
    
    /**
     * update the game using the move the user made
     * fetch the game status from the server
     * display the results to the webpage
     */
    function update(moveName) {
        $("loading").classList.remove("hidden");
        $("p1-turn-results").innerHTML = "";
        $("p2-turn-results").innerHTML = "";
        let url = URL_BASE + "game.php";
        let data = new FormData();
        data.append("move", moveName);
        data.append("guid", gameID);
        data.append("pid", playerID);
        fetch(url, {method: "POST", body: data})
            .then(checkStatus)
            .then(JSON.parse)
            .then(function(response) {
                displayResults(response);
            })
            .catch(console.log);
    }
    
    /**
     * disable all the buttons in a card
     * param@ {string} card - the card in which the buttons will be disabled
     */
    function disableButtons(card) {
        let buttons = document.querySelectorAll(card + " .moves button");
        for (let i = 0; i < buttons.length; i++) {
            buttons[i].disabled = true;
        }
    }
    
    /**
     * End the game and return to pokedex view
     * change the apperance of the page to non-battle mode
     * clear all the buffs and game results
     */
    function endGame() {
        changeStage(false);
        let buffDivs = document.querySelectorAll(".buffs");
        for (let i = 0; i < buffDivs.length; i++) {
            buffDivs[i].innerHTML = "";
        }
        $("flee-btn").classList.add("hidden");
        $("p1-turn-results").innerText = "";
        $("p2-turn-results").innerText = "";
    }
    
    /**
     * Add buffs to the buff bar in a card
     * param@ {string} bar - the bar in which the buffs will be added
     * param@ {string} buffs - the buffs which will be added
     * param@ {string} type - the type of the button(buff or debuff)
     */
    function addBuff(bar, buffs, type) {
        for (let i = 0; i < buffs.length; i++) {
            let oneBuff = gen("div");
            oneBuff.classList.add(buffs[i]);
            oneBuff.classList.add(type);
            bar.appendChild(oneBuff);
        }
    }
    
    /**
     * Display the results of a move of the game to the webpage
     * set the health bar of each player
     * set the buff bar of each player
     * check if the game is finished
     * param@ {JSON object} response - the data fetch from the server 
     *                                 about the game status
     */
    function displayResults(response) {
        $("loading").classList.add("hidden");
        $("p1-turn-results").innerText = "Player 1 played " + 
            response["results"]["p1-move"] + " and " +
            response["results"]["p1-result"] + "!";
        $("p1-turn-results").classList.remove("hidden");
        $("p2-turn-results").innerText = "Player 2 played " + 
            response["results"]["p2-move"] + " and " + 
            response["results"]["p2-result"] + "!";
        if (response["results"]["p2-move"] && 
            response["results"]["p2-result"]) {
            $("p2-turn-results").classList.remove("hidden");   
        } else {
            $("p2-turn-results").classList.add("hidden");
        }
        let p1hp = response["p1"]["current-hp"] / response["p1"]["hp"] * 100;
        let p2hp = response["p2"]["current-hp"] / response["p2"]["hp"] * 100;
        let p1Bar = qs("#my-card .health-bar");
        let p2Bar = qs("#their-card .health-bar");
        checkHealth(p1hp, p1Bar);
        checkHealth(p2hp, p2Bar);
        qs("#my-card .hp").innerText = response["p1"]["current-hp"] + "HP";
        qs("#their-card .hp").innerText = response["p2"]["current-hp"] + "HP";
        p1Bar.style.width = p1hp + "%";
        p2Bar.style.width = p2hp + "%";
        let p1BuffBar = qs("#my-card .buffs");
        let p2BuffBar = qs("#their-card .buffs");
        p1BuffBar.innerHTML = "";
        p2BuffBar.innerHTML = "";
        addBuff(p1BuffBar, response["p1"]["buffs"], "buff");
        addBuff(p2BuffBar, response["p2"]["buffs"], "buff");
        addBuff(p1BuffBar, response["p1"]["debuffs"], "debuff");
        addBuff(p2BuffBar, response["p2"]["debuffs"], "debuff");
        if (p1hp == 0 || p2hp == 0) {
            disableButtons("#my-card");
            disableButtons("#their-card");
            if (p2hp == 0){
                $("title").innerText = "You won!";
                let theirPokemon = response["p2"]["name"];
                $(theirPokemon).classList.add("found");
                $(theirPokemon).onclick = showCard;
            } else {
                $("title").innerText = "You lost!";
            }
            $("flee-btn").disabled = true;
            $("endgame").classList.remove("hidden");
            $("endgame").onclick = endGame;
        }
    }
    
    /**
     * Display the information of the selected pokemon to the page
     * using the data from the server
     * assign the button of "start" so that the game starts when it is clicked
     */
    function showCard() {
        let name = this.id;
        let url = URL_BASE + "pokedex.php" + "?pokemon=" + name;
        fetch(url)
            .then(checkStatus)
            .then(JSON.parse)
            .then(function(response) {
                addInformation("#my-card", response);
            })
            .catch(console.log);
        $("start-btn").classList.remove("hidden");
        $("start-btn").onclick = function() {
            startBattle(name);
        };
    }
    
    /**
     * add the information to the card view
     * if the are less then 4 moves, only the available move buttons will
     * be displayed
     * param@ {string} card - the card to be filled in
     * param@ {JSON object} response - the data from the server about
     *                                 the pokemon selected
     */
    function addInformation(card, response) {
        qs(card + " .name").innerHTML = response["name"];
        qs(card + " img.pokepic").src = URL_BASE + response["images"]["photo"];
        qs(card + " img.type").src = URL_BASE + response["images"]["typeIcon"];
        qs(card + " img.weakness").src = URL_BASE + 
            response["images"]["weaknessIcon"];
        qs(card + " .hp").innerHTML = response["hp"] + "HP";
        qs(card + " .info").innerHTML = response["info"]["description"];
        qs(card + " .health-bar").style.width = "100%";
        qs(card + " .health-bar").classList.remove("low-health");
        originHP = response["hp"];
        let moves = response["moves"];
        let moveIcons = document.querySelectorAll(card + " .moves button");
        for (let i = 0; i < 4; i++) {
            if (moves[i]) {
                moveIcons[i].classList.remove("hidden");
                moveIcons[i].children[0].innerText = moves[i]["name"];
                moveIcons[i].children[2].src = URL_BASE + "icons/" +
                    moves[i]["type"] + ".jpg";
                if (moves[i]["dp"]) {
                    moveIcons[i].children[1].innerText = moves[i]["dp"] +
                        " DP";
                } else {
                    moveIcons[i].children[1].innerText = "";
                }
            } else {
                moveIcons[i].classList.add("hidden");
            }
        }
    }
    
    /**
     * change the apperance of the page in different mode
     * depending on whether it is in battle mode or not
     */
    function changeStage(battle) {
        if (battle) {
            $("title").innerText = "Pokemon Battle Mode!";
            $("endgame").classList.add("hidden"); 
            $("flee-btn").disabled = false;
        } else {
            $("title").innerText = "Your Pikedex";
            $("endgame").classList.remove("hidden");
            $("flee-btn").disabled = true;
            qs("#my-card .health-bar").style.width = "100%";
            qs("#my-card .health-bar").classList.remove("low-health");
            qs("#my-card .hp").innerText = originHP + "HP";
        }
        qs(".card-container .hp-info").classList.toggle("hidden");
        $("start-btn").classList.toggle("hidden");
        $("pokedex-view").classList.toggle("hidden");
        $("their-card").classList.toggle("hidden");
        $("results-container").classList.toggle("hidden");
        $("flee-btn").classList.toggle("hidden");
    }
    
    /**
     * check the health condition of the pokemon
     * if it is less then 20%, add the low-health condition to the health bar
     * remove the condition otherwise
     * param@ {integer} hp - the health of the pokemon
     * param@ {DOM element} bar - the health bar
     */
    function checkHealth(hp, bar) {
        if (hp <= 20) {
            bar.classList.add("low-health");
        } else {
            bar.classList.remove("low-health");
        }
    }
    
    /**
     * check the status of the response of the server
     * return the text of the response if the status is ok
     * send a rejection otherwise
     * param@ {JSON} response - the response from the server
     */
    function checkStatus(response) {
        if (response.status >= 200 && response.status < 300) {
            return response.text();
        } else {
            return Promise.reject(new Error(response.status + ": " + response.statusText));
        }
    }
    
    /**
     * the shortcut for "document.querySelector"
     * param@ {string} type - the type of the queryselector
     * return@ {DOM object} the selected DOM object
     */
    function qs(type) {
        return document.querySelector(type);
    }
    
    /**
     * the shortcut for "document.createElement"
     * param@ {string} type - the type of element to be created
     * return@ {DOM object} the DOM object created
     */
    function gen(type) {
        return document.createElement(type);
    }
    
    /** 
     * the shortcut for "document.getElementById"
     * param@ {string} id - the id of the element to be searched
     * return@ the selected DOM element
     */
    function $(id) {
        return document.getElementById(id);
    }
})();