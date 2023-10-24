import { SVGLoader } from 'three/addons/loaders/SVGLoader.js';

import * as THREE from 'three';
//import { TextGeometry } from '../../three.js-master/';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import Stats from 'three/addons/libs/stats.module.js';

/////// STATS /////////////////////////
let container, stats;
stats = new Stats();
container = document.createElement( 'div' );
container.setAttribute("id", "stats");
document.body.appendChild( container );
container.appendChild( stats.dom );


// RENDERER
const renderer = new THREE.WebGLRenderer({ alpha: true });
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.setClearColor(0xFFFFFF, .55);
renderer.domElement.id = "threeD-thingy";
document.body.appendChild( renderer.domElement );


//Create a WebGLRenderer and turn on shadows in the renderer
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap; // default THREE.PCFShadowMap

// CAMERA
const camera = new THREE.PerspectiveCamera( 40, window.innerWidth / window.innerHeight, 1, 10000 );
camera.position.set( 55, 162, 48 );

const controls = new OrbitControls( camera, renderer.domElement );
controls.target.set( 0, 0.5, 0 );
controls.update();
controls.enablePan = false;
controls.enableDamping = true;



// SCENE
const scene = new THREE.Scene();

// FOG
// scene.fog = new THREE.Fog( 0xcccccc, 10, 450 );

// CONTENT
// Light
const light = new THREE.AmbientLight( 0x404040 ); // soft white light
scene.add( light );

// Point Light
window.pointLight = new THREE.PointLight( 0xff0000, .9, 100 );
pointLight.position.set( 10, 7, 30 );
pointLight.castShadow = true; // default false
scene.add( pointLight );


/**
 * SVG START!
 */

// instantiate a loader
const loader = new SVGLoader();
let group;
let mesh;

// load a SVG resource
loader.load(
	// resource URL
	'img/design-logo(1).svg',
	// called when the resource is loaded
	function ( data ) {

		const paths = data.paths;
		group = new THREE.Group();

		for ( let i = 0; i < paths.length; i ++ ) {

			const path = paths[ i ];

			const material = new THREE.MeshBasicMaterial( {
				color: path.color,
				side: THREE.DoubleSide,
				depthWrite: false
			} );

			const shapes = SVGLoader.createShapes( path );

			for ( let j = 0; j < shapes.length; j ++ ) {

				const shape = shapes[ j ];
				const geometry = new THREE.ShapeGeometry( shape );
				mesh = new THREE.Mesh( geometry, material );
				
                
                mesh.scale.set(0.2, 0.2, 0);

                mesh.position.set(-40, -10, 0);
                mesh.rotation.x = 45;
                mesh.rotation.y = 0;
                mesh.rotation.z = -45;

                group.add( mesh );

			}

		}

        group.scale.y *= -1;
        // group.scale.y = group.scale.y * -1;
		scene.add( group );

	},
	// called when loading is in progresses
	function ( xhr ) {

		console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );

	},
	// called when loading has errors
	function ( error ) {

		console.log( 'An error happened' );

	}
);


//////////////// RESIZE //////////////////////////////
window.addEventListener( 'resize', onWindowResize );
function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );

}
/////////////////////////////////////////////




/// RENDER WITH ANIMATION CAPABILITY
setTimeout(function(){

    renderer.setAnimationLoop( animation );
//renderer.render( scene, camera );

}, 1000);

function animation( time ) {

    // cube.rotation.x = time / 2000;
    // cube.rotation.y = time / 1000;
    // torus.rotation.y = time / 2000;

    group.rotation.y = time / 1000;

    stats.update();
    renderer.render( scene, camera );

}