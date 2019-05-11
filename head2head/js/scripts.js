
function Head2HeadPicker() {

    var formNodes = document.getElementById('form');//container for the following nodes:

    var backBtn = document.getElementById('back-btn');
    var fileInputNode = document.getElementById('file-input');
    var textSubmitBtn = document.getElementById('text-submit-btn');
    var textareaNode = document.getElementById('textarea');

    var resultsNodes = document.getElementById('results');//container for the following nodes:

    var dataBtn = document.getElementById('data-btn');
    var btn0 = document.getElementById('0');
    var btn1 = document.getElementById('1');
    var countNode = document.getElementById('count-remaining');
    var hideCheckBoxNode = document.getElementById('hide-remaining');
    var messageNode = document.getElementById('message');
    var remainingNode = document.getElementById('remaining');

    var options = [];
    var option0 = "";
    var option1 = "";

    var loadData = function(data) {
        resultsNodes.removeAttribute('hidden');
        messageNode.setAttribute('hidden', 'true');
        messageNode.innerHTML = "Winner:";
        options = data.split('\n');
        if (options.length > 0) showResults();
        displayNextChoice();
    };

    var readFile = function(e) {
        var file = e.target.files[0];
        if (!file) {
            return;
        }
        var reader = new FileReader();
        reader.onload = function(e) {
            loadData(e.target.result);
        };
        reader.readAsText(file);
    };

    var readText = function(e) {
        var data = textarea.value;
        console.log(data);
        if (data.trim().length == 0) return;

        loadData(data);
    };

    var showResults = function() {
        formNodes.setAttribute('hidden', 'true');
        resultsNodes.removeAttribute('hidden');
    };

    var showForms = function() {
        resultsNodes.setAttribute('hidden', 'true');
        formNodes.removeAttribute('hidden');
    };

    var displayNextChoice = function() {

        countNode.innerHTML = "Options Remaining: " + options.length;

        remainingNode.innerHTML = "";

        for (var i = 0; i < options.length; i++) {

            var node = document.createElement('P');
            node.innerText = options[i];

            remainingNode.appendChild(node);
        }

        if (options.length > 1) {

            option0 = options.shift();
            option1 = options.shift();

            btn0.innerHTML = option0;
            btn1.innerHTML = option1;

            btn0.disabled = false;
            btn1.disabled = false;

        } else if (options.length == 1) {

            btn0.disabled = true;
            btn1.disabled = true;
            messageNode.removeAttribute('hidden');
            messageNode.innerHTML = "Winner: " + options.shift();
            remainingNode.removeAttribute('hidden');

        }

    };

    var handleSelection = function(e) {

        var clicked = e.target.getAttribute('id');

        if (clicked == 0) {
            options.push(option0);
        } else if (clicked == 1) {
            options.push(option1);
        }

        displayNextChoice();
    };

    var toggleHidden = function(e) {
        if (remainingNode.getAttribute('hidden')) {
            remainingNode.removeAttribute('hidden');
        } else {
            remainingNode.setAttribute('hidden', 'true');
        }
    };

    fileInputNode.addEventListener('change', readFile, false);
    textSubmitBtn.addEventListener('click', readText, false);
    backBtn.addEventListener('click', showResults, false);
    dataBtn.addEventListener('click', showForms, false);
    btn0.addEventListener('click', handleSelection, false);
    btn1.addEventListener('click', handleSelection, false);
    hideCheckBoxNode.addEventListener('change', toggleHidden, false);
};

var head2head = new Head2HeadPicker();
 
//document.getElementById('file-input').addEventListener('change', readSingleFile, false);