import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import GUI from 'lil-gui';
import gsap from 'gsap';
const gui = new GUI({
    width:300,
    title:'Debug UI',
    closeFolders:true,
});
const canvas = document.querySelector('.webgl');
const size = {
    width: window.innerWidth,
    height: window.innerHeight
};
gui.hide()
const scene = new THREE.Scene();
window.addEventListener('dblclick', () => {
    const fullscreenElement = document.fullscreenElement || document.webkitFullscreenElement;
    if (!fullscreenElement) {
        if (canvas.requestFullscreen) {
            canvas.requestFullscreen();
        } else if (canvas.webkitRequestFullscreen) {
            canvas.webkitRequestFullscreen();
        }
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        }
    }
}
)
// const geometry = new THREE.SphereGeometry(1, 32,32);
// const geometry = new THREE.BufferGeometry();
// const count = 100;
// const positions = new Float32Array(count * 9);
// for (let i = 0; i < count * 9; i++) {
    //     positions[i] = (Math.random() - 0.5) * 4;
    // }
    // const positionAttribute = new THREE.BufferAttribute(positions, 3);
    //  geometry.setAttribute('position', positionAttribute);
const guiprops = { val: 12 };
guiprops.color = 0xff0000
guiprops.segment = 5;
const posifolder = gui.addFolder('Position');
const geometry = new THREE.BoxGeometry(1, 1, 1,guiprops.segment,guiprops.segment,guiprops.segment);
const material = new THREE.MeshBasicMaterial({ color: guiprops.color , wireframe: true });
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);
posifolder.add(mesh.position,'x').min(-3).max(3).step(0.01).name('X Position');
posifolder.add(mesh.position,'y').min(-3).max(3).step(0.01).name('Y Position');
posifolder.add(mesh.position,'z').min(-3).max(3).step(0.01).name('Z Position');
gui.add(guiprops, 'val').min(0).max(100).step(1).name('Value');
gui.add(material, 'wireframe').name('Wireframe');
gui.add(mesh, 'visible').name('Visible');
gui.addColor(guiprops, 'color').name('Color').onChange(() => {
    material.color.set(guiprops.color);
});
guiprops.spin = () => {
    gsap.to(mesh.rotation, {
        duration: 1,
        y: mesh.rotation.y + Math.PI * 2,
        delay:2
    });
}
gui.add(guiprops, 'spin').name('Spin');
gui.add(guiprops, 'segment').onChange(()=>{
    geometry.dispose();
    const newGeometry = new THREE.BoxGeometry(1,1,1, guiprops.segment,guiprops.segment, guiprops.segment);
    
    // Assign new geometry to the mesh
    mesh.geometry = newGeometry;
}).min(1).max(10).step(1);
const camera = new THREE.PerspectiveCamera(75, size.width / size.height);
camera.position.set(0, 0, 3); 
camera.lookAt(mesh.position);
scene.add(camera);

const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
window.addEventListener('resize', () => {
    size.width = window.innerWidth;
    size.height = window.innerHeight;

    camera.aspect = size.width / size.height;
    camera.updateProjectionMatrix();

    renderer.setSize(size.width, size.height);
})
const renderer = new THREE.WebGLRenderer({ canvas: canvas });
renderer.setSize(size.width, size.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
const clock = new THREE.Clock();

const tick = () => {
    controls.update(); // Required if enableDamping = true
    renderer.render(scene, camera);
    requestAnimationFrame(tick);
};

tick();
