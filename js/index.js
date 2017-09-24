var camera, scene, renderer;
var texture_placeholder,
  isUserInteracting = false,
  onMouseDownMouseX = 0, onMouseDownMouseY = 0,
  lon = 0, onMouseDownLon = 0,
  lat = 0, onMouseDownLat = 0,
  phi = 0, theta = 0,
  initialDistance = 500;
distance = initialDistance;

function loadVideo(file) {

  $('#menu').hide();
  $('#container').show();

  init(file);
  animate();

}

function init(file) {

  var container, mesh;
  container = document.getElementById('container');
  camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 1100);
  camera.target = new THREE.Vector3(0, 0, 0);
  scene = new THREE.Scene();
  var geometry = new THREE.SphereBufferGeometry(initialDistance, 60, 40);
  geometry.scale(-1, 1, 1);
  var video = document.createElement('video');
  //video.width = 640;
  //video.height = 360;
  video.autoplay = true;
  video.loop = true;
  video.setAttribute('crossorigin', 'anonymous');
//				video.src = "video/GoPro-VR-Tahiti-Surf.mp4";
//				video.src = "video/Apartment_tour.mp4";
  video.src = file;
  var texture = new THREE.VideoTexture(video);
  texture.minFilter = THREE.LinearFilter;
  texture.format = THREE.RGBFormat;

  var material = new THREE.MeshBasicMaterial({map: texture});

  mesh = new THREE.Mesh(geometry, material);

  scene.add(mesh);

  renderer = new THREE.WebGLRenderer();
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(1280, 720);
  container.appendChild(renderer.domElement);

  $(document).on("mousedown", onDocumentMouseDown);
  $(document).on("mousemove", onDocumentMouseMove);
  $(document).on("mouseup", onDocumentMouseUp);
  $(document).on("mousewheel", onDocumentMouseWheel);
  $(document).on("MozMousePixelScroll", onDocumentMouseWheel);

  //
  $(window).on('resize', onWindowResize);


  $(document).keyup(function(e) {
    if (e.keyCode == 27) {

    }
  });

}

function onWindowResize() {

  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  //renderer.setSize( window.innerWidth, window.innerHeight );

}

function onDocumentMouseDown(event) {

  event.preventDefault();

  isUserInteracting = true;

  onPointerDownPointerX = event.clientX;
  onPointerDownPointerY = event.clientY;

  onPointerDownLon = lon;
  onPointerDownLat = lat;

}

function onDocumentMouseMove(event) {

  if (isUserInteracting === true) {

    lon = (onPointerDownPointerX - event.clientX) * 0.1 + onPointerDownLon;
    lat = -(event.clientY - onPointerDownPointerY) * 0.1 + onPointerDownLat;

  }

}

function onDocumentMouseUp(event) {

  isUserInteracting = false;

}

function onDocumentMouseWheel(event) {

  // WebKit

  if (event.wheelDeltaY) {

    distance -= event.wheelDeltaY * 0.1;

    // Opera / Explorer 9

  } else if (event.wheelDelta) {

    distance -= event.wheelDelta * 0.1;

    // Firefox

  } else if (event.detail) {

    distance += event.detail * 1.0;

  }

  if (distance > initialDistance) {
    distance = initialDistance
  }

  if (distance < 0) {
    distance = 1
  }

}

function animate() {

  requestAnimationFrame(animate);
  update();

}

function update() {

  lat = Math.max(-89.9, Math.min(89.9, lat));
  phi = THREE.Math.degToRad(90 - lat);
  theta = THREE.Math.degToRad(lon);

  camera.position.x = distance * Math.sin(phi) * Math.cos(theta);
  camera.position.y = distance * Math.cos(phi);
  camera.position.z = distance * Math.sin(phi) * Math.sin(theta);

  camera.lookAt(camera.target);

  renderer.render(scene, camera);

}
