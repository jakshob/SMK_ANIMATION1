
var camera, scene, renderer, controls;
var raycaster;
var mouse;
var textureList = [];
var meshList = [];
var imgMeshList = [];
var startPos = [];
var imgStartPos = [];
var dimensions = [];
var ANIMATION_TIME = 30;
init();
animate();

function init() {
	console.log("statue");
	//scene
	scene = new THREE.Scene();

	//camera
	camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000)
	camera.position.z = 5;

	//renderer
	renderer = new THREE.WebGLRenderer({ antialias: true });
	renderer.setClearColor("0xffffff");
	renderer.setSize(window.innerWidth, window.innerHeight);

	document.body.appendChild(renderer.domElement);

	window.addEventListener('resize',
		() => {
			renderer.setSize(window.innerWidth, window.innerHeight);
			camera.aspect = window.innerWidth / window.innerHeight;

			camera.updateProjectionMatrix();
		})

	
	//LIGHTS

	var light = new THREE.HemisphereLight(0xffffbb, 0x080820, 1);
	scene.add(light);

	//LOADING IMAGE DATA

	//Making a random string to make random highlight URL random.
	function makeid(length) {
		var result = '';
		var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
		var charactersLength = characters.length;
		for (var i = 0; i < length; i++) {
			result += characters.charAt(Math.floor(Math.random() * charactersLength));
		}
		return result;
	}

	var random = makeid(5);

	//HTTP-request
	var request = new XMLHttpRequest();

	//This URL asks SMKs server for random highlights based on a random string. If you want to make a universe based on something else change the URL
	//request.open('GET', 'https://api.smk.dk/api/v1/art/search/?keys=*&offset=0&rows=32&randomHighlights=' + random, true);
	

	request.open('GET', 'https://api.smk.dk/api/v1/art/search/?keys=statue&offset=0&rows=32', true)
	//This will happen when the request gets a response from SMKs server.
	request.onload = function() {

		// Begin accessing JSON data here
		var data = JSON.parse(this.response);
		if (request.status >= 200 && request.status < 400) {

			//adding the information need to an array. We only want data with dimensions and image thumbnails in this project
			data.items.forEach(image => {
				if (image['dimensions'] && image.image_thumbnail !== undefined) {
					if (image.dimensions[0] && image.dimensions[1]) {
						textureList.push(image.image_thumbnail);
						if (image.dimensions[0].unit === "mm") dimensions.push({ width: image.dimensions[1].value, height: image.dimensions[0].value });
						if (image.dimensions[0].unit === "cm") dimensions.push({ width: image.dimensions[1].value * 10, height: image.dimensions[0].value * 10 });
						//console.log("ja");
					}
					
				}


			});
		} else {
			const errorMessage = document.createElement('marquee');
			errorMessage.textContent = `HTTP-request failure`;
			app.appendChild(errorMessage);
		}

		
		//box geometry
		var boxGeometry = new THREE.BoxBufferGeometry(40, 40, 40);

		//Looping through the textureList to make the image objects. 
		for (var i = 0; i < textureList.length; i++) {

			var textureApi = new THREE.TextureLoader().load(textureList[i]);
			var boxMaterial = new THREE.MeshPhongMaterial({
				specular: 0xffffff,
				flatShading: true,
				map: textureApi
			});
			var boxMesh = new THREE.Mesh(boxGeometry, boxMaterial);

			//Generating random number for position in the scene
			var randX = randomNumber(-200, 200);
			var randY = randomNumber(200, 8000);
			var randZ = randomNumber(-700, -100);
			var randSpeed = randomNumber(0.1, 0.5);

			//Pushing the start position to a list
			imgStartPos.push({ x: randX, y: randY, z: randZ, speed: randSpeed });

			//Setting the meshes to the position just made
			boxMesh.position.set(randX, randY, randZ);

			//scaling the images to their dimensions. If the images are big we scale them to half their size
			if (dimensions[i].width > 1000 || dimensions[i].height > 1000) {
				boxMesh.scale.set(dimensions[i].width / 400, dimensions[i].height / 400, 0.01);
			}
			else boxMesh.scale.set(dimensions[i].width/200, dimensions[i].height/200, 0.01);

			//add the mesh to the scene and to a list
			scene.add(boxMesh)
			imgMeshList.push(boxMesh);
		}

	}

	//Send request, when the request gets the response, everything in the onload function will happen
	request.send();
	
	//LOADING 3D objects
	var loader = new THREE.STLLoader();

	//Makes a list with the 3D models, which currently are not available in the API
	var models = ['./models/poseidon_mod.stl', './models/1.stl', './models/2.stl', './models/3.stl', './models/4.stl',
		'./models/5.stl', './models/6.stl', './models/7.stl', './models/8.stl', './models/9.stl',
		'./models/10.stl', './models/11.stl', './models/12.stl', './models/13.stl', './models/14.stl',
		'./models/16.stl', './models/17.stl', './models/18.stl', './models/19.stl', './models/20.stl',
		'./models/21.stl', './models/22.stl', './models/23.stl', './models/24.stl', './models/25.stl',
		'./models/26.stl', './models/27.stl', './models/28.stl', './models/29.stl', './models/30.stl',
		'./models/31.stl', './models/32.stl'];

	var material = new THREE.MeshLambertMaterial({ color: 0xF7F7F7 });

	//Loop through the 3d models just like with the images
	for (var i = 0; i < models.length; i++) {

		loader.load(models[i], function (geometry) {
			var randX = randomNumber(-200, 200);
			var randY = randomNumber(200, 8000);
			var randZ = randomNumber(-700, -100);
			var randEnd = randomNumber(-300, -200)
			var randSpeed = randomNumber(0.1, 0.5);

			startPos.push({ x: randX, y: randY, z: randZ, endY: randEnd, speed: randSpeed });
			var mesh = new THREE.Mesh(geometry, material);
			mesh.position.set(randX, randY, randZ);

			scene.add(mesh);
			meshList.push(mesh);
		});
	}
	
}

function randomNumber(min, max) {
	return Math.random() * (max - min) + min;
}

function animate() {
	requestAnimationFrame(animate);

	for (var i = 0; i < imgMeshList.length; i++) {

		imgMeshList[i].rotation.x -= 0.01 * imgStartPos[i].speed;
		imgMeshList[i].rotation.y += 0.01 * imgStartPos[i].speed;
		imgMeshList[i].rotation.z -= 0.01 * imgStartPos[i].speed;
		if (imgMeshList[i].position.y < -400) imgMeshList[i].position.y = imgStartPos[i].y;
		else imgMeshList[i].position.y -= imgStartPos[i].speed;
	
	}

	for (var i = 0; i < meshList.length; i++) {
		meshList[i].rotation.x -= 0.01 * startPos[i].speed ;
		meshList[i].rotation.y += 0.01 * startPos[i].speed ;
		meshList[i].rotation.z -= 0.01 * startPos[i].speed;
		if (meshList[i].position.y < -400) meshList[i].position.y = startPos[i].y;
		else meshList[i].position.y -= startPos[i].speed;
		
	}
	renderer.render(scene, camera);
}

/*
function getNonZeroRandomNumber() {
	var random = Math.floor(Math.random() * 19) - 9;
	if (random == 0) return getNonZeroRandomNumber();
	return random;
}*/


//This part can be used if you want to make timeline based animations

/*
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
	

}

window.addEventListener('click', onMouseMove);
*/