
function Head2HeadPicker() {

    var fileInputNode = document.getElementById('file-input');
    var fileNameNode = document.getElementById('file-name');
    var btn0 = document.getElementById('0');
    var btn1 = document.getElementById('1');
    var countNode = document.getElementById('count-remaining');
    var messageNode = document.getElementById('message');
    var remainingNode = document.getElementById('remaining');
    var hideCheckBoxNode = document.getElementById('hide-remaining');

    var options = [];
    var option0 = "";
    var option1 = "";

    var loadFileData = function(file) {
        fileNameNode.innerHTML = file.name;
        messageNode.setAttribute('hidden', 'true');
        options = file.result.split('\n');
        if (options.length > 1) {
            btn0.disabled = false;
            btn1.disabled = false;
        }        
        displayNextChoice();
    };

    var readFile = function(e) {
        var file = e.target.files[0];
        if (!file) {
            return;
        }
        var reader = new FileReader();
        reader.onload = function(e) {
            var result = e.target;
            result.name = file.name;
            loadFileData(result);
        };
        reader.readAsText(file);
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

        } else {

            btn0.disabled = true;
            btn1.disabled = true;
            messageNode.removeAttribute('hidden');
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
    btn0.addEventListener('click', handleSelection, false);
    btn1.addEventListener('click', handleSelection, false);
    hideCheckBoxNode.addEventListener('change', toggleHidden, false);
};

var head2head = new Head2HeadPicker();
 
//document.getElementById('file-input').addEventListener('change', readSingleFile, false);