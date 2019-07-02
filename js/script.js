
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
};

function DialogOption(option) {
    var anchor = document.createElement('a');
    anchor.setAttribute('class', 'dialog-option');
    anchor.href = "/";
    anchor.appendChild(document.createTextNode(option.text));
    anchor.setAttribute('data-key', option.key);
    return anchor;
};

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

var Dialog = {

    projectIdx : 0,
    
    textNode : document.createElement('div'),//displays message
    optionsNode : document.createElement('div'),//displays dialog options
    node : document.createElement('div'),//container

    tree : {
        home: {
            html: "Welcome to maxjwhite.com! How can I help you?",
            options: [
                dialogOptions.toProjects,
                dialogOptions.toFacts,
            ],
        },
        projectsHome: {
            html: 'We\'ve got a couple things in stock. Maybe you\'ll find something to suit your taste. (All code can be found on <a href="https://github.com/sewardhorace/" target="_blank">github</a>)',
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
    },

    init : function () {
        this.textNode.setAttribute('id', 'text');
        this.optionsNode.setAttribute('id', 'options');
        this.node.setAttribute('id', 'dialog');

        //block camera controls
        this.node.addEventListener('mousemove', function (e) { e.stopImmediatePropagation(); }, false);
        this.node.appendChild(this.textNode);
        this.node.appendChild(this.optionsNode);
        document.body.appendChild(this.node);

        this.optionsNode.addEventListener('click', this.handleClick.bind(this), false);
    },

    updateText : function(html) {
        var node = this.textNode;
        while (node.firstChild) {
            node.removeChild(node.firstChild);
        }
        node.innerHTML = html;
    },

    updateOptions : function(options) {
        var node = this.optionsNode;
        while (node.firstChild) {
            node.removeChild(node.firstChild);
        }
        for (var i = 0; i < options.length; i++) {
            node.appendChild(options[i]);
            node.appendChild(document.createTextNode(" "));
        }
    },

    displayLoading : function() {
        this.updateText('Loading 3D... Please wait...');
        this.updateOptions([]);
    },

    displayHome : function() {
        this.setHomePositions();
        this.updateText(this.tree.home.html);
        this.updateOptions(this.tree.home.options);
    },

    displayProjects : function() {
        this.setZoomPositions();
        this.projectIdx = PROJECTS.length - 1;
        this.updateText(this.tree.projectsHome.html);
        this.updateOptions(this.tree.projectsHome.options);
    },

    showNextProject : function() {
        PROJECTS[this.projectIdx].model.visible = false;
        this.projectIdx = this.projectIdx + 1;
        if (this.projectIdx >= PROJECTS.length) this.projectIdx = 0;
        PROJECTS[this.projectIdx].model.visible = true;
        this.updateText(PROJECTS[this.projectIdx].html);
        this.updateOptions(this.tree.projects.options);
    },

    showPrevProject : function() {
        PROJECTS[this.projectIdx].model.visible = false;
        this.projectIdx = this.projectIdx - 1;
        if (this.projectIdx < 0) this.projectIdx = PROJECTS.length - 1;
        PROJECTS[this.projectIdx].model.visible = true;
        this.updateText(PROJECTS[this.projectIdx].html);
    },

    displayFacts : function() {
        var fact = this.getRandomFact();
        this.updateText(fact);
        this.updateOptions(this.tree.facts.options);
    },

    updateFact : function() {
        var fact = this.getRandomFact();
        this.updateText(fact);
    },

    getRandomFact : function() {
        var idx = Math.floor(Math.random() * FACTS.length);
        var fact = FACTS.splice(idx, 1)[0];
        if (fact) return fact;
        else return "That's everything I've heard.";
    },

    handleClick : function(e) {
        e.preventDefault();
        var key = e.target.getAttribute('data-key');
        switch (key) {
            case dialogOptions.toProjects.getAttribute('data-key'):
                this.displayProjects();
                break;
            case dialogOptions.toFacts.getAttribute('data-key'):
                this.displayFacts();
                break;
            case dialogOptions.getNextProject.getAttribute('data-key'):
                this.showNextProject();
                break;
            case dialogOptions.getPrevProject.getAttribute('data-key'):
                this.showPrevProject();
                break;
            case dialogOptions.getFact.getAttribute('data-key'):
                this.updateFact();
                break;
            case dialogOptions.toHome.getAttribute('data-key'):
                this.displayHome();
                break;
            default:
        }
    },
};

var ShopScene = {
    CAMERA_POSITIONS : {
        home : new THREE.Vector3(0, 6.5, 9),
        projects : new THREE.Vector3(-3.4, 8, 7)
    },
    ANIMATIONS : {
        home: null,
        transition: null,
        projects: null,
    },
    LIGHT_POSITIONS : [
        new THREE.Vector3(-8.79, 8.93, -1.44), //left side torch
        new THREE.Vector3(9.11, 8.94, -1.44), //right side torch
        new THREE.Vector3(3.45, 6.97, -6.20), //shelf candle
        new THREE.Vector3(-1.96, 5.51, 3.60), //countertop candle
    ],
    lights : [],

    //
    isUserInteracting : false,
    onMouseDownMouseX : 0,
    onMouseDownMouseY : 0,
    lon : -90,
    onMouseDownLon : 0,
    lat : 0, 
    onMouseDownLat : 0,
    phi : 0, 
    theta : 0,
    time : 0,

    scene : new THREE.Scene(),
    camera : new THREE.PerspectiveCamera(50, 4/3, 0.1, 1000),
    renderer : new THREE.WebGLRenderer(),
    loader : new THREE.GLTFLoader(),
    clock : new THREE.Clock(),
    mixer : null,
    dialog : Dialog,

    init : function() {

        this.dialog.init();
        this.dialog.setZoomPositions = this.setZoomPositions.bind(this);
        this.dialog.setHomePositions = this.setHomePositions.bind(this);

        //renderer
        this.renderer.setSize(window.innerHeight * 4/3, window.innerHeight);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.physicallyCorrectLights = true;
        this.renderer.gammaInput = true; //?
        this.renderer.gammaOutput = true;
        this.renderer.gammaFactor = 2.2;
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        this.renderer.domElement.setAttribute('id', 'canvas');
        document.body.appendChild( this.renderer.domElement );

        //lights
        for (var i = 0; i < this.LIGHT_POSITIONS.length; i++) {
            var flame = new FlameLight(this.LIGHT_POSITIONS[i]);
            this.lights.push(flame);
            this.scene.add(flame.point);
        }

        //camera
        this.camera.position.set(this.CAMERA_POSITIONS.home.x, this.CAMERA_POSITIONS.home.y, this.CAMERA_POSITIONS.home.z);
        this.camera.target = new THREE.Vector3(0, 0, -500);
        this.camera.lookAt(this.camera.target);

        //assets
        this.loader.load(
            'assets/shop_scene.glb',
            function (gltf) {
                gltf.scene.traverse(function (node) {
                    if (node instanceof THREE.Mesh) {
                        node.castShadow = true;
                        node.receiveShadow = true;
                    }
                });
                model = gltf.scene;
                this.mixer = new THREE.AnimationMixer(model);
                this.ANIMATIONS.home = this.mixer.clipAction(gltf.animations.find(anim => anim.name === 'Rest'));
                this.ANIMATIONS.transition = this.mixer.clipAction(gltf.animations.find(anim => anim.name === 'DisplayTransition'));
                this.ANIMATIONS.projects = this.mixer.clipAction(gltf.animations.find(anim => anim.name === 'Display'));
                this.ANIMATIONS.transition.loop = THREE.LoopOnce;
                this.ANIMATIONS.home.play();

                this.scene.add(model);
                this.dialog.displayHome();
            }.bind(this),
            function (xhr) {
                this.dialog.displayLoading();
                //console.log(xhr);
            }.bind(this),
            function (error) {
                //console.log(error);
            }
        );//end loader.load(...)
        for (var i = 0; i < PROJECTS.length; i++) {
            this.loadProjectAsset(i);
        }

        //event listeners
        window.addEventListener('resize', this.onWindowResize.bind(this), false);
        document.addEventListener('mousemove', this.onDocumentMouseMove.bind(this), false);
        document.addEventListener('mousedown', this.onDocumentMouseDown.bind(this), false);
        document.addEventListener('mouseup', this.onDocumentMouseUp.bind(this), false);
        //document.addEventListener('touchstart', onPointerStart, false); //touch support
        //document.addEventListener('touchmove', onPointerMove, false);

        //start animation loop
        this.render();
    },//end init

    render : function() {
        var delta = this.clock.getDelta();
        if (this.mixer != null) {
            this.mixer.update(delta);
        };
    
        this.time += delta;
        for (var i = 0; i < this.lights.length; i++) {
            this.lights[i].update(this.time);
        }

        if (PROJECTS[this.dialog.projectIdx].model != null) {
            PROJECTS[this.dialog.projectIdx].model.rotation.y -= 0.02;
        }

        //view controls
        this.lat = Math.max(-85, Math.min(85, this.lat));
        this.phi = THREE.Math.degToRad(90 - this.lat);
        this.theta = THREE.Math.degToRad(this.lon);
        this.camera.target.x = 500 * Math.sin(this.phi) * Math.cos(this.theta);
        this.camera.target.y = 500 * Math.cos(this.phi);
        this.camera.target.z = 500 * Math.sin(this.phi) * Math.sin(this.theta);

        this.camera.lookAt(this.camera.target);

        this.renderer.render(this.scene, this.camera);

        requestAnimationFrame(this.render.bind(this));
    },

    loadProjectAsset : function (idx) {
        this.loader.load(
            PROJECTS[idx].modelPath,
            function (gltf) {
                gltf.scene.traverse(function (node) {
                    if (node instanceof THREE.Mesh) {
                        node.castShadow = true;
                        node.receiveShadow = true;
                    }
                });
                var m = gltf.scene;
                m.position.x = -3.4;
                m.position.y = 8.6;
                m.position.z = 0.3;
                m.rotation.z = 0.1;
                m.visible = false;
                this.scene.add(m);
                PROJECTS[idx].model = m;
            }.bind(this),
            function (xhr) {
                //TODO: display loading progress or some type of feedback
            },
            function (error) {
                //console.log(error);
            }
        );
    },

    setHomePositions : function() {
        if (this.mixer != null) {
            this.mixer.stopAllAction();
            this.ANIMATIONS.transition.setEffectiveTimeScale(-1);
            this.ANIMATIONS.projects.crossFadeTo(this.ANIMATIONS.transition, 1.5, false).play();
            this.ANIMATIONS.home.crossFadeFrom(this.ANIMATIONS.transition, 1.5, false).play();
        }
        this.camera.position.set(this.CAMERA_POSITIONS.home.x, this.CAMERA_POSITIONS.home.y, this.CAMERA_POSITIONS.home.z);
        if (PROJECTS[this.dialog.projectIdx].model) {
            PROJECTS[this.dialog.projectIdx].model.visible = false;
        }
    },

    setZoomPositions : function() {
        if (this.mixer != null) {
            this.mixer.stopAllAction();
            this.ANIMATIONS.transition.setEffectiveTimeScale(1);
            this.ANIMATIONS.home.crossFadeTo(this.ANIMATIONS.transition, 1.5, false).play();
            this.ANIMATIONS.projects.crossFadeFrom(this.ANIMATIONS.transition, 1.5, false).play();
        }
        this.camera.position.set(this.CAMERA_POSITIONS.projects.x, this.CAMERA_POSITIONS.projects.y, this.CAMERA_POSITIONS.projects.z);
    },

    onWindowResize : function(e) {
        this.renderer.setSize(window.innerHeight * 4 / 3, window.innerHeight);
    },

    onDocumentMouseMove : function(e) {
        if (this.isUserInteracting === true) {
            var clientX = e.clientX;
            var clientY = e.clientY;
            this.lon = (this.onMouseDownMouseX - clientX) * 0.1 + this.onMouseDownLon;
            this.lat = (clientY - this.onMouseDownMouseY) * 0.1 + this.onMouseDownLat;

            //restrict viewing angles
            if (this.lon > -70) this.lon = -70;
            if (this.lon < -110) this.lon = -110;
            if (this.lat > 15) this.lat = 15;
            if (this.lat < -20) this.lat = -20;
        }
    },

    onDocumentMouseDown : function(e) {
        this.isUserInteracting = true;
        this.onMouseDownMouseX = e.clientX;
        this.onMouseDownMouseY = e.clientY;
        this.onMouseDownLon = this.lon;
        this.onMouseDownLat = this.lat;
    },

    onDocumentMouseUp : function(e) {
        this.isUserInteracting = false;
    },
};

ShopScene.init();