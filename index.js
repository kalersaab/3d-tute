const scene = new THREE.Scene();
const group = new THREE.Group();

scene.add(group);
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({color: 0x00ff00});
const mesh = new THREE.Mesh(geometry, material);
mesh.position.set(0, 0, 0);
group.add(mesh);

const geometry1 = new THREE.BoxGeometry(1, 1, 1);
const material1 = new THREE.MeshBasicMaterial({color: 0xff0000});
const mesh1 = new THREE.Mesh(geometry1, material1);
mesh1.position.set(2, 0, 0);
group.add(mesh1);

const geometry2 = new THREE.BoxGeometry(1, 1, 1);
const material2 = new THREE.MeshBasicMaterial({color: 0x0000ff});
const mesh2 = new THREE.Mesh(geometry2, material2);
mesh2.position.set(0, 2, 0);
group.add(mesh2);
const size = {
    width:700,
    height: 500
}
const camera = new THREE.PerspectiveCamera(75, size.width / size.height);
camera.position.z = 4;
camera.position.x = 0;
console.log(mesh.position.distanceTo(camera.position));
scene.add(camera);
camera.lookAt(mesh.position);
const target = document.querySelector('.wbgl');
const renderer = new THREE.WebGLRenderer({canvas:target});
renderer.setSize(size.width, size.height);
renderer.render(scene, camera);
