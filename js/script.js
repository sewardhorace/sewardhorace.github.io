
//TODO: (if needed) detect if text is overflowing the dialog box; then user presses enter or clicks to advance dialog (??)

var projectIdx = 0;
var PROJECTS = [
    {
        html: '<a href="http://pacific-mountain-63896.herokuapp.com/" target="_blank">Infinite Labyrinth</a>: a web app with Tabletop RPG tools built with Django and the HTML Canvas API (WIP)',
        modelPath: 'assets/sword.glb',
        model: null,
    },
    {
        html: '<a href="https://twitter.com/fabricreature" target="_blank">Tweet Bestiary</a>: a Twitter bot that generates randomized fantastic creatures (WIP)',
        modelPath: 'assets/axe.glb',
        model: null,
    },
    {
        html: '<a href="http://revugle.com" target="_blank">Revugle</a>: a web app for communities to share media reviews (WIP)',
        modelPath: 'assets/helm.glb',
        model: null,
    },
    {
        html: 'The... interesting... musical musings of <a href="https://soundcloud.com/max-white-414816156" target="_blank">plain yogurt</a>',
        modelPath: 'assets/lute.glb',
        model: null,
    },
    {
        html: 'A bit of dusty old <a href="https://imgur.com/user/sewardhorace" target="_blank">artwork</a>, in various media',
        modelPath: 'assets/sheild.glb',
        model: null,
    },
    {
        html: 'Try the <a href="head2head/" target="_blank">Head2Head Picker</a> if you need to narrow down a choice. Nothing fancy, but it gets the job done.',
        modelPath: 'assets/sheild.glb',
        model: null,
    },
    /*
    {
        html: '<a href="dungeonballsupercrawl.com">Dungeon Ball Super Crawl</a>: a blog about tabletop role-playing games and other fantasy stuff',
        modelPath: 'assets/??.glb',
        model: null,
    },
    */
];

var FACTS = [
    "Max's origins are a bit mysterious... but I do know he's from Iowa and grew up doing farm work.",
    "He'd never tell it, but of Max's many hobbies, his favorite is playing tabletop role-playing games like D&D.",
    "I found a pair of tango shoes and a Florindo Sassone record back here somewhere...",
    "Since I sometimes have to do the cookin' around here, I know Max's favorite food is gyros.",
    "Max's favorite book is the Book of the New Sun by Gene Wolfe. He seriously won't shut up about it.",
    "Don't tell him I said so, but Max's Spanish is getting a bit rusty...",
    "For some reason Max is really into a band called Diarrhea Planet. I can't get past the name though...",
    "Max's favorite video game of all time is Star Fox 64.",
];

var CAMERA = {
    home: new THREE.Vector3(0, 6.5, 9),
    projects: new THREE.Vector3(-3.4, 8, 7),
};

var ANIMATIONS = {
    home: null,
    transition: null,
    projects: null,
};

var lightPositions = [
    new THREE.Vector3(-8.79, 8.93, -1.44), //left side torch
    new THREE.Vector3(9.11, 8.94, -1.44), //right side torch
    new THREE.Vector3(3.45, 6.97, -6.20), //shelf candle
    new THREE.Vector3(-1.96, 5.51, 3.60), //countertop candle
];

var isUserInteracting = false;
    onMouseDownMouseX = 0, onMouseDownMouseY = 0,
	lon = -90, onMouseDownLon = 0,
	lat = 0, onMouseDownLat = 0,
	phi = 0, theta = 0;

var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(50, 4/3, 0.1, 1000);
var renderer = new THREE.WebGLRenderer();

renderer.setSize(window.innerHeight * 4/3, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.physicallyCorrectLights = true;
renderer.gammaInput = true; //?
renderer.gammaOutput = true;
renderer.gammaFactor = 2.2;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.domElement.setAttribute('id', 'canvas');
document.body.appendChild( renderer.domElement );

function FlameLight(vector3) {

    this.position = vector3;
    
    var pointLight = new THREE.PointLight(0xffd7a3, 20, 0, 2);
    pointLight.position.set(vector3.x, vector3.y, vector3.z);
    pointLight.castShadow = true;
    pointLight.shadow.mapSize.width = 1024;
    pointLight.shadow.mapSize.height = 1024;
    this.point = pointLight;
    this.rate = Math.random() + 1;

    this.update = function (time) {
        //TODO: more noise for flickering
        //https://codepen.io/prisoner849/pen/XPVGLp
        var i = 20 + Math.sin(this.rate * time * Math.PI * 2) * Math.cos(this.rate * time * Math.PI * 1.5) * 2;
        this.point.intensity = i;
    }
}

var lights = [];
for (var i = 0; i < lightPositions.length; i++) {
    var flame = new FlameLight(lightPositions[i]);
    lights.push(flame);
    scene.add(flame.point);
}

camera.position.set(CAMERA.home.x, CAMERA.home.y, CAMERA.home.z);
camera.target = new THREE.Vector3(0, 0, -500);
camera.lookAt(camera.target);

//TODO: limited strafing controls?

var loader = new THREE.GLTFLoader();

var mixer;
 loader.load(
     'assets/shop_scene.glb',
     function (gltf) {
         console.log("done");
         gltf.scene.traverse(function (node) {
             if (node instanceof THREE.Mesh) {
                 node.castShadow = true;
                 node.receiveShadow = true;
             }
         });
         model = gltf.scene;
         mixer = new THREE.AnimationMixer(model);

         ANIMATIONS.home = mixer.clipAction(gltf.animations.find(anim => anim.name === 'Rest'));
         ANIMATIONS.transition = mixer.clipAction(gltf.animations.find(anim => anim.name === 'DisplayTransition'));
         ANIMATIONS.projects = mixer.clipAction(gltf.animations.find(anim => anim.name === 'Display'));
         ANIMATIONS.transition.loop = THREE.LoopOnce;
         ANIMATIONS.home.play();

         scene.add(model);
         dialog.displayHome();
         
     },
     function (xhr) {
         dialog.displayLoading();
         //console.log(xhr);
     },
     function (error) {
         //console.log(error);
     }
 );

 function loadProjectAsset(idx) {
     loader.load(PROJECTS[idx].modelPath,
        function (gltf) {
            gltf.scene.traverse(function (node) {
                if (node instanceof THREE.Mesh) {
                    node.castShadow = true;
                    node.receiveShadow = true;
                }
            });
            var m = 
            m = gltf.scene;
            m.position.x = -3.4;
            m.position.y = 8.6;
            m.position.z = 0.3;
            m.rotation.z = 0.1;
            m.visible = false;
            scene.add(m);
            PROJECTS[idx].model = m;
        },
        function (xhr) {
            //TODO: display loading progress or some type of feedback
        },
        function (error) {
            //console.log(error);
        }
    );
 }

 for (var i = 0; i < PROJECTS.length; i++) {
     loadProjectAsset(i);
 }


 
var clock = new THREE.Clock();
var time = 0;
function render() {

    var delta = clock.getDelta();
     if (mixer != null) {
         mixer.update(delta);
     };
    
     time += delta;
     for (var i = 0; i < lights.length; i++) {
         lights[i].update(time);
     }

     if (PROJECTS[projectIdx].model != null) {
         PROJECTS[projectIdx].model.rotation.y -= 0.02;
     }

    //view controls
     lat = Math.max(-85, Math.min(85, lat));
     phi = THREE.Math.degToRad(90 - lat);
     theta = THREE.Math.degToRad(lon);
     camera.target.x = 500 * Math.sin(phi) * Math.cos(theta);
     camera.target.y = 500 * Math.cos(phi);
     camera.target.z = 500 * Math.sin(phi) * Math.sin(theta);
     
     camera.lookAt(camera.target);

     renderer.render(scene, camera);
 }

function animate() {
    requestAnimationFrame(animate);
    render();
}
animate();


function setHomePositions() {
    if (mixer != null) {
        mixer.stopAllAction();
        ANIMATIONS.transition.setEffectiveTimeScale(-1);
        ANIMATIONS.projects.crossFadeTo(ANIMATIONS.transition, 1.5, false).play();
        ANIMATIONS.home.crossFadeFrom(ANIMATIONS.transition, 1.5, false).play();
    }
    camera.position.set(CAMERA.home.x, CAMERA.home.y, CAMERA.home.z);
    if (PROJECTS[projectIdx].model) {
        PROJECTS[projectIdx].model.visible = false;
    }
};

function setZoomPositions() {
    if (mixer != null) {
        mixer.stopAllAction();
        ANIMATIONS.transition.setEffectiveTimeScale(1);
        ANIMATIONS.home.crossFadeTo(ANIMATIONS.transition, 1.5, false).play();
        ANIMATIONS.projects.crossFadeFrom(ANIMATIONS.transition, 1.5, false).play();
    }
    camera.position.set(CAMERA.projects.x, CAMERA.projects.y, CAMERA.projects.z);
};

window.addEventListener('resize', onWindowResize, false);
document.addEventListener('mousemove', onDocumentMouseMove, false);
document.addEventListener('mousedown', onDocumentMouseDown, false);
document.addEventListener('mouseup', onDocumentMouseUp, false);
//document.addEventListener('touchstart', onPointerStart, false); //touch support
//document.addEventListener('touchmove', onPointerMove, false);

function onWindowResize() {
    renderer.setSize(window.innerHeight * 4 / 3, window.innerHeight);
}

function onDocumentMouseDown(e) {
    isUserInteracting = true;
    var clientX = e.clientX;
    var clientY = e.clientY;
    onMouseDownMouseX = clientX;
    onMouseDownMouseY = clientY;
    onMouseDownLon = lon;
    onMouseDownLat = lat;
}

function onDocumentMouseUp(e) {
    isUserInteracting = false;
}

function onDocumentMouseMove(e) {
    if (isUserInteracting === true) {
        var clientX = e.clientX;
        var clientY = e.clientY;
        lon = (onMouseDownMouseX - clientX) * 0.1 + onMouseDownLon;
        lat = (clientY - onMouseDownMouseY) * 0.1 + onMouseDownLat;

        //restrict viewing angles
        if (lon > -70) lon = -70;
        if (lon < -110) lon = -110;
        if (lat > 15) lat = 15;
        if (lat < -20) lat = -20;
    }
}


function DialogOption(option) {
    var anchor = document.createElement('a');
    anchor.setAttribute('class', 'dialog-option');
    anchor.href = "/";
    anchor.appendChild(document.createTextNode(option.text));
    anchor.setAttribute('data-key', option.key);
    return anchor;
}

function Dialog() {
    //text node displays message
    var textNode = document.createElement('div');
    textNode.setAttribute('id', 'text');

    //options node displays dialog options
    var optionsNode = document.createElement('div');
    optionsNode.setAttribute('id', 'options');

    //container node
    var node = document.createElement('div');
    node.setAttribute('id', 'dialog');

    //block camera controls
    node.addEventListener('mousemove', function (e) { e.stopImmediatePropagation(); }, false);
    node.appendChild(textNode);
    node.appendChild(optionsNode);
    this.node = node;

    var dialogOptions = {
        toProjects: new DialogOption({
            text: "Show me the goods.",
            key: 'projects',
        }),
        toFacts: new DialogOption({
            text: "Got any juicy gossip?",
            key: 'facts',
        }),
        getNextProject: new DialogOption({
            text: "Next",
            key: 'project-next',
        }),
        getPrevProject: new DialogOption({
            text: "Previous",
            key: 'project-prev',
        }),
        getFact: new DialogOption({
            text: "Anything else?",
            key: 'fact',
        }),
        toHome: new DialogOption({
            text: "Back",
            key: 'home',
        }),
    };

    var tree = {
        home: {
            html: "Welcome to maxjwhite.com! Max isn't in right now but he left me in charge. How can I help you?",
            options: [
                dialogOptions.toProjects,
                dialogOptions.toFacts,
            ],
        },
        projectsHome: {
            html: "We've got a couple things in stock. Maybe you'll find something to suit your taste.",
            options: [
                dialogOptions.getNextProject,
                dialogOptions.toHome,
            ],
        },
        projects: {
            html: "Replace with project details.", //not used
            options: [
                dialogOptions.getNextProject,
                dialogOptions.getPrevProject,
                dialogOptions.toHome,
            ],
        },
        facts: {
            html: "Did you know...", //not used
            options: [
                dialogOptions.getFact,
                dialogOptions.toHome,
            ],
        },
    };

    function updateText(html) {
        var node = textNode;
        while (node.firstChild) {
            node.removeChild(node.firstChild);
        }
        node.innerHTML = html;
    };

    function updateOptions(options) {
        var node = optionsNode;
        while (node.firstChild) {
            node.removeChild(node.firstChild);
        }
        for (var i = 0; i < options.length; i++) {
            node.appendChild(options[i]);
            node.appendChild(document.createTextNode(" "));
        }
    };

    function displayLoading() {
        updateText('Loading 3D... Please wait...');
        updateOptions([]);
    };

    function displayHome() {
        setHomePositions();
        updateText(tree.home.html);
        updateOptions(tree.home.options);
    };

    function displayProjects() {
        setZoomPositions();
        projectIdx = PROJECTS.length - 1;
        updateText(tree.projectsHome.html);
        updateOptions(tree.projectsHome.options);
    };  

    function showNextProject() {
        PROJECTS[projectIdx].model.visible = false;
        projectIdx = projectIdx + 1;
        if (projectIdx >= PROJECTS.length) projectIdx = 0;
        PROJECTS[projectIdx].model.visible = true;
        updateText(PROJECTS[projectIdx].html);
        updateOptions(tree.projects.options);
    };

    function showPrevProject() {
        PROJECTS[projectIdx].model.visible = false;
        projectIdx = projectIdx - 1;
        if (projectIdx < 0) projectIdx = PROJECTS.length - 1;
        PROJECTS[projectIdx].model.visible = true;
        updateText(PROJECTS[projectIdx].html);
    };

    function displayFacts() {
        var fact = getRandomFact();
        updateText(fact);
        updateOptions(tree.facts.options);
    };

    function updateFact() {
        var fact = getRandomFact();
        updateText(fact);
    };

    function getRandomFact() {
        var idx = Math.floor(Math.random() * FACTS.length);
        var fact = FACTS.splice(idx, 1)[0];
        if (fact) return fact;
        else return "That's everything I've heard.";
    };

    function handleClick(e) {
        e.preventDefault();
        var key = e.target.getAttribute('data-key');
        switch (key) {
            case dialogOptions.toProjects.getAttribute('data-key'):
                displayProjects();
                break;
            case dialogOptions.toFacts.getAttribute('data-key'):
                displayFacts();
                break;
            case dialogOptions.getNextProject.getAttribute('data-key'):
                showNextProject();
                break;
            case dialogOptions.getPrevProject.getAttribute('data-key'):
                showPrevProject();
                break;
            case dialogOptions.getFact.getAttribute('data-key'):
                updateFact();
                break;
            case dialogOptions.toHome.getAttribute('data-key'):
                displayHome();
                break;
            default:
        }
    };

    optionsNode.addEventListener('click', handleClick, false);

    this.displayLoading = displayLoading;
    this.displayHome = displayHome;
};

var dialog = new Dialog();
dialog.displayHome();
document.body.appendChild(dialog.node);
