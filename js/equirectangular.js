/* eslint no-var:0 */
/* global AFRAME */
'use strict';

(function() {
	var vS = 'void main() { gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);}';
	var fS = '\nuniform samplerCube cubemapTexture;\nuniform vec2 resolution;\n\nvoid main( void )\n{\n	vec2 texCoord = gl_FragCoord.xy / resolution;\n	vec2 thetaphi = ((texCoord * 2.0) - vec2(1.0)) * vec2(3.1415926535897932384626433832795, 1.5707963267948966192313216916398);\n	vec3 rayDirection = vec3(cos(thetaphi.y) * cos(thetaphi.x), sin(thetaphi.y), cos(thetaphi.y) * sin(thetaphi.x));\n	gl_FragColor = textureCube(cubemapTexture, rayDirection);\n}\n	';
	var width = 4096;
	var height = 2048;
	var sceneEl = document.querySelector('a-scene');
	var scene = sceneEl.object3D;
	var camScale = 0.15;


	var cubeCamera = new AFRAME.THREE.CubeCamera(0.01, 100000, height);
	if (window.renderOrigin) {
		cubeCamera.position.copy(window.renderOrigin);
	} else {
		cubeCamera.position.copy(sceneEl.camera.getWorldPosition());
	}
	scene.add(cubeCamera);
	var renderer = sceneEl.renderer;
	cubeCamera.updateCubeMap(renderer, scene);

	var material = new AFRAME.THREE.ShaderMaterial({

		uniforms: {
			cubemapTexture: cubeCamera.renderTarget.texture ,
			resolution: { value: new AFRAME.THREE.Vector2(width, -height) },
		},
		vertexShader: vS,
		fragmentShader: fS
	});

	window.material = material;
	window.cubeCamera = cubeCamera;

	var orthoCamera = new AFRAME.THREE.OrthographicCamera(0.5 * camScale * width / -height, 0.5 * camScale * width / height, camScale * 0.5, camScale * -0.5, 0.1, 100);
	sceneEl.camera.add(orthoCamera);
	renderer.render(scene, orthoCamera);
	var plane = new AFRAME.THREE.Mesh(new AFRAME.THREE.PlaneGeometry(camScale * width / height, camScale * 1), material);
	orthoCamera.add(plane);
	plane.position.set(0, 0, -1);

	var chromeMaterial = new AFRAME.THREE.MeshLambertMaterial({ color: 0xffffff, envMap: cubeCamera.renderTarget });
	plane.material = chromeMaterial;

	setTimeout(function () {

		plane.material = material;
		var old = renderer.getSize();

		renderer.setSize(width, height);
		renderer.render(scene, orthoCamera);
		window.open(renderer.domElement.toDataURL());
		renderer.setSize(old.width, old.height);

		sceneEl.camera.remove(orthoCamera);

	}, 100);
}());