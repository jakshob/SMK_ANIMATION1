
var camera, scene, renderer, controls;
var raycaster;
var mouse;
var textureList = [];
var meshList = [];
var imgMeshList = [];
var startPos = [];
var ANIMATION_TIME = 30;
init();
animate();

function init() {
	scene = new THREE.Scene();

	camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000)
	camera.position.z = 5;

	renderer = new THREE.WebGLRenderer({ antialias: true });
	renderer.setClearColor("#F7F7F7");
	renderer.setSize(window.innerWidth, window.innerHeight);

	document.body.appendChild(renderer.domElement);

	window.addEventListener('resize',
		() => {
			renderer.setSize(window.innerWidth, window.innerHeight);
			camera.aspect = window.innerWidth / window.innerHeight;

			camera.updateProjectionMatrix();
		})

	raycaster = new THREE.Raycaster();
	mouse = new THREE.Vector2();

//LOADING IMAGE DATA

//Making a random string to make random highlight URL random.
/*function makeid(length) {
	var result = '';
	var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	var charactersLength = characters.length;
	for (var i = 0; i < length; i++) {
		result += characters.charAt(Math.floor(Math.random() * charactersLength));
	}
	return result;
}

var random = makeid(5);*/


	/*var request = new XMLHttpRequest();
	
	request.open('GET', 'https://api.smk.dk/api/v1/art/search/?keys=lundbye&offset=0&rows=10', true);
	request.onload = function() {
		// Begin accessing JSON data here

		var data = JSON.parse(this.response);
		if (request.status >= 200 && request.status < 400) {

			data.items.forEach(image => {
				if (image.image_native === undefined) {
					console.log("nej");


				} else {
					textureList.push(image.image_native);
					console.log("ja");
				}


			});
		} else {
			const errorMessage = document.createElement('marquee');
			errorMessage.textContent = `Gah, it's not working!`;
			app.appendChild(errorMessage);
		}
		/*
		//Spheres
		var sphereGeometry = new THREE.BoxBufferGeometry(40, 40, 40);
		for (var i = 0; i < textureList.length; i++) {
			console.log(textureList[i]);
			var textureApi = new THREE.TextureLoader().load(textureList[i]);
			var sphereMaterial = new THREE.MeshPhongMaterial({
				specular: 0xffffff,
				flatShading: true,
				map: textureApi
			});
			var sphereMesh = new THREE.Mesh(sphereGeometry, sphereMaterial);
			sphereMesh.position.set(2, 2, -100);
			sphereMesh.rotation.set(2 * i, 2 * i, 4 * i);
			scene.add(sphereMesh)
			imgMeshList.push(sphereMesh);
		}*/

	//}
	//request.send();
	
	//LOADING 3D objects
	var loader = new THREE.STLLoader();
	
	var models = ['./models/poseidon_mod.stl'/*, './models/davidAndGoliath.stl', './models/headOfDavid.stl', './models/venus.stl', './models/madonna.stl', './models/laocoon.stl'*/];

	var material = new THREE.MeshLambertMaterial({ color: 0xF7F7F7 });
	
	var count = 0;

	

	for (var i = 0; i < 60; i++) {


		
		loader.load(models[0], function (geometry) {
			var randX = randomNumber(-300, 300);

			var randY = randomNumber(0, 4000);

			var randZ = randomNumber(-700, -100);

			var randEnd = randomNumber(-300, -200)

			var randSpeed = randomNumber(0.1, 1);

			startPos.push({ x: randX, y: randY, z: randZ, endY: randEnd, speed: randSpeed });

			console.log(models[i]);
			console.log(count);
			console.log("x: " + randX + " y: " +  randY + " z: " + randZ);
			var mesh = new THREE.Mesh(geometry, material);
			mesh.position.set(randX, randY, randZ);

			scene.add(mesh);
			meshList.push(mesh);
			count++;
		});
	}

	

	//LIGHTS
	var light = new THREE.PointLight(0xFF0000, 1, 1000)
	light.position.set(0, 0, -155);
	scene.add(light);

	var light = new THREE.PointLight(0xFFFFFF, 2, 1000)
	light.position.set(0, 0, -155);
	scene.add(light);
}

function randomNumber(min, max) {
	return Math.random() * (max - min) + min;
}

function animate() {
	requestAnimationFrame(animate);
	
	for (var i = 0; i < meshList.length; i++) {
		meshList[i].rotation.x -= 0.01 * startPos[i].speed ;
		meshList[i].rotation.y += 0.01 * startPos[i].speed ;
		meshList[i].rotation.z -= 0.01 * startPos[i].speed;
		meshList[i].position.y -= startPos[i].speed;
	}
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
	for (var i = 0; i < meshList.length; i++) {
		meshList[i].position.y += 1;
	}

	/*
	for (var i = 0; i < meshList.length; i++) {
		this.tl = new TimelineMax().delay(.3);
		this.tl.to(meshList[i].position, ANIMATION_TIME, { y: startPos[i].endY }, 0)
			.to(meshList[i].rotation, ANIMATION_TIME/2, { z: -1, ease: Expo.easeOut }, 0)
			.to(meshList[i].rotation, ANIMATION_TIME / 2, { z: 1, ease: Expo.easeOut }, 15)
			.to(meshList[i].rotation, ANIMATION_TIME / 2, { y: -1, ease: Expo.easeOut }, 0)
			.to(meshList[i].rotation, ANIMATION_TIME / 2, { y: 1, ease: Expo.easeOut }, 15)
			.to(meshList[i].position, 0, { y: startPos[i].y, ease: Expo.easeOut }, ANIMATION_TIME)
			.to(meshList[i].position, ANIMATION_TIME, { y: -250, ease: Expo.easeOut }, ANIMATION_TIME)

	}

	for (var i = 0; i < imgMeshList.length; i++) {
		this.tl = new TimelineMax().delay(.3);
		this.tl.to(imgMeshList[i].rotation, 20, { x: 4, ease: Expo.easeOut })
			

	}
	*/

}

window.addEventListener('click', onMouseMove);
