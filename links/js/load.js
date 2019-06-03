
var PROJECT_HTML_TEMPLATE = `
<div class="project row">

  <div class="col-xs-12 col-md-12">
    <div class="description">
    </div>
  </div>

</div>
`;

function templateToElement(HTMLTemplate) {
    var div = document.createElement('div');
    div.innerHTML = HTMLTemplate.trim();
    return div.firstChild; 
};

var target = document.getElementsByClassName("content")[0];
function addProjectDescription(description) {
    var parent = templateToElement(PROJECT_HTML_TEMPLATE);
    var elem = parent.getElementsByClassName("description")[0];
    elem.innerHTML = description;
    target.appendChild(parent);
};

if (PROJECTS) {
    for (var i = 0; i < PROJECTS.length; i++) {
        addProjectDescription(PROJECTS[i].html);
    }
}

