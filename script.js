import * as THREE from './lib/three/build/three.module.js';

import * as TweenMax from "./node_modules/gsap/umd/TweenMax.js";
//import * as STLLoader from "./node_modules/stl_loader/index.js";

var scene = new THREE.Scene();

var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
camera.position.z = 5;

var renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setClearColor("#e5e5e5");
renderer.setSize(window.innerWidth, window.innerHeight);

document.body.appendChild(renderer.domElement);

window.addEventListener('resize',
	() => {
		renderer.setSize(window.innerWidth, window.innerHeight);
		camera.aspect = window.innerWidth / window.innerHeight;

		camera.updateProjectionMatrix();
	})

var raycaster = new THREE.Raycaster();
var mouse = new THREE.Vector2();

/*
var loader = new THREE.STLLoader();
loader.load('./models/poseidon.stl', function (geometrySTL) {
	var materialSTL = new THREE.MeshPhongMaterial({ color: 0xff5533, specular: 0x111111, shininess: 200 });
	var meshSTL = new THREE.Mesh(geometrySTL, materialSTL);
	meshSTL.position.set(0, - 0.25, 0.6);
	meshSTL.rotation.set(0, - Math.PI / 2, 0);
	meshSTL.scale.set(0.5, 0.5, 0.5);
	meshSTL.castShadow = true;
	meshSTL.receiveShadow = true;
	scene.add(meshSTL);
});
*/


var geometry = new THREE.BoxGeometry(1, 1, 1);
var material = new THREE.MeshLambertMaterial({ color: 0xF7F7F7 });




var meshList = [];


var meshX = -10;
for (var i = 0; i < 15; i++) {
	var mesh = new THREE.Mesh(geometry, material);
	mesh.position.x = (Math.random() - 0.5) * 10;
	mesh.position.y = (Math.random() - 0.5) * 10;
	mesh.position.z = (Math.random() - 0.5) * 5;
	scene.add(mesh);
	meshList.push(mesh);

	meshX += 1;
}



var light = new THREE.PointLight(0xFFFFFF, 1, 1000)
light.position.set(0, 0, 0);
scene.add(light);

var light = new THREE.PointLight(0xFFFFFF, 2, 1000)
light.position.set(0, 0, 25);
scene.add(light);

var render = function () {
	requestAnimationFrame(render);

	renderer.render(scene, camera);
}

function getNonZeroRandomNumber() {
	var random = Math.floor(Math.random() * 19) - 9;
	if (random == 0) return getNonZeroRandomNumber();
	return random;
}

function onMouseMove(event) {
	event.preventDefault();

	mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
	mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;

	var geometry1 = new THREE.BoxGeometry(1, 1, 1);
	var material1 = new THREE.MeshLambertMaterial({ color: 0xF7F7F7 });
	var mesh1 = new THREE.Mesh(geometry1, material1)
	scene.add(mesh1);



	for (var i = 0; i < meshList.length; i++) {
		this.tl = new TimelineMax().delay(.3);
		this.tl.to(meshList[i].rotation, 2, { x: 1, ease: Expo.easeOut })
			.to(meshList[i].position, 20, { y: -2, ease: Expo.easeOut }, 0)
			.to(meshList[i].rotation, 2, { x: -1, ease: Expo.easeOut }, 2)

	}


}


window.addEventListener('click', onMouseMove);
render();
