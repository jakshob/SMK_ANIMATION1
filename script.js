//INIT

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


//LOADING
var loader = new THREE.STLLoader();


/*
loader.load('./models/headOfDavid.stl', function (geometry1) {
	console.log(geometry1);
	var material1 = new THREE.MeshLambertMaterial({ color: 0xF7F7F7 });
	var mesh2 = new THREE.Mesh(geometry1, material1);
	mesh2.position.set(0, 0, -400);
	mesh2.scale.set(1, 1, 1);

	console.log(mesh2.position);

	scene.add(mesh2);

});
*/
var models = ['./models/poseidon.stl', './models/davidAndGoliath.stl', './models/headOfDavid.stl', './models/venus.stl', './models/madonna.stl', './models/laocoon.stl'];




var material = new THREE.MeshLambertMaterial({ color: 0xF7F7F7 });

var meshList = [];
var count = 0;
/*
forEachAsync(models, function(next, modelPath) {


});*/


for (var i = 0; i < models.length; i++) {
	console.log(models[1]);

	loader.load(models[i], function (geometry) {
		console.log(models[i]);
		console.log(count);
		
		var mesh = new THREE.Mesh(geometry, material);
		mesh.position.set(count*300-600, count*30, -300-count*30);
	
		scene.add(mesh);
		meshList.push(mesh);
		count++;
	});

	
	
}



var light = new THREE.PointLight(0xFF0000, 1, 1000)
light.position.set(0, 0, -55);
scene.add(light);

var light = new THREE.PointLight(0xFFFFFF, 2, 1000)
light.position.set(0, 0, -55);
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

	

	/*
	loader.load('./models/headOfDavid.stl', function (geometry1) {
		console.log(geometry1);
		var material1 = new THREE.MeshLambertMaterial({ color: 0xF7F7F7 });
		var mesh2 = new THREE.Mesh(geometry1, material1);
		mesh2.position.set(0, 0, -400);
		mesh2.scale.set(1, 1, 1);

		

		console.log(mesh2.position);
		//scene.add(mesh2);
		scene.add(mesh2);

	});
	*/
	for (var i = 0; i < meshList.length; i++) {
		this.tl = new TimelineMax().delay(.3);
		this.tl.to(meshList[i].rotation, 2, { x: 1, ease: Expo.easeOut })
			.to(meshList[i].position, 20, { y: -2, ease: Expo.easeOut }, 0)
			.to(meshList[i].rotation, 20, { x: -1, ease: Expo.easeOut }, 2)

	}


}


window.addEventListener('click', onMouseMove);
render();
