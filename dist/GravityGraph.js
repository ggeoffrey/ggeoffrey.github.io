/// <reference path='headers/GravityGraph.d.ts' />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var GravityGraph;
(function (GravityGraph) {
    var Node3D = (function (_super) {
        __extends(Node3D, _super);
        function Node3D(data, config) {
            /*
                var material = ?
                var geometry = ?
            */
            if (!Node3D.nodesColor) {
                Node3D.nodesColor = config.colorBuilder;
            }
            var color = Node3D.nodesColor(data.group);
            var material;
            if (Node3D.materialsMap[color]) {
                material = Node3D.materialsMap[color];
            }
            else if (config.quality == 2 /* HIGH */) {
                Node3D.OPACITY = 0.95;
                material = new THREE.MeshLambertMaterial({
                    color: color,
                    transparent: true,
                    opacity: Node3D.OPACITY,
                    wireframe: false,
                    shininess: 5
                });
                Node3D.materialsMap[color] = material;
            }
            else if (config.quality < 2 /* HIGH */) {
                Node3D.OPACITY = 1;
                material = new THREE.MeshBasicMaterial({
                    color: color,
                    transparent: true,
                    opacity: Node3D.OPACITY,
                    wireframe: false
                });
                Node3D.materialsMap[color] = material;
            }
            if (config.isWebGL()) {
                _super.call(this, Node3D.basicGeometry, material.clone());
            }
            else {
                _super.call(this, Node3D.degradedGeometry, material.clone());
            }
            this.data = data;
            this.quality = config.quality;
            this.selected = false;
            this.walked = false;
            this.changeDefaults(config);
        }
        Node3D.prototype.changeDefaults = function (config) {
            this.position.set(0, 0, 0);
            this.castShadow = config.shadows;
        };
        // COLOR
        Node3D.setColorMethod = function (colorScale) {
            Node3D.nodesColor = colorScale;
        };
        Node3D.prototype.getColor = function () {
            var material = this.material;
            return material.color;
        };
        Node3D.prototype.setColor = function (color) {
            var material = this.material;
            material.color.set(color);
        };
        // DATA
        Node3D.prototype.getData = function () {
            return this.data;
        };
        // REFRESH
        Node3D.prototype.update = function () {
            this.setColor(Node3D.nodesColor(this.data.group));
            this.material.needsUpdate = true;
        };
        Node3D.prototype.updateTarget = function (position) {
            if (this.quality == 0 /* LOW */) {
                this.lookAt(position);
            }
        };
        // UTILS
        Node3D.prototype.distanceTo = function (node) {
            return this.position.distanceTo(node.position);
        };
        Node3D.prototype.equals = function (node) {
            return this.getData() == node.getData();
        };
        Node3D.prototype.isSameGroupOf = function (node) {
            return this.getData().group == node.getData().group;
        };
        // VISUAL
        Node3D.prototype.setFocused = function () {
            this.material.opacity = Node3D.OPACITY;
            this.material.needsUpdate = true;
            this.scale.set(1, 1, 1);
        };
        Node3D.prototype.setUnFocused = function () {
            this.material.opacity = 0.375;
            this.material.needsUpdate = true;
            this.scale.set(1, 1, 1);
        };
        Node3D.basicGeometry = new THREE.IcosahedronGeometry(10, 2);
        Node3D.degradedGeometry = new THREE.IcosahedronGeometry(10, 0);
        //private static lowQualityGeometry : THREE.CircleGeometry = new THREE.CircleGeometry(10, 20);
        Node3D.materialsMap = {};
        Node3D.OPACITY = 0.95;
        return Node3D;
    })(THREE.Mesh);
    GravityGraph.Node3D = Node3D;
})(GravityGraph || (GravityGraph = {}));
/// <reference path='headers/GravityGraph.d.ts' />
var GravityGraph;
(function (GravityGraph) {
    var Cloud = (function (_super) {
        __extends(Cloud, _super);
        function Cloud(link) {
            this.support = link;
            this.velocity = 0;
            this.nbParticles = 10;
            var geometry = new THREE.Geometry();
            for (var i = 0; i < this.nbParticles; i++) {
                geometry.vertices.push(new THREE.Vector3(0, 0, 0));
            }
            _super.call(this, geometry, Cloud.defaultMaterial);
            this.support.setCloud(this);
        }
        Cloud.prototype.changeDefaults = function () {
        };
        Cloud.prototype.update = function () {
            this.position.copy(this.support.getSource().position);
            this.lookAt(this.support.getTarget().position);
        };
        Cloud.prototype.start = function () {
            if (this.velocity < Cloud.baseVelocity) {
                this.velocity += 0.005;
            }
        };
        Cloud.prototype.stop = function () {
            if (this.velocity > 0) {
                this.velocity -= 0.0035;
            }
        };
        Cloud.prototype.animate = function () {
            if (this.velocity > 0) {
                var i = 0, len = this.geometry.vertices.length, vertice, previousVertice;
                var lineLength = this.support.getLineLength();
                while (i < len) {
                    vertice = this.geometry.vertices[i];
                    vertice.z += this.velocity;
                    if (vertice.z > lineLength) {
                        vertice.z = 0;
                    }
                    if (previousVertice) {
                        if (vertice.z - previousVertice.z < lineLength / this.nbParticles) {
                            vertice.z += this.velocity;
                        }
                    }
                    previousVertice = vertice;
                    i++;
                }
                this.geometry.verticesNeedUpdate = true;
            }
        };
        Cloud.imgMap = 'assets/img/light.png';
        Cloud.particleMap = THREE.ImageUtils.loadTexture(Cloud.imgMap);
        Cloud.defaultMaterial = new THREE.PointCloudMaterial({
            color: 0xffffff,
            size: 5,
            map: Cloud.particleMap,
            blending: THREE.AdditiveBlending,
            transparent: true,
            depthWrite: false,
            //vertexColors: true,
            sizeAttenuation: true
        });
        Cloud.baseVelocity = 0.25;
        return Cloud;
    })(THREE.PointCloud);
    GravityGraph.Cloud = Cloud;
})(GravityGraph || (GravityGraph = {}));
/// <reference path='headers/GravityGraph.d.ts' />
var GravityGraph;
(function (GravityGraph) {
    var NodeSelectAnimation = (function (_super) {
        __extends(NodeSelectAnimation, _super);
        function NodeSelectAnimation() {
            var segmentCount = 32, radius = 30, geometry = new THREE.Geometry(), material = new THREE.LineBasicMaterial({
                color: 0xff0000,
                transparent: true
            });
            for (var i = 0; i <= segmentCount; i++) {
                var theta = (i / segmentCount) * Math.PI * 2;
                geometry.vertices.push(new THREE.Vector3(Math.cos(theta) * radius, Math.sin(theta) * radius, 0));
            }
            _super.call(this, geometry, material);
            this.changeDefaults();
        }
        NodeSelectAnimation.prototype.changeDefaults = function () {
            this.scale.set(1, 1, 1);
            this.visible = false;
        };
        NodeSelectAnimation.prototype.animate = function () {
            var _this = this;
            //createjs.Tween.removeTweens(this.animatedObject);
            this.firstExpand = true;
            this.material.opacity = 1;
            this.material.needsUpdate = true;
            this.animatedObject = { scaleCircle: 0, scaleNode: 1 };
            this.animation = new createjs.Tween(this.animatedObject).to({
                scaleCircle: 3000
            }, 1000).call(function () {
                //createjs.Tween.removeTweens(this.animatedObject);
                _this.firstExpand = false;
                _this.animatedObject.scaleCircle = 0;
                _this.animation = new createjs.Tween(_this.animatedObject, {
                    loop: true,
                }).to({
                    scaleCircle: 100,
                }, 1000);
            });
            this.animation2 = new createjs.Tween(this.animatedObject, {
                loop: true,
            }).to({
                scaleNode: 1.25
            }, 500, createjs.Ease.backInOut).to({
                scaleNode: 1
            }, 500, createjs.Ease.backInOut);
        };
        NodeSelectAnimation.prototype.update = function (target) {
            if (this.animatedObject.scaleCircle !== undefined) {
                var s = this.animatedObject.scaleCircle / 100;
                this.scale.set(s, s, s);
                if (!this.firstExpand) {
                    var opacity = Math.sin(1 - s);
                    this.material.opacity = opacity;
                    this.material.needsUpdate = true;
                }
                this.lookAt(target);
                s = this.animatedObject.scaleNode;
                this.support.scale.set(s, s, s);
            }
        };
        NodeSelectAnimation.prototype.setPosition = function (node) {
            this.support = node;
            this.position.copy(node.position);
        };
        NodeSelectAnimation.prototype.show = function () {
            this.visible = true;
        };
        NodeSelectAnimation.prototype.hide = function () {
            this.support.scale.set(1, 1, 1);
            this.visible = false;
        };
        return NodeSelectAnimation;
    })(THREE.Line);
    GravityGraph.NodeSelectAnimation = NodeSelectAnimation;
})(GravityGraph || (GravityGraph = {}));
/// <reference path="headers/GravityGraph.d.ts" />
var GravityGraph;
(function (GravityGraph) {
    var D3Wrapper = (function () {
        function D3Wrapper(config, nodes, links) {
            var _this = this;
            if (nodes === void 0) { nodes = []; }
            if (links === void 0) { links = []; }
            this.config = config;
            this.events = new Events();
            this.nodes = nodes;
            this.links = links;
            this.working = false;
            if (this.config.isFlat()) {
                this.force = d3.layout.force();
            }
            else {
                this.force = d3.layout.force3d();
            }
            this.force.charge(this.config.charge).linkDistance(this.config.distance).size([1000, 1000]).nodes(this.nodes).links(this.links).on('tick', function () {
                _this.tick();
            });
            this.force.on("end", function () {
                _this.working = false;
            });
        }
        D3Wrapper.prototype.isWorking = function () {
            return this.working;
        };
        D3Wrapper.prototype.setNodes = function (nodes) {
            if (nodes === void 0) { nodes = []; }
            this.nodes = nodes;
            this.force.nodes(this.nodes);
        };
        D3Wrapper.prototype.setLinks = function (links) {
            if (links === void 0) { links = []; }
            this.links = links;
            this.force.links(this.links);
        };
        D3Wrapper.prototype.on = function (name, action) {
            this.events.add(name, action);
        };
        D3Wrapper.prototype.isStable = function () {
            return this.force.alpha() <= 1e-2 || false;
        };
        D3Wrapper.prototype.isCalm = function () {
            return this.force.alpha() <= 1e-1;
        };
        D3Wrapper.prototype.stabilize = function (limit) {
            if (limit === void 0) { limit = 150; }
            this.idle = true;
            var k = 0;
            while ((!this.isStable()) && (k < limit)) {
                this.force.tick(), k = k + 1;
            }
            this.idle = false;
            this.force.tick();
        };
        D3Wrapper.prototype.calmDown = function () {
            //this.stabilize(50);
        };
        D3Wrapper.prototype.shake = function () {
            if (this.working) {
                this.force.resume();
            }
            else {
                this.force.start();
            }
        };
        D3Wrapper.prototype.shakeHard = function () {
            var _this = this;
            var charge = this.force.charge();
            var distance = this.force.linkDistance();
            this.force.charge(10);
            this.force.linkDistance(0);
            this.force.start();
            setTimeout(function () {
                _this.force.charge(charge);
                _this.force.linkDistance(distance);
                _this.force.start();
            }, 1500);
        };
        D3Wrapper.prototype.tick = function () {
            this.working = true;
            if (!this.isCalm) {
                this.force.tick();
            }
            else if (!this.idle) {
                var alpha = this.force.alpha();
                this.events.emit("tick", [alpha]);
            }
        };
        // VISUAL
        D3Wrapper.prototype.setDistance = function (distance) {
            this.force.linkDistance(distance);
            this.force.start();
            //this.calmDown();
        };
        D3Wrapper.prototype.setCharge = function (charge) {
            this.force.charge(charge);
            this.force.start();
            //this.calmDown();
        };
        return D3Wrapper;
    })();
    GravityGraph.D3Wrapper = D3Wrapper;
})(GravityGraph || (GravityGraph = {}));
var Events = (function () {
    function Events() {
        this.eventsMap = {};
    }
    Events.prototype.emit = function (name, args) {
        if (this.eventsMap[name]) {
            this.eventsMap[name].apply(null, args);
        }
    };
    Events.prototype.add = function (name, action) {
        this.eventsMap[name] = action;
    };
    return Events;
})();
/// <reference path="headers/GravityGraph.d.ts" />
var GravityGraph;
(function (GravityGraph) {
    var Foci = (function () {
        function Foci() {
            this.foci = {};
            this.names = [];
        }
        Foci.prototype.addFocus = function (name) {
            if (this.names.indexOf("" + name) == -1) {
                this.names.push("" + name);
            }
            this.computeRepartition();
        };
        Foci.prototype.addAllFocus = function (key, array) {
            var _this = this;
            array.forEach(function (data) {
                if (data[key]) {
                    _this.addFocus("" + data[key]);
                }
            });
        };
        Foci.prototype.computeRepartition = function () {
            this.foci = {};
            var radius = 1000;
            var pointCount = this.names.length;
            for (var i = 0; i < pointCount; i++) {
                var name = this.names[i];
                var theta = (i / pointCount) * Math.PI * 2;
                this.foci[name] = {
                    x: (Math.cos(theta) * radius) + radius / 2,
                    y: (Math.sin(theta) * radius) + radius / 2
                };
            }
        };
        Foci.prototype.getPositionOf = function (name) {
            return this.foci["" + name];
        };
        return Foci;
    })();
    GravityGraph.Foci = Foci;
})(GravityGraph || (GravityGraph = {}));
/**
* Created by Geoffrey on 5/10/2015.
*/
/// <reference path="headers/GravityGraph.d.ts" />
var GravityGraph;
(function (GravityGraph) {
    (function (EQuality) {
        EQuality[EQuality["LOW"] = 0] = "LOW";
        EQuality[EQuality["MEDIUM"] = 1] = "MEDIUM";
        EQuality[EQuality["HIGH"] = 2] = "HIGH";
    })(GravityGraph.EQuality || (GravityGraph.EQuality = {}));
    var EQuality = GravityGraph.EQuality;
    var Utils = (function () {
        function Utils() {
        }
        Utils.prototype.isNumeric = function (item) {
            return !isNaN(parseFloat(item));
        };
        Utils.prototype.isArray = function (item) {
            return Object.prototype.toString.call(item) === "[object Array]";
        };
        Utils.prototype.isObject = function (item) {
            return Object.prototype.toString.call(item) === "[object Object]";
        };
        Utils.prototype.parseBoolean = function (item) {
            var ret = !!item;
            if (item == "true") {
                ret = true;
            }
            else if (item == "false") {
                ret = false;
            }
            return ret;
        };
        return Utils;
    })();
    GravityGraph.Utils = Utils;
})(GravityGraph || (GravityGraph = {}));
/// <reference path="headers/GravityGraph.d.ts" />
var GravityGraph;
(function (GravityGraph) {
    var Config = (function () {
        function Config(config) {
            this.U = new GravityGraph.Utils();
            this._config = config;
            this.webglAvailable = Detector.webgl;
            if (this.quality > 1 /* MEDIUM */ && !this.isWebGL()) {
                this._config.quality = "medium";
                console.warn("Degraded mode ! (slower)");
                console.warn("WebGL is disabled, your drivers, your DirectX version or your browser are outdated.");
                console.warn("Please update your software.  (https://get.webgl.org/)");
            }
        }
        Object.defineProperty(Config.prototype, "target", {
            get: function () {
                return this._config.target;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Config.prototype, "quality", {
            get: function () {
                var quality = 2 /* HIGH */;
                switch (this._config.quality) {
                    case "high":
                        quality = 2 /* HIGH */;
                        break;
                    case "medium":
                        quality = 1 /* MEDIUM */;
                        break;
                    case "low":
                        quality = 0 /* LOW */;
                        break;
                }
                return quality;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Config.prototype, "opacity", {
            get: function () {
                return parseFloat(this._config.opacity) || 1;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Config.prototype, "backgroundColor", {
            get: function () {
                return this._config.backgroundColor || 0x202020;
            },
            enumerable: true,
            configurable: true
        });
        Config.prototype.isTransparent = function () {
            return (this.U.isNumeric(this._config.opacity) && this._config.opacity >= 0 && this._config.opacity < 1);
        };
        Config.prototype.isFlat = function () {
            return this.U.parseBoolean(this._config.flat);
        };
        Object.defineProperty(Config.prototype, "flow", {
            get: function () {
                return this.U.parseBoolean(this._config.flow);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Config.prototype, "stats", {
            get: function () {
                return this.U.parseBoolean(this._config.stats);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Config.prototype, "charge", {
            get: function () {
                if (this.U.isNumeric(this._config.charge)) {
                    return this._config.charge;
                }
                else {
                    return -100;
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Config.prototype, "distance", {
            get: function () {
                if (this.U.isNumeric(this._config.distance)) {
                    return this._config.distance;
                }
                else {
                    return 60;
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Config.prototype, "colorBuilder", {
            get: function () {
                var ret = d3.scale.category20;
                switch (this._config.colorType) {
                    case "10":
                        ret = d3.scale.category10;
                        break;
                    case "20b":
                        ret = d3.scale.category20b;
                        break;
                    case "20c":
                        ret = d3.scale.category20c;
                        break;
                }
                return ret();
            },
            enumerable: true,
            configurable: true
        });
        Config.prototype.isWebGL = function () {
            return this.webglAvailable;
        };
        Object.defineProperty(Config.prototype, "shadows", {
            get: function () {
                return this.U.parseBoolean(this._config.shadows) && this.quality > 1 /* MEDIUM */ && this.isWebGL();
            },
            enumerable: true,
            configurable: true
        });
        return Config;
    })();
    GravityGraph.Config = Config;
})(GravityGraph || (GravityGraph = {}));
var GravityGraph;
(function (GravityGraph) {
    var Visualisation3D = (function () {
        function Visualisation3D(config, d3instance) {
            this.zeroVect = new THREE.Vector3();
            this.nbUpdate = 0;
            this.config = config;
            this.U = new GravityGraph.Utils();
            this.d3Instance = d3instance;
            this.events = new Events();
            this.useFoci = false;
            this.nodes = [];
            this.links = [];
            this.clouds = [];
            this.canvas = document.getElementById(this.config.target);
            this.mouse = {
                x: 0,
                y: 0
            };
            this.lights = new Array();
            var transparentRenderer = this.config.isTransparent();
            if (this.config.isWebGL()) {
                this.renderer = new THREE.WebGLRenderer({
                    canvas: this.canvas,
                    antialias: this.config.quality > 0 /* LOW */,
                    alpha: transparentRenderer,
                    devicePixelRatio: window.devicePixelRatio
                });
            }
            else {
                var renderer = new THREE.CanvasRenderer({
                    canvas: this.canvas,
                    antialias: false,
                    alpha: false,
                    devicePixelRatio: window.devicePixelRatio
                });
                this.renderer = renderer;
            }
            if (!transparentRenderer) {
                this.config.opacity = 1;
            }
            this.renderer.shadowMapEnabled = this.config.shadows;
            this.renderer.shadowMapType = THREE.PCFShadowMap;
            this.renderer.sortObjects = false;
            this.renderer.setClearColor(this.config.backgroundColor, this.config.opacity);
            this.renderer.setSize(this.canvas.width, this.canvas.height);
            this.scene = new THREE.Scene();
            this.nodeSelectAnimation = new GravityGraph.NodeSelectAnimation();
            if (this.config.quality == 2 /* HIGH */) {
                this.sphereBackground = this.addBackground();
            }
            this.addCamera();
            this.addLights();
            this.addControls();
            this.addRoot();
            this.bindEvents();
            this.onWindowResize();
            this.listenToD3();
            //this.drawAxis();
        }
        Visualisation3D.prototype.listenToD3 = function () {
            var _this = this;
            this.d3Instance.on("tick", function (alpha) {
                if (_this.useFoci) {
                    var k = 0.1 * alpha;
                    var i = 0, len = _this.nodes.length, node;
                    while (i < len) {
                        node = _this.nodes[i];
                        var x = (node.position.x || 0);
                        //console.log(x);
                        x += (_this.foci.getPositionOf(node.getData().group).x - x) * k;
                        var y = (node.position.y || 0);
                        y += (_this.foci.getPositionOf(node.getData().group).y - y) * k;
                        node.position.set(x, y, node.position.z);
                        i++;
                    }
                }
                var i = 0, len = _this.links.length;
                while (i < len) {
                    _this.links[i].update();
                    i++;
                }
                // on stabilisation
                if (_this.d3Instance.isStable()) {
                    _this.d3Working = false;
                }
                else {
                    _this.d3Working = true;
                }
                // update node selector
                if (_this.selectedNode) {
                    _this.nodeSelectAnimation.position.copy(_this.selectedNode.position);
                }
            });
        };
        Visualisation3D.prototype.separateGroups = function (separate) {
            if (separate === void 0) { separate = false; }
            this.useFoci = separate;
        };
        Visualisation3D.prototype.addCamera = function () {
            this.camera = new THREE.PerspectiveCamera(70, this.canvas.offsetWidth / this.canvas.offsetHeight, 1, 8000);
            this.camera.position.z = 400;
        };
        Visualisation3D.prototype.addRoot = function () {
            var z = (this.config.isFlat() ? 0 : 1000);
            var rootContainerPosition = new THREE.Vector3(1000, 1000, z);
            this.rootObject3D = new THREE.Object3D();
            this.rootObject3D.position.copy(rootContainerPosition).divideScalar(2).negate();
            this.rootObject3D.add(this.nodeSelectAnimation);
            this.scene.add(this.rootObject3D);
        };
        Visualisation3D.prototype.addLights = function () {
            var x, y, z;
            x = 3000;
            y = 3000;
            z = 3000;
            if (this.config.quality < 2 /* HIGH */) {
                this.scene.add(new THREE.HemisphereLight(0xffffff, 0xffffff));
            }
            else {
                this.addLight(x, y, z);
                x = -x;
                this.addLight(x, y, z, this.config.shadows);
                y = -y;
                this.addLight(x, y, z);
                x = -x;
                //this.addLight(x, y, z, false);
                z = -z;
                this.addLight(x, y, z, false);
                y = -y;
                this.addLight(x, y, z, false);
                x = -x;
                this.addLight(x, y, z, false);
            }
        };
        Visualisation3D.prototype.addLight = function (x, y, z, shadows) {
            if (shadows === void 0) { shadows = false; }
            var light = new THREE.SpotLight(0xffffff, 0.6);
            light.position.set(x, y, z);
            light.castShadow = shadows;
            light.shadowCameraNear = 200;
            //if(!this.config.isFlat()){
            var camera = this.camera;
            light.shadowCameraFar = camera.far;
            //}
            light.shadowCameraFov = 50;
            light.shadowBias = -0.00022;
            light.shadowDarkness = 0.5;
            light.shadowMapWidth = 2048;
            light.shadowMapHeight = 2048;
            this.lights.push(light);
            this.scene.add(light);
        };
        Visualisation3D.prototype.addBackground = function () {
            var sphereBackgroundWidth = 20;
            var sphereBackgroundGeo = new THREE.SphereGeometry(sphereBackgroundWidth, sphereBackgroundWidth, sphereBackgroundWidth);
            var sphereBackgroundMat = new THREE.MeshLambertMaterial({
                color: 0xa0a0a0,
                ambient: 0xffffff,
                side: 1,
                transparent: this.config.isTransparent(),
                opacity: this.config.opacity,
            });
            var sphereBackground = new THREE.Mesh(sphereBackgroundGeo, sphereBackgroundMat);
            sphereBackground.receiveShadow = this.config.shadows;
            sphereBackground.scale.set(200, 200, 200);
            this.scene.add(sphereBackground);
            return sphereBackground;
        };
        Visualisation3D.prototype.addControls = function () {
            this.controls = new THREE.OrbitControls(this.camera, this.canvas);
            this.controls.rotateSpeed = 1.0;
            this.controls.zoomSpeed = 1.2;
            this.controls.panSpeed = 0.8;
            this.controls.noZoom = false;
            this.controls.noPan = false; //this.config.isFlat();
            this.controls.staticMoving = true;
            this.controls.dynamicDampingFactor = 0.3;
        };
        Visualisation3D.prototype.drawAxis = function () {
            var xMaterial = new THREE.LineBasicMaterial({ color: 0xff0000 });
            var xGeometry = new THREE.Geometry();
            xGeometry.vertices.push(new THREE.Vector3(0, 0, 0));
            xGeometry.vertices.push(new THREE.Vector3(10000, 0, 0));
            var xAxis = new THREE.Line(xGeometry, xMaterial);
            var yMaterial = new THREE.LineBasicMaterial({ color: 0x00ff00 });
            var yGeometry = new THREE.Geometry();
            yGeometry.vertices.push(new THREE.Vector3(0, 0, 0));
            yGeometry.vertices.push(new THREE.Vector3(0, 10000, 0));
            var yAxis = new THREE.Line(yGeometry, yMaterial);
            var zMaterial = new THREE.LineBasicMaterial({ color: 0x0000ff });
            var zGeometry = new THREE.Geometry();
            zGeometry.vertices.push(new THREE.Vector3(0, 0, 0));
            zGeometry.vertices.push(new THREE.Vector3(0, 0, 10000));
            var zAxis = new THREE.Line(zGeometry, zMaterial);
            this.scene.add(xAxis);
            this.scene.add(yAxis);
            this.scene.add(zAxis);
        };
        Visualisation3D.prototype.bindEvents = function () {
            var _this = this;
            window.addEventListener('resize', function (e) {
                _this.onWindowResize();
            }, false);
            this.renderer.domElement.addEventListener('mousemove', function (e) {
                _this.onDocumentMouseMove(e);
            }, false);
            this.renderer.domElement.addEventListener('mousedown', function (e) {
                _this.onDocumentMouseDown(e);
            }, false);
            this.renderer.domElement.addEventListener('mouseup', function (e) {
                _this.onDocumentMouseUp(e);
            }, false);
            this.renderer.domElement.addEventListener('dblclick', function (e) {
                _this.events.emit("dblclick", []);
            }, false);
            this.renderer.domElement.addEventListener('contextmenu', function (e) {
                _this.events.emit("contextmenu", []);
            }, false);
            this.raycaster = new THREE.Raycaster();
            this.projectionOffset = new THREE.Vector3(0, 0, 0);
            this.intersectPlane = new THREE.Mesh(new THREE.PlaneBufferGeometry(10, 10, 2, 2), new THREE.MeshBasicMaterial({ color: 0x202020, opacity: 0.75, transparent: false }));
            this.intersectPlane.visible = false;
            this.intersectPlane.scale.set(1000, 1000, 1000);
            this.scene.add(this.intersectPlane);
        };
        Visualisation3D.prototype.onWindowResize = function () {
            var newWidth = this.renderer.domElement.parentElement.offsetWidth;
            var newHeight = this.renderer.domElement.parentElement.offsetHeight;
            this.canvas.width = newWidth;
            this.canvas.height = newHeight;
            this.canvas.style.width = newWidth + "px";
            this.canvas.style.height = newHeight + "px";
            if (!this.config.isFlat()) {
                var camera = this.camera;
                camera.aspect = newWidth / newHeight;
                camera.updateProjectionMatrix();
            }
            this.renderer.setSize(newWidth, newHeight);
        };
        Visualisation3D.prototype.onDocumentMouseMove = function (event) {
            event.preventDefault();
            var boundingRect = this.canvas.getBoundingClientRect();
            this.mouse.x = ((event.clientX - boundingRect.left) / this.canvas.offsetWidth) * 2 - 1;
            this.mouse.y = -((event.clientY - boundingRect.top) / this.canvas.offsetHeight) * 2 + 1;
            if (this.currentlySelectedObject) {
                var intersectPlane = this.getPlanIntersect();
                if (intersectPlane) {
                    intersectPlane.point.sub(this.rootObject3D.position);
                    this.currentlySelectedObject.position.copy(intersectPlane.point);
                    if (this.config.isFlat()) {
                        this.currentlyIntersectedObject.position.z = 0;
                    }
                    this.update();
                }
                return;
            }
            var intersected = this.getTargetObject();
            if (intersected) {
                if (this.currentlyIntersectedObject != intersected.object) {
                    this.currentlyIntersectedObject = intersected.object;
                    this.intersectPlane.position.copy(this.currentlyIntersectedObject.position);
                    this.intersectPlane.position.add(this.rootObject3D.position);
                    this.intersectPlane.lookAt(this.camera.position);
                    this.events.emit('nodeOvered', [event, this.currentlyIntersectedObject.getData()]);
                }
                this.canvas.style.cursor = 'pointer';
            }
            else {
                if (this.currentlyIntersectedObject) {
                    this.events.emit('nodeBlur', [event]);
                }
                this.currentlyIntersectedObject = null;
                this.canvas.style.cursor = 'auto';
            }
        };
        Visualisation3D.prototype.onDocumentMouseDown = function (event) {
            //event.preventDefault();
            var _this = this;
            if (this.isAClick) {
                this.isAClick = false;
                clearTimeout(this.dragTimout);
            }
            var target = this.getTargetObject();
            if (target) {
                this.currentlySelectedObject = target.object;
                this.isAClick = true;
                this.dragTimout = setTimeout(function () {
                    _this.isAClick = false;
                    _this.controls.enabled = false;
                    _this.getPlanIntersect();
                    _this.canvas.style.cursor = 'move';
                    if (_this.d3Instance.isStable()) {
                        _this.d3Instance.shake();
                    }
                }, 150);
            }
            else {
            }
        };
        Visualisation3D.prototype.onDocumentMouseUp = function (event) {
            //event.preventDefault();
            this.controls.enabled = true;
            if (this.currentlySelectedObject) {
                if (this.isAClick) {
                    clearTimeout(this.dragTimout);
                    this.selectNode(this.currentlyIntersectedObject, event);
                }
                else {
                    if (this.d3Instance.isStable()) {
                        this.d3Instance.shake();
                    }
                }
                this.currentlySelectedObject = null;
            }
            this.canvas.style.cursor = 'auto';
        };
        Visualisation3D.prototype.selectNode = function (node, event) {
            if (event) {
                this.events.emit('nodeSelected', [event, node.getData()]);
            }
            if (this.selectedNode) {
                this.unselectNode(this.selectedNode);
            }
            node.selected = true;
            this.selectedNode = node;
            this.nodeSelectAnimation.setPosition(node);
            this.nodeSelectAnimation.show();
            this.nodeSelectAnimation.animate();
        };
        Visualisation3D.prototype.unselectNode = function (node) {
            if (node === void 0) { node = this.selectedNode; }
            if (node) {
                node.selected = false;
                this.selectedNode = null;
                this.nodeSelectAnimation.hide();
            }
        };
        Visualisation3D.prototype.getPlanIntersect = function () {
            var vector = new THREE.Vector3(this.mouse.x, this.mouse.y, 0.5);
            vector.unproject(this.camera);
            this.raycaster.set(this.camera.position, vector.sub(this.camera.position).normalize());
            var intersects = this.raycaster.intersectObjects([this.intersectPlane]);
            if (intersects.length > 0) {
                this.projectionOffset.copy(intersects[0].point).sub(this.intersectPlane.position).add(this.rootObject3D.position);
                return intersects[0];
            }
            return null;
        };
        Visualisation3D.prototype.getTargetObject = function () {
            var vector = new THREE.Vector3(this.mouse.x, this.mouse.y, 1);
            vector.unproject(this.camera);
            this.raycaster.set(this.camera.position, vector.sub(this.camera.position).normalize());
            var intersects = this.raycaster.intersectObjects(this.nodes);
            if (intersects.length > 0) {
                return intersects[0];
            }
            else {
                return null;
            }
        };
        // -------------------------------
        Visualisation3D.prototype.start = function () {
            this.d3Instance.shake();
            this.d3Instance.stabilize();
            this.d3Working = false;
        };
        Visualisation3D.prototype.shake = function () {
            this.d3Instance.shake();
        };
        Visualisation3D.prototype.update = function () {
            this.nbUpdate++;
            //camera
            if (this.lastCameraPosition == undefined) {
                this.lastCameraPosition = this.camera.position.clone();
            }
            else if (this.camera.position.distanceTo(this.zeroVect) > 4100) {
                this.camera.position.copy(this.lastCameraPosition);
            }
            else {
                this.lastCameraPosition.copy(this.camera.position);
            }
            var i, len;
            // clouds
            i = 0, len = this.clouds.length;
            if (this.nbUpdate % 2 == 0) {
                while (i < len) {
                    //debugger;
                    if (!this.d3Working) {
                        this.clouds[i].start();
                        this.clouds[i].update();
                    }
                    else {
                        this.clouds[i].stop();
                    }
                    this.clouds[i].animate();
                    i++;
                }
            }
            // nodes
            i = 0, len = this.nodes.length;
            var target = this.camera.position.clone().sub(this.rootObject3D.position);
            /*if(this.config.quality == EQuality.LOW){
                while(i<len){
                    this.nodes[i].lookAt(target);
                    i++;
                }
            }
            */
            if (this.nbUpdate % 20 == 0) {
                i = 0, len = this.links.length;
                var link;
                while (i < len) {
                    link = this.links[i];
                    link.geometry.computeBoundingBox();
                    i++;
                }
            }
            if (this.selectedNode) {
                this.nodeSelectAnimation.update(target);
            }
        };
        Visualisation3D.prototype.render = function () {
            this.renderer.render(this.scene, this.camera);
        };
        // ----------------------------------------------------
        Visualisation3D.prototype.setForce = function (force) {
            this.d3Instance = force;
        };
        Visualisation3D.prototype.setNodes = function (nodes) {
            var _this = this;
            this.nodes.forEach(function (n) {
                _this.rootObject3D.remove(n);
            });
            this.links.forEach(function (l) {
                _this.rootObject3D.remove(l);
            });
            this.nodes = [];
            this.foci = new GravityGraph.Foci();
            var position = [];
            var flattened = nodes;
            if (this.U.isObject(nodes)) {
                flattened = [];
                for (var name in nodes) {
                    if (nodes.hasOwnProperty(name)) {
                        flattened.push(nodes[name]);
                    }
                }
            }
            flattened.forEach(function (node) {
                var n = new GravityGraph.Node3D(node, _this.config);
                _this.nodes.push(n);
                _this.rootObject3D.add(n);
                position.push(n.position);
                _this.foci.addFocus(node.group);
            });
            this.d3Instance.setNodes(position);
            this.setLinks([]);
            this.listenToD3();
            return this.nodes;
        };
        Visualisation3D.prototype.setLinks = function (links) {
            var _this = this;
            if (!this.nodes) {
                throw "setLinks : no nodes founds. You must set nodes before links";
            }
            else {
                this.links.forEach(function (l) {
                    _this.rootObject3D.remove(l);
                });
                this.links = [];
                this.clouds = [];
                this.d3Instance.setLinks([]);
                var filteredLinks = [];
                links.forEach(function (link) {
                    if (typeof link.source === "string") {
                        link.source = _this.indexOf(link.source);
                    }
                    if (typeof link.target === "string") {
                        link.target = _this.indexOf(link.target);
                    }
                    var source = _this.nodes[link.source];
                    var target = _this.nodes[link.target];
                    if (source && target && source != target) {
                        filteredLinks.push(link);
                        var link3D = new GravityGraph.Link3D(source, target, link);
                        _this.links.push(link3D);
                        if (_this.config.flow && _this.config.isWebGL() && _this.config.quality > 0 /* LOW */) {
                            var cloud = new GravityGraph.Cloud(link3D);
                            _this.clouds.push(cloud);
                            _this.rootObject3D.add(cloud);
                        }
                        _this.rootObject3D.add(link3D);
                    }
                });
                this.d3Instance.setLinks(filteredLinks);
                return this.links;
            }
        };
        Visualisation3D.prototype.indexOf = function (name) {
            var foundAt = 0, node;
            for (var i = 0; i < this.nodes.length; i++) {
                node = this.nodes[i].getData();
                if (node.name == name) {
                    foundAt = i;
                    break;
                }
            }
            return foundAt;
        };
        Visualisation3D.prototype.on = function (name, action) {
            this.events.add(name, action);
        };
        //  GETTERS / SETTERS
        Visualisation3D.prototype.getSelectedNode = function () {
            return this.selectedNode;
        };
        Visualisation3D.prototype.isOverSomething = function () {
            return !!this.getTargetObject();
        };
        return Visualisation3D;
    })();
    GravityGraph.Visualisation3D = Visualisation3D;
})(GravityGraph || (GravityGraph = {}));
/// <reference path='headers/GravityGraph.d.ts' />
var GravityGraph;
(function (GravityGraph) {
    var Text3D = (function (_super) {
        __extends(Text3D, _super);
        function Text3D(support) {
            this.support = support;
            var materialFront = new THREE.MeshBasicMaterial({ color: 0xffffff });
            var materialArray = [materialFront];
            var textGeom = new THREE.TextGeometry(support.getData().value + " >", {
                size: 3,
                height: 0,
                curveSegments: 1,
                font: "droid sans",
            });
            // font: helvetiker, gentilis, droid sans, droid serif, optimer
            // weight: normal, bold
            //var textMaterial = new THREE.MeshFaceMaterial(materialArray);
            _super.call(this, textGeom, materialFront);
            textGeom.computeBoundingBox();
            this.width = textGeom.boundingBox.max.x - textGeom.boundingBox.min.x;
            this.rotateZ(Math.PI / 2);
            this.setUnFocused();
        }
        Text3D.prototype.update = function () {
            this.position.copy(this.support.getSource().position);
            this.position.add(this.support.getTarget().position.clone().sub(this.position).divideScalar(2));
            this.lookAt(this.support.getTarget().position);
            this.rotateY(-Math.PI / 2);
        };
        Text3D.prototype.setFocused = function () {
            this.visible = true;
        };
        Text3D.prototype.setUnFocused = function () {
            this.visible = false;
        };
        return Text3D;
    })(THREE.Mesh);
    GravityGraph.Text3D = Text3D;
})(GravityGraph || (GravityGraph = {}));
/// <reference path='headers/GravityGraph.d.ts' />
var GravityGraph;
(function (GravityGraph) {
    var Link3D = (function (_super) {
        __extends(Link3D, _super);
        function Link3D(source, target, data) {
            this.data = {
                source: data.source,
                target: data.target,
                value: data.value
            };
            this.source = source;
            this.target = target;
            //this.arrow = new Arrow3D(this);
            this.text = new GravityGraph.Text3D(this);
            //this.arrow.add(this.text);
            var geometry = new THREE.Geometry();
            geometry.vertices.push(this.source.position);
            geometry.vertices.push(this.target.position);
            _super.call(this, geometry, Link3D.material);
            this.add(this.text);
            this.position = this.source.position;
        }
        Link3D.prototype.getData = function () {
            return this.data;
        };
        Link3D.prototype.setCloud = function (c) {
            this.cloud = c;
        };
        Link3D.prototype.getCloud = function () {
            return this.cloud;
        };
        Link3D.prototype.getLineLength = function () {
            return this.lineLength;
        };
        Link3D.prototype.getSource = function () {
            return this.source;
        };
        Link3D.prototype.getTarget = function () {
            return this.target;
        };
        Link3D.prototype.getArrow = function () {
            return this.arrow;
        };
        Link3D.prototype.getText = function () {
            return this.text;
        };
        Link3D.prototype.update = function () {
            this.lineLength = this.source.distanceTo(this.target);
            //this.position = (this.source.position).clone();
            //this.geometry.vertices[1] = this.target.position.clone().sub(this.source.position);
            this.geometry.verticesNeedUpdate = true;
            if (this.cloud) {
                this.cloud.update();
            }
            //this.arrow.update();
            this.text.update();
        };
        // VIEW
        Link3D.prototype.setFocused = function () {
            if (this.cloud)
                this.cloud.visible = true;
            //this.arrow.setFocused();
            this.visible = true;
            //this.text.setFocused();
        };
        Link3D.prototype.setUnFocused = function () {
            if (this.cloud)
                this.cloud.visible = false;
            //this.arrow.setUnFocused();
            this.visible = false;
            //this.text.setUnFocused();        
        };
        Link3D.material = new THREE.LineBasicMaterial({ color: 0xffffff });
        return Link3D;
    })(THREE.Line);
    GravityGraph.Link3D = Link3D;
})(GravityGraph || (GravityGraph = {}));
/// <reference path="headers/three.d.ts" />
/// <reference path="Link3D.ts" />
/// <reference path="Node3D.ts" />
var GravityGraph;
(function (GravityGraph) {
    var Arrow3D = (function (_super) {
        __extends(Arrow3D, _super);
        function Arrow3D(link) {
            this.sourcePosition = link.getSource().position;
            this.targetPosition = link.getTarget().position;
            var direction = this.targetPosition.clone().sub(this.sourcePosition);
            _super.call(this, direction.clone().normalize(), this.sourcePosition, direction.length(), Arrow3D.COLOR);
            this.changeDefaults();
        }
        Arrow3D.prototype.changeDefaults = function () {
            this.position = this.sourcePosition;
        };
        Arrow3D.prototype.update = function () {
            var direction = this.targetPosition.clone().sub(this.sourcePosition);
            this.setDirection(direction.normalize());
            var length = this.sourcePosition.distanceTo(this.targetPosition);
            var toAdd = this.targetPosition.clone().sub(this.sourcePosition).normalize().multiplyScalar(1); //length/2);
            this.position.copy(this.sourcePosition.clone().add(toAdd));
            this.setLength(length * 0.9);
        };
        Arrow3D.prototype.setFocused = function () {
            this.line.visible = true;
            this.cone.visible = true;
        };
        Arrow3D.prototype.setUnFocused = function () {
            this.line.visible = false;
            this.cone.visible = false;
        };
        Arrow3D.COLOR = 0xffffff; //0x909090;
        return Arrow3D;
    })(THREE.ArrowHelper);
    GravityGraph.Arrow3D = Arrow3D;
})(GravityGraph || (GravityGraph = {}));
/**
* Created by Geoffrey on 04/04/2015.
*/
/// <reference path='headers/GravityGraph.d.ts' />
var GravityGraph;
(function (GravityGraph) {
    "use strict";
    (function (ERelation) {
        ERelation[ERelation["INNER"] = 0] = "INNER";
        ERelation[ERelation["OUTER"] = 1] = "OUTER";
        ERelation[ERelation["INNER_OUTER"] = 2] = "INNER_OUTER";
        ERelation[ERelation["SELF"] = 3] = "SELF";
    })(GravityGraph.ERelation || (GravityGraph.ERelation = {}));
    var ERelation = GravityGraph.ERelation;
    var U = new GravityGraph.Utils();
    var Graph = (function () {
        function Graph(config) {
            var _this = this;
            this.config = new GravityGraph.Config(config);
            this.canvas = document.getElementById(this.config.target);
            this.events = new Events();
            console.info("GG : Init");
            this.force = new GravityGraph.D3Wrapper(this.config);
            this.vis3D = new GravityGraph.Visualisation3D(this.config, this.force);
            this.paused = false;
            console.info("Starting main loop.");
            if (this.config.stats) {
                this.addStats();
            }
            // bind events
            this.vis3D.on("nodeOvered", function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i - 0] = arguments[_i];
                }
                _this.events.emit("nodeOvered", args);
            });
            this.vis3D.on("nodeBlur", function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i - 0] = arguments[_i];
                }
                _this.events.emit("nodeBlur", args);
            });
            this.vis3D.on("nodeSelected", function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i - 0] = arguments[_i];
                }
                _this.events.emit("nodeSelected", args);
            });
            this.vis3D.on("dblclick", function () {
                if (!_this.vis3D.isOverSomething()) {
                    _this.resetFocus();
                }
                else {
                    _this.focusOnRelations();
                }
            });
            this.vis3D.on("contextmenu", function () {
                //this.resetFocus();
            });
            // ----------------
            this.run();
            /*this.D3Worker.postMessage({
             message : "setNodes",
             type: "array",
             content : positions
             });*/
        }
        /*
         private startD3Worker()  : void{
    
         this.D3Worker = new Worker('src/worker.js');
    
    
         this.D3Worker.onmessage = (event: MessageEvent)=>{
         if(event.data && event.data.message){
         switch (event.data.message){
         case "log":
         console.log("Worker:");
         console.log(event.data.content);
         break;
         case "tick":
         this.updateNodesPositions(event.data.content);
         break;
         default :
         console.log("Worker:");
         console.log(event.data);
         break;
         }
         }
         };
    
         this.D3Worker.onerror = (event: ErrorEvent)=>{
         console.error(event);
         };
         }*/
        /**
         * Initialise a 3D scene
         */
        Graph.prototype.setNodes = function (nodes) {
            var clone = JSON.parse(JSON.stringify(nodes));
            this.force = new GravityGraph.D3Wrapper(this.config);
            this.vis3D.setForce(this.force);
            this.nodes = this.vis3D.setNodes(clone);
        };
        Graph.prototype.setLinks = function (links) {
            var clone = JSON.parse(JSON.stringify(links));
            this.links = this.vis3D.setLinks(clone);
        };
        // main loop  
        Graph.prototype.run = function (time) {
            var _this = this;
            if (this.stats) {
                this.stats.begin();
            }
            if (!this.paused) {
                this.update();
                //TWEEN.update(time);
                this.render();
                requestAnimationFrame(function () {
                    _this.run();
                });
            }
            if (this.stats) {
                this.stats.end();
            }
        };
        Graph.prototype.update = function () {
            this.vis3D.update();
        };
        Graph.prototype.render = function () {
            this.vis3D.render();
        };
        // controls
        Graph.prototype.start = function () {
            this.vis3D.start();
        };
        Graph.prototype.pause = function () {
            this.paused = true;
        };
        Graph.prototype.resume = function () {
            this.paused = false;
        };
        // setters
        Graph.prototype.setCharge = function (charge) {
            this.force.setCharge(charge);
        };
        Graph.prototype.setDistance = function (distance) {
            this.force.setDistance(distance);
        };
        // D3
        /*
         private updateNodesPositions(positions : Array<INodeData>   ){
    
         var node_index = this.nodes.length-1;
         var positions_index = positions.length-1;
    
         while(node_index >= 0 && positions_index >= 0){
         var n = this.nodes[node_index];
         var pos = positions[positions_index];
         n.position.x = pos.x;
         n.position.y = pos.y;
         n.position.z = pos.z;
    
         node_index--;
         positions_index--;
         }
    
         }
         */
        // UTILS
        Graph.prototype.addStats = function () {
            var stats = new Stats();
            stats.setMode(0);
            stats.domElement.style.position = 'absolute';
            stats.domElement.style.left = (this.canvas.offsetLeft + 5) + "px";
            stats.domElement.style.top = (this.canvas.offsetTop + 5) + "px";
            this.canvas.parentElement.appendChild(stats.domElement);
            this.stats = stats;
        };
        // events
        Graph.prototype.on = function (name, action) {
            this.events.add(name, action);
        };
        //  --  Advenced methods  --
        Graph.prototype.selectBy = function (idkey, value) {
            for (var i = 0; i < this.nodes.length; i++) {
                var node = this.nodes[i];
                if (node.getData()[idkey] === value) {
                    this.vis3D.selectNode(node);
                    break;
                }
            }
        };
        Graph.prototype.unSelect = function () {
            this.vis3D.unselectNode();
        };
        Graph.prototype.resetFocus = function () {
            this.nodes.forEach(function (node) {
                node.setFocused();
            });
            if (this.links) {
                this.links.forEach(function (link) {
                    link.setFocused();
                    link.getText().setUnFocused();
                });
            }
        };
        Graph.prototype.focusOnRelations = function (nodes, type) {
            var _this = this;
            if (type === void 0) { type = 3 /* SELF */; }
            var relations = {
                nodes: [],
                links: []
            };
            var nodeOfGroup; // a node of the focused group for coparision with other nodes 
            if (type == 3 /* SELF */ && this.vis3D.getSelectedNode()) {
                nodeOfGroup = this.vis3D.getSelectedNode();
                relations = this.getRelationsOf(this.vis3D.getSelectedNode());
            }
            else if (nodes) {
                nodeOfGroup = nodes[0];
                nodes.forEach(function (node) {
                    var rel = _this.getRelationsOf(node);
                    relations.nodes = relations.nodes.concat(rel.nodes);
                    relations.links = relations.links.concat(rel.links);
                });
            }
            if (relations.nodes) {
                this.nodes.forEach(function (node) {
                    if (relations.nodes.indexOf(node) != -1) {
                        node.setFocused();
                    }
                    else {
                        node.setUnFocused();
                    }
                });
                this.links.forEach(function (link) {
                    if (relations.links.indexOf(link) != -1) {
                        if (type == 3 /* SELF */ || type == 2 /* INNER_OUTER */) {
                            link.setFocused();
                            link.getText().setFocused();
                        }
                        else if (type == 1 /* OUTER */ && !link.getTarget().isSameGroupOf(link.getSource())) {
                            link.setFocused();
                            link.getText().setFocused();
                        }
                        else if (type == 0 /* INNER */ && link.getTarget().isSameGroupOf(link.getSource())) {
                            link.setFocused();
                            link.getText().setFocused();
                        }
                        else {
                            link.setUnFocused();
                            link.getText().setUnFocused();
                        }
                    }
                    else {
                        link.setUnFocused();
                        link.getText().setUnFocused();
                    }
                });
            }
        };
        Graph.prototype.focusOnGroupRelations = function (relationType) {
            var _this = this;
            if (relationType === void 0) { relationType = 0 /* INNER */; }
            var nodes = [];
            if (this.vis3D.getSelectedNode()) {
                this.nodes.forEach(function (node) {
                    if (node.isSameGroupOf(_this.vis3D.getSelectedNode())) {
                        node.setFocused();
                        nodes.push(node);
                    }
                    else {
                        node.setUnFocused();
                    }
                });
                if (nodes) {
                    this.focusOnRelations(nodes, relationType);
                }
            }
        };
        Graph.prototype.separateGroups = function (separate) {
            if (separate === void 0) { separate = false; }
            this.vis3D.separateGroups(separate);
            this.force.shake();
        };
        Graph.prototype.shake = function () {
            this.vis3D.separateGroups(false);
            this.force.shakeHard();
        };
        // SEARCH / SORT
        Graph.prototype.getRelationsOf = function (node) {
            var _this = this;
            var name = this.getNameOrIndexOf(node);
            var relations = {
                nodes: [],
                links: []
            };
            if (name !== undefined) {
                this.links.forEach(function (link) {
                    var match = false;
                    if (link.getData().source == name || link.getData().target == name) {
                        var node = _this.nodes[link.getData().source];
                        if (relations.nodes.indexOf(node) == -1 && node) {
                            relations.nodes.push(node);
                        }
                        node = _this.nodes[link.getData().target];
                        if (relations.nodes.indexOf(node) == -1 && node) {
                            relations.nodes.push(node);
                        }
                        relations.links.push(link);
                    }
                });
            }
            return relations;
        };
        Graph.prototype.getNameOrIndexOf = function (node) {
            var name;
            for (var i = 0; i < this.links.length; i++) {
                var link = this.links[i];
                var source = link.getData().source;
                var target = link.getData().target;
                if (this.nodes[source] && this.nodes[source].equals(node)) {
                    name = source;
                    break;
                }
                else if (this.nodes[target] && this.nodes[target].equals(node)) {
                    name = target;
                    break;
                }
            }
            return name;
        };
        return Graph;
    })();
    GravityGraph.Graph = Graph;
})(GravityGraph || (GravityGraph = {}));
/**
 * Created by Geoffrey on 04/04/2015.
 */
/// <reference path='headers/GravityGraph.d.ts' />
/*

importScripts("../vendors/d3.js");



class D3Worker{


    private worker : IWorker;


    private force : D3.Layout.ForceLayout;

    private nodes : Array<INodeData>;

    private links : Array<ILinkData>;


    constructor( worker : IWorker ){
        this.worker = worker;


        this.worker.onmessage = (event : MessageEvent)=>{
            switch (event.data.message){
                case "setNodes" :
                    this.nodes = event.data.content;
                    this.force.nodes(this.nodes);
                    this.skipEnter();
                    break;
                case "setLinks" :
                    this.links = event.data.content;
                    this.run();
                    break;
                default :
                    break;
            }
        }

        this.init();

        this.run();
        this.worker.postMessage({
            message : "log",
            type: "string",
            content: "D3 Worker ready"
        });
    }


    private init(){
        this.force = d3.layout.force();

        this.force
            .charge(-100)
            .linkDistance(60)
            .size([100,100])
            .on('tick', ()=>{
                this.tick();
            });



    }



    private run() : void {
        if(this.nodes != undefined){
            this.force.start();
        }
    }

    private skipEnter(): void {
        this.run();
        var i = 0;
        while(this.force.alpha() > 1e-2 ){
            this.force.tick();
            i++;
        }

        this.force.stop();
    }


    private tick(){
        this.worker.postMessage({
            message : "tick",
            type: "array",
            content : this.nodes
        });
    }
}

// START


((self: IWorker) => {

    new D3Worker(self);
})(<any>self);

*/
//# sourceMappingURL=GravityGraph.js.map