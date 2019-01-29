(function() {
    let stored;

    window.onload = function() {
        document.getElementById("highlight").onclick = highlightSelection;
    }
    function highlightSelection() {
        let userSelection = window.getSelection().getRangeAt(0);
        highlightRange(userSelection);
    
    }
    
    function highlightRange(range) {
        let newNode = document.createElement("div");
        newNode.setAttribute(
           "style",
           "background-color: yellow; display: inline;"
        );
        range.surroundContents(newNode);
    }
})();