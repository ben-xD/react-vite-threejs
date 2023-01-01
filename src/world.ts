import * as THREE from "three";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import {BufferGeometry} from "three";
import * as Stats from 'stats.js';
import * as dat from 'dat.gui';

export class World {
    private renderer: THREE.WebGLRenderer
    private readonly scene: THREE.Scene;
    private clock: THREE.Clock
    private readonly camera: THREE.PerspectiveCamera;
    private width: number;
    private height: number;
    private scale: number;
    private gui: dat.GUI;
    private stats: Stats;

    constructor(body: HTMLElement, private canvas?: HTMLCanvasElement) {
        this.gui = new dat.GUI();
        this.stats = this.createStats(body);

        this.scale = 3;
        this.height = window.innerHeight
        this.width = window.innerWidth;
        this.setupResizeListener();
        this.setupFullscreenListeners();
        // this.width = 160 * this.scale;
        // this.height = 90 * this.scale;

        this.scene = new THREE.Scene();
        this.clock = new THREE.Clock();

        this.addAxisHelper();
        this.renderer = new THREE.WebGLRenderer({canvas: canvas});
        this.renderer.setSize(this.width, this.height);
        // To avoid using higher pixel ratios which would reduce performance
        this.renderer.setPixelRatio(Math.min(2, window.devicePixelRatio));
        this.camera = this.createCamera();

        this.addLighting();

        this.addObjects();

        this.addOrbitControls();
        this.tick();
    }
    createStats(body: HTMLElement): Stats {
        const stats = new Stats();
        stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
        body.appendChild(stats.dom);
        return stats;
    }

    private createCamera = (): THREE.PerspectiveCamera => {
        const camera = new THREE.PerspectiveCamera(75, this.width / this.height);
        camera.position.z = 3;
        this.scene.add(camera);
        return camera;
    }

    private addLighting = () => {
        const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
        directionalLight.position.set(0, 0, 1)
        this.scene.add(directionalLight);

        // const ambientLight = new THREE.AmbientLight(0xffffff, 1);
        // this.scene.add(ambientLight);
    }

    private addAxisHelper = () => {
        const axesHelper = new THREE.AxesHelper(1);
        axesHelper.position.set(-2, -2, 0)
        this.scene.add(axesHelper);
    }

    tick = () => {
        this.stats.begin();
        this.renderer.render(this.scene, this.camera);
        
        // Using THREE.Clock for animation
        // mesh.rotation.y += 1 * clock.getDelta();
        // // Can't use delta time here because the value is always close to 0,
        // // and therefore the position will be set to 0 all the time.
        // mesh.position.y = Math.sin(clock.getElapsedTime());
        // // camera.lookAt(mesh.position);
        
        this.stats.end();
        requestAnimationFrame(this.tick);
    }

    close = () => {
        console.log("closed");
        this.gui.destroy();
    }

    private addObjects = () => {
        const sphere = new THREE.SphereGeometry(0.5);
        // physically-based rendering
        const material = new THREE.MeshStandardMaterial({color: '#806dde'})
        const mesh = new THREE.Mesh(sphere, material);
        mesh.position.y = -1;
        const sphere1Gui = this.gui.addFolder("Sphere 1");
        sphere1Gui.add(mesh.position, 'x').min(-2).max(2).step(0.01)
        sphere1Gui.add(mesh.position, 'y').min(-2).max(2).step(0.01)
        sphere1Gui.add(mesh.position, 'z').min(-2).max(2).step(0.01)
        this.scene.add(mesh)

        const sphere2 = new THREE.SphereGeometry(0.5);
        const material2 = new THREE.MeshPhongMaterial({color: '#806dde'})
        const mesh2 = new THREE.Mesh(sphere2, material2);
        mesh2.position.y = +1;
        this.scene.add(mesh2)

        const triangleCount = 100;
        const verticesCount = triangleCount * 3 * 3; // three vertices per triangle (3 points), 3 values per vertex (3D coordinate)
        const trianglesGeometry = new BufferGeometry()
        const triangleVertices = new Float32Array(verticesCount);
        for (let i = 0; i < verticesCount; i++) {
            triangleVertices[i] = Math.random();
        }
        const bufferAttribute = new THREE.BufferAttribute(triangleVertices, 3);
        trianglesGeometry.setAttribute('position', bufferAttribute)
        const material3 = new THREE.MeshBasicMaterial({color: '#ffc000', wireframe: true})

        const trianglesMesh = new THREE.Mesh(trianglesGeometry, material3)
        this.scene.add(trianglesMesh);

        // const geometry = new THREE.BoxGeometry(1, 1, 1);
        // const material = new THREE.MeshPhongMaterial({color: 0x806dde});
        // const mesh = new THREE.Mesh(geometry, material);
        // mesh.position.y = -2;
        // this.scene.add(mesh);

        // mesh.position.set(2, 1, -1)
        // mesh.rotation.set(Math.PI/4, 0, 0)
        mesh.rotation.set(0, Math.PI / 4, 0);
    }

    private addOrbitControls() {
        new OrbitControls(this.camera, this.renderer.domElement);
    }

    private setupResizeListener() {
        window.addEventListener('resize', (event) => {
            console.log("Resizing")
            this.height = window.innerHeight
            this.width = window.innerWidth
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(window.innerWidth, window.innerHeight);
            this.renderer.setPixelRatio(Math.min(2, window.devicePixelRatio));
        })
    }

    private setupFullscreenListeners() {
        const toggle = () => {
            try {
                if (!document.fullscreenElement) {
                    this.canvas?.requestFullscreen()
                } else {
                    document.exitFullscreen()
                }
            } catch (e) {
                console.error({e})
            }

        }
        window.addEventListener('keyup', (event) => {
            console.log(event.code)
            if (event.code == "KeyF") {
                toggle();
            }
        })

        window.addEventListener('dblclick', toggle);
    }
}