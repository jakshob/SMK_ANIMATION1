
var camera, scene, renderer, controls;
var raycaster;
var mouse;
var textureList = [];
var meshList = [];
var imgMeshList = [];
init();
animate();

function init() {
	scene = new THREE.Scene();

	camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
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


	var request = new XMLHttpRequest();
	
	request.open('GET', 'https://api.smk.dk/api/v1/art/search/?keys=lundbye&offset=0&rows=1', true);
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
		}

	}
	request.send();

	//LOADING 3D objects
	var loader = new THREE.STLLoader();
	
	var models = ['./models/poseidon.stl', './models/davidAndGoliath.stl', './models/headOfDavid.stl', './models/venus.stl', './models/madonna.stl', './models/laocoon.stl'];

	var material = new THREE.MeshLambertMaterial({ color: 0xF7F7F7 });
	
	var count = 0;
	
	for (var i = 0; i < models.length; i++) {
		

		loader.load(models[i], function (geometry) {
			console.log(models[i]);
			console.log(count);

			var mesh = new THREE.Mesh(geometry, material);
			mesh.position.set(count * 300 - 600, Math.random() * 100, -300 - count * 30);

			scene.add(mesh);
			meshList.push(mesh);
			count++;
		});
	}

	

	//LIGHTS
	var light = new THREE.PointLight(0xFF0000, 1, 1000)
	light.position.set(0, 0, -55);
	scene.add(light);

	var light = new THREE.PointLight(0xFFFFFF, 2, 1000)
	light.position.set(0, 0, -55);
	scene.add(light);
}


function animate() {
	requestAnimationFrame(animate);

	renderer.render(scene, camera);
}

function getNonZeroRandomNumber() {
	var random = Math.floor(Math.random() * 19) - 9;
	if (random == 0) return getNonZeroRandomNumber();
	return random;
}

function onMouseMove(event) {
	event.preventDefault();
	
	console.log(textureList);

	mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
	mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;
	
	for (var i = 0; i < meshList.length; i++) {
		this.tl = new TimelineMax().delay(.3);
		this.tl.to(meshList[i].rotation, 2, { x: 1*i, ease: Expo.easeOut })
			.to(meshList[i].position, 20, { y: -200, ease: Expo.easeOut }, 0)
			.to(meshList[i].rotation, 20, { y: 1, ease: Expo.easeOut }, 2)
			.to(meshList[i].rotation, 20, { x: -1, ease: Expo.easeOut }, 12)

	}

	for (var i = 0; i < imgMeshList.length; i++) {
		this.tl = new TimelineMax().delay(.3);
		this.tl.to(imgMeshList[i].rotation, 20, { x: 4, ease: Expo.easeOut })
			

	}


}

window.addEventListener('click', onMouseMove);
