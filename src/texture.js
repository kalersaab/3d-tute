import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

// Setup
const scene = new THREE.Scene();
const canvas = document.querySelector('.webgl');
const size = {
    width: window.innerWidth,
    height: window.innerHeight
};

// Camera
const camera = new THREE.PerspectiveCamera(75, size.width / size.height, 0.1, 100);
camera.position.set(6, 6, 6);
camera.lookAt(new THREE.Vector3(0, 0, 0));
scene.add(camera);

// Renderer
const renderer = new THREE.WebGLRenderer({ canvas });
renderer.setSize(size.width, size.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// Resize handling
window.addEventListener('resize', () => {
    size.width = window.innerWidth;
    size.height = window.innerHeight;
    camera.aspect = size.width / size.height;
    camera.updateProjectionMatrix();
    renderer.setSize(size.width, size.height);
});

// Fullscreen on double-click
window.addEventListener('dblclick', () => {
    const fullscreenElement = document.fullscreenElement || document.webkitFullscreenElement;
    if (!fullscreenElement) {
        canvas.requestFullscreen ? canvas.requestFullscreen() : canvas.webkitRequestFullscreen();
    } else {
        document.exitFullscreen ? document.exitFullscreen() : document.webkitExitFullscreen();
    }
});

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

// Lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
scene.add(ambientLight);

// Load texture
const textureLoader = new THREE.TextureLoader();
const chessTexture = textureLoader.load('src/texture/chess.png');
chessTexture.wrapS = THREE.ClampToEdgeWrapping;
chessTexture.wrapT = THREE.ClampToEdgeWrapping;
chessTexture.minFilter = THREE.NearestFilter;
chessTexture.magFilter = THREE.NearestFilter;

// Chessboard
const boardSize = 8;
const squareSize = 8;
const boardGeometry = new THREE.BoxGeometry(squareSize, 0.1, squareSize);
const boardMaterial = new THREE.MeshStandardMaterial({ map: chessTexture });
const board = new THREE.Mesh(boardGeometry, boardMaterial);
board.position.set(0, 0, 0);
scene.add(board);

// GLTF Loader with LoadingManager
const loadingManager = new THREE.LoadingManager();
loadingManager.onStart = () => console.log('Loading started');
loadingManager.onProgress = (item, loaded, total) => console.log(item, loaded, total);
loadingManager.onLoad = () => console.log('All assets loaded');
loadingManager.onError = (url) => console.log('Error loading', url);

const gltfLoader = new GLTFLoader(loadingManager);

const loadModel = (path, scale = 1, position = [0, 0, 0], color = 0xffffff) => {
    gltfLoader.load(path, (gltf) => {
        const model = gltf.scene;

        const uniformScale = scale * 15.6;
        model.scale.set(uniformScale, uniformScale, uniformScale);
        model.position.set(...position);

        // Traverse and apply new material color
        model.traverse((child) => {
            if (child.isMesh) {
                child.material = new THREE.MeshStandardMaterial({
                    color: color,
                    roughness: 0.4,
                    metalness: 0.2
                });
                child.castShadow = true;
            }
        });

        scene.add(model);
    });
};


// Place chess pieces (you can customize positions)
loadModel('src/model/pawn.glb', 0.5, [-3.5, 0.05, 3.5]);
loadModel('src/model/rook.glb', 0.5, [-3.5, 0.05, -3.5]);
loadModel('src/model/knight.glb', 0.5, [-1.5, 0.05, -3.5]);
loadModel('src/model/bishop.glb', 0.5, [0.5, 0.05, -3.5]);
loadModel('src/model/queen.glb', 0.5, [2.5, 0.05, -3.5]);
loadModel('src/model/king.glb', 0.5, [3.5, 0.05, -3.5]);

// Animate
const animate = () => {
    controls.update();
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
};

animate();
const pieceMap = {
    pawn: 'pawn.glb',
    rook: 'rook.glb',
    knight: 'knight.glb',
    bishop: 'bishop.glb',
    queen: 'queen.glb',
    king: 'king.glb',
  };
  
  // Chess layout for major pieces
  const layout = ['rook', 'knight', 'bishop', 'queen', 'king', 'bishop', 'knight', 'rook'];
  
  // Function to place a piece on the board
  const placePiece = (type, x, z, isWhite = true) => {
    const file = pieceMap[type];
    const modelPath = `src/model/${file}`;
    const y = 0.05;
    const scale = 0.5;
    const offsetX = x - 3.5;
    const offsetZ = z - 3.5;
    const color = isWhite ? 0xffffff : 0x555555;
    loadModel(modelPath, scale, [offsetX, y, offsetZ], color);
  };
  
  // Place white pieces
  layout.forEach((type, i) => {
    placePiece(type, i, 0, true);     // back rank
    placePiece('pawn', i, 1, true);   // pawn rank
  });
  
  // Place black pieces
  layout.forEach((type, i) => {
    placePiece(type, i, 7, false);    // back rank
    placePiece('pawn', i, 6, false);  // pawn rank
  });
  