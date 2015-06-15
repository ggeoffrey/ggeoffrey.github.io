/// <reference path="../src/headers/three.d.ts" />
/// <reference path="../src/headers/detector.d.ts" />
/// <reference path="../src/headers/d3.d.ts" />
/// <reference path="../src/headers/createjs-lib.d.ts" />
declare module GravityGraph {
    class Node3D extends THREE.Mesh implements IFocusableElement {
        private static nodesColor;
        private static basicGeometry;
        private static degradedGeometry;
        private static materialsMap;
        static OPACITY: number;
        private data;
        selected: boolean;
        walked: boolean;
        private quality;
        constructor(data: INodeData, config: Config);
        private changeDefaults(config);
        static setColorMethod(colorScale: D3.Scale.OrdinalScale): void;
        static resetColorMethod(): void;
        getColor(): THREE.Color;
        setColor(color: number): void;
        getData(): INodeData;
        update(): void;
        updateTarget(position: THREE.Vector3): void;
        distanceTo(node: Node3D): number;
        equals(node: Node3D): boolean;
        isSameGroupOf(node: Node3D): boolean;
        setFocused(): void;
        setUnFocused(): void;
    }
}
declare module GravityGraph {
    class Cloud extends THREE.PointCloud {
        private static imgMap;
        private static particleMap;
        private static defaultMaterial;
        private static baseVelocity;
        private support;
        private velocity;
        private nbParticles;
        constructor(link: Link3D);
        private changeDefaults();
        update(): void;
        start(): void;
        stop(): void;
        animate(): void;
    }
}
declare module GravityGraph {
    class Text3D extends THREE.Mesh implements IFocusableElement {
        private support;
        private width;
        constructor(support: Link3D);
        update(): void;
        setFocused(): void;
        setUnFocused(): void;
    }
}
declare module GravityGraph {
    class Link3D extends THREE.Line implements IFocusableElement {
        private static material;
        private data;
        private source;
        private target;
        private lineLength;
        private config;
        private cloud;
        private arrow;
        private text;
        constructor(source: Node3D, target: Node3D, data: ILinkData, config: Config);
        getData(): ILinkData;
        setCloud(c: Cloud): void;
        getCloud(): Cloud;
        getLineLength(): number;
        getSource(): Node3D;
        getTarget(): Node3D;
        getArrow(): Arrow3D;
        getText(): Text3D;
        update(): void;
        setFocused(): void;
        setUnFocused(): void;
    }
}
declare module GravityGraph {
    interface IGraph {
        nodes: Array<Node3D>;
        links: Array<Link3D>;
    }
    interface IPoint {
        x: number;
        y: number;
    }
    interface IMouse extends IPoint {
    }
    interface IConfig {
        target: string;
        opacity?: number;
        backgroundColor?: number;
        nodes?: Array<INodeData>;
        links?: Array<ILinkData>;
        quality?: string;
        flat?: boolean;
        flow?: boolean;
        stats?: boolean;
        charge?: number;
        distance?: number;
        colorType?: string;
        shadows?: boolean;
    }
    interface INodeData {
        x?: number;
        y?: number;
        z?: number;
        group?: any;
    }
    interface ILinkData {
        source: any;
        target: any;
        value: any;
    }
    interface IFocusableElement {
        setFocused(): void;
        setUnFocused(): void;
    }
    interface IWorker extends Worker {
        postMessage(message: IWorkerMessaae, rest?: any): void;
    }
    interface IWorkerMessaae {
        message: string;
        content: any;
        config?: IConfig;
    }
}
/**
* Created by Geoffrey on 5/10/2015.
*/
declare module GravityGraph {
    enum EQuality {
        LOW = 0,
        MEDIUM = 1,
        HIGH = 2,
    }
    class Utils {
        constructor();
        isNumeric(item: any): boolean;
        isArray(item: any): boolean;
        isObject(item: any): boolean;
        parseBoolean(item: any): boolean;
    }
}
declare module GravityGraph {
    class Config {
        private static colorBuilder;
        private _config;
        private webglAvailable;
        private U;
        constructor(config: IConfig);
        target: string;
        quality: EQuality;
        opacity: number;
        backgroundColor: number;
        isTransparent(): boolean;
        isFlat(): boolean;
        flow: boolean;
        stats: boolean;
        charge: number;
        distance: number;
        colorBuilder: D3.Scale.OrdinalScale;
        resetColorBuilder(): void;
        isWebGL(): boolean;
        shadows: boolean;
    }
}
declare module GravityGraph {
    class NodeSelectAnimation extends THREE.Line {
        private animation;
        private animation2;
        private animatedObject;
        private firstExpand;
        private support;
        constructor();
        private changeDefaults();
        animate(): void;
        update(target: THREE.Vector3): void;
        setPosition(node: Node3D): void;
        show(): void;
        hide(): void;
    }
}
declare module GravityGraph {
    class Foci {
        private foci;
        private names;
        constructor();
        addFocus(name: string): void;
        addAllFocus(key: string, array: Array<any>): void;
        private computeRepartition();
        getPositionOf(name: any): IPoint;
    }
}
declare module GravityGraph {
    class Visualisation3D {
        private config;
        private canvas;
        private mouse;
        private scene;
        private renderer;
        private camera;
        private lastCameraPosition;
        private zeroVect;
        private controls;
        private sphereBackground;
        private lights;
        private rootObject3D;
        private nodes;
        private links;
        private clouds;
        private foci;
        private useFoci;
        private selectedNode;
        private nodeSelectAnimation;
        private d3Instance;
        private d3Working;
        private events;
        private U;
        constructor(config: Config, d3instance: D3Wrapper);
        private listenToD3();
        separateGroups(separate?: boolean): void;
        private addCamera();
        private addRoot();
        private addLights();
        private addLight(x, y, z, shadows?);
        addBackground(): THREE.Mesh;
        private addControls();
        private drawAxis();
        private raycaster;
        private projectionOffset;
        private intersectPlane;
        private currentlySelectedObject;
        private currentlyIntersectedObject;
        private bindEvents();
        private onWindowResize();
        private onDocumentMouseMove(event);
        private isAClick;
        private dragTimout;
        private onDocumentMouseDown(event);
        private onDocumentMouseUp(event);
        selectNode(node: Node3D, event?: MouseEvent): void;
        unselectNode(node?: Node3D): void;
        private getPlanIntersect();
        private getTargetObject();
        start(): void;
        shake(): void;
        private nbUpdate;
        update(): void;
        render(): void;
        setForce(force: D3Wrapper): void;
        setNodes(nodes: Array<any>): Node3D[];
        setLinks(links: Array<any>): Link3D[];
        private indexOf(name);
        on(name: string, action: Function): void;
        getSelectedNode(): Node3D;
        isOverSomething(): boolean;
    }
}
declare module GravityGraph {
    class D3Wrapper {
        private config;
        private nodes;
        private links;
        private force;
        private events;
        private idle;
        private working;
        constructor(config: Config, nodes?: any[], links?: any[]);
        isWorking(): boolean;
        setNodes(nodes?: Array<any>): void;
        setLinks(links?: Array<any>): void;
        on(name: string, action: Function): void;
        isStable(): boolean;
        isCalm(): boolean;
        stabilize(limit?: number): void;
        calmDown(): void;
        shake(): void;
        shakeHard(): void;
        private tick();
        setDistance(distance: number): void;
        setCharge(charge: number): void;
    }
}
declare class Events {
    private eventsMap;
    constructor();
    emit(name: string, args: Array<any>): void;
    add(name: string, action: Function): void;
}
declare module GravityGraph {
    enum ERelation {
        INNER = 0,
        OUTER = 1,
        INNER_OUTER = 2,
        SELF = 3,
    }
    class Graph {
        private config;
        private canvas;
        private paused;
        private vis3D;
        private force;
        private stats;
        private events;
        private nodes;
        private links;
        constructor(config: IConfig);
        initialize(): void;
        /**
         * Initialise a 3D scene
         */
        setNodes(nodes: Array<INodeData>, callback?: (nodes: Array<Node3D>) => void): Array<Node3D>;
        setLinks(links: Array<ILinkData>, callback?: () => void): void;
        private groupLinks(links);
        private run(time?);
        private update();
        private render();
        start(): void;
        pause(): void;
        resume(): void;
        setCharge(charge: number): void;
        setDistance(distance: number): void;
        color(name: string): string;
        private addStats();
        on(name: string, action: Function): void;
        selectBy(idkey: string, value: any): void;
        unSelect(): void;
        private resetFocus();
        focusOnRelations(nodes?: Array<Node3D>, type?: ERelation): void;
        focusOnGroupRelations(relationType?: ERelation): void;
        separateGroups(separate?: boolean): void;
        shake(): void;
        private getRelationsOf(node);
        private getNameOrIndexOf(node);
    }
}
declare module GravityGraph {
    class Arrow3D extends THREE.ArrowHelper implements IFocusableElement {
        private static COLOR;
        private sourcePosition;
        private targetPosition;
        constructor(link: Link3D);
        private changeDefaults();
        update(): void;
        setFocused(): void;
        setUnFocused(): void;
    }
}
