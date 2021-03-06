console.clear();

if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .register("sw.js")
    .then((registration) => {
      console.log("sw registered !");
      console.log(registration);
    })
    .catch((error) => {
      console.log("sw registration failed !");
      console.log(error);
    });
} else {
  alert("Service Worker not supported in this browser.");
}

let container,
  camera,
  renderer,
  scene,
  coin,
  mesh,
  button,
  raycaster,
  mouse,
  controls;

/**
 * Blender's Z-axis is ThreeJS' Y-axis
 *
 */
function init() {
  container = document.querySelector(".scene");

  scene = new THREE.Scene();
  scene.background = new THREE.Color(0xf0ebf7);

  let fov = 50;
  let aspect = container.clientWidth / container.clientHeight;
  const near = 0.01;
  const far = 1000;
  camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
  camera.position.set(0, 0, 0.05);

  const ambientLight = new THREE.AmbientLight(0xf7f7f5, 0.3);
  scene.add(ambientLight);

  // const pointLight = new THREE.PointLight(0xa832a2, 1, 100);
  // pointLight.position.set(0.2, 0.25, 1.2);
  // scene.add(pointLight);

  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.setPixelRatio(window.devicePixelRatio);

  container.appendChild(renderer.domElement);

  controls = new THREE.OrbitControls(camera, renderer.domElement);

  const coinBtnGroup = new THREE.Object3D();
  scene.add(coinBtnGroup);
  coinBtnGroup.position.y = 0.005;

  let loader = new THREE.GLTFLoader();
  loader.load("./3d/lossushi_coin.gltf", function (gltf) {
    scene.add(gltf.scene);

    coin = new THREE.Object3D();
    coinBtnGroup.add(coin);

    const outerCoin = gltf.scene.getObjectByName("Cylinder");
    coin.add(outerCoin);

    const face = gltf.scene.getObjectByName("Plane"); // Cylinder001
    coin.add(face);

    //##########################################################################################//
    /*
    const imgLoader = new THREE.ImageLoader();
    imgLoader.load('./images/height_map_portrait.png', createHeightmap); // IMG_0266_bw // IMG_0030_bw // egyptian_100x104

    function createHeightmap(image) {
      // extract the data from the image by drawing it to a canvas
      // and calling getImageData
      const ctx = document.createElement('canvas').getContext('2d');
      const {width, height} = image;
      ctx.canvas.width = width;
      ctx.canvas.height = height;
      ctx.drawImage(image, 0, 0);
      const {data} = ctx.getImageData(0, 0, width, height);

      const geometry = new THREE.Geometry();
      // console.log(new THREE.Geometry());
      // console.log(new THREE.BufferGeometry());
      // const geometry = face.geometry;

      const cellsAcross = width - 1;
      const cellsDeep = height - 1;
      for (let z = 0; z < cellsDeep; ++z) {
        for (let x = 0; x < cellsAcross; ++x) {
          // compute row offsets into the height data
          // we multiply by 4 because the data is R,G,B,A but we
          // only care about R
          const base0 = (z * width + x) * 4;
          const base1 = base0 + (width * 4);

          // look up the height for the for points
          // around this cell
          const h00 = data[base0] / 32;
          const h01 = data[base0 + 4] / 32;
          const h10 = data[base1] / 32;
          const h11 = data[base1 + 4] / 32;
          // compute the average height
          const hm = (h00 + h01 + h10 + h11) / 4;

          // the corner positions
          const x0 = x;
          const x1 = x + 1;
          const z0 = z;
          const z1 = z + 1;

          // remember the first index of these 5 vertices
          const ndx = geometry.vertices.length;

          // add the 4 corners for this cell and the midpoint
          geometry.vertices.push(
            new THREE.Vector3(x0, h00, z0),
            new THREE.Vector3(x1, h01, z0),
            new THREE.Vector3(x0, h10, z1),
            new THREE.Vector3(x1, h11, z1),
            new THREE.Vector3((x0 + x1) / 2, hm, (z0 + z1) / 2),
          );

          //      2----3
          //      |\  /|
          //      | \/4|
          //      | /\ |
          //      |/  \|
          //      0----1

          // create 4 triangles
          geometry.faces.push(
            new THREE.Face3(ndx    , ndx + 4, ndx + 1),
            new THREE.Face3(ndx + 1, ndx + 4, ndx + 3),
            new THREE.Face3(ndx + 3, ndx + 4, ndx + 2),
            new THREE.Face3(ndx + 2, ndx + 4, ndx + 0),
          );

          // add the texture coordinates for each vertex of each face.
          const u0 = x / cellsAcross;
          const v0 = z / cellsDeep;
          const u1 = (x + 1) / cellsAcross;
          const v1 = (z + 1) / cellsDeep;
          const um = (u0 + u1) / 2;
          const vm = (v0 + v1) / 2;
          geometry.faceVertexUvs[0].push(
            [ new THREE.Vector2(u0, v0), new THREE.Vector2(um, vm), new THREE.Vector2(u1, v0) ],
            [ new THREE.Vector2(u1, v0), new THREE.Vector2(um, vm), new THREE.Vector2(u1, v1) ],
            [ new THREE.Vector2(u1, v1), new THREE.Vector2(um, vm), new THREE.Vector2(u0, v1) ],
            [ new THREE.Vector2(u0, v1), new THREE.Vector2(um, vm), new THREE.Vector2(u0, v0) ],
          );
        }
      }

      geometry.computeFaceNormals();

      geometry.translate(width / -2, Math.PI, height / -2);
      geometry.rotateZ(Math.PI);

      const planeMaterial = new THREE.MeshPhongMaterial({color: 0xb87333});

      const basRelief = new THREE.Mesh(geometry, planeMaterial);
      
      basRelief.scale.setScalar(.00017);
      basRelief.position.y = -.01;
      basRelief.rotation.y = Math.PI;
      coin.add(basRelief);
      // console.log(basRelief)

      // face.geometry = geometry;

      // const material = new THREE.MeshPhongMaterial({color: 0xb87333});

      // face.material = material;
    }
    */
    //##########################################################################################//

    const threeMaterial = new THREE.MeshStandardMaterial({ color: 0xb87333 });
    outerCoin.material = threeMaterial;
    face.material = threeMaterial;

    // let shaderMaterial = new THREE.ShaderMaterial({
    //   fragmentShader: document.getElementById("fragmentShader").textContent
    // });
    // // coin.material = material;

    // mesh = new THREE.Mesh( coin.geometry, shaderMaterial );
    // scene.add( mesh );
    // mesh.position.x = .05;
    // const scl = .015;
    // mesh.scale.set(scl,.0009,scl);

    // coin.rotation.z = Math.PI;
    coin.rotateX(Math.PI / -2);

    //##################################  BUTTON START  #########################################//
    const btnWidth = 0.06;
    const buttonGeometry = new THREE.PlaneBufferGeometry(
      btnWidth,
      btnWidth / 3
    );

    let img = new Image();
    img.src = "./images/toss_button.png";

    const texture = new THREE.Texture(img);
    texture.magFilter = THREE.NearestFilter;
    texture.minFilter = THREE.LinearFilter;
    texture.needsUpdate = true;

    const buttonMaterial = new THREE.MeshBasicMaterial({
      color: 0x000d07,
      alphaMap: texture,
    }); // transparent: true,

    button = new THREE.Mesh(buttonGeometry, buttonMaterial);
    button.scale.x = button.scale.y = 0.5;
    button.position.y = -0.02;

    coinBtnGroup.add(button);
    //##################################  BUTTON END  ###########################################//

    const dirLight = new THREE.DirectionalLight(0xf6f5f7, 1.2);
    dirLight.position.set(0.1, 0.5, 0.4);
    dirLight.target = coin;
    scene.add(dirLight);

    const dirLightA = new THREE.DirectionalLight(0xf6f5f7, 1.2);
    dirLightA.position.set(-0.1, -0.5, -0.4);
    dirLightA.target = coin;
    scene.add(dirLightA);

    raycaster = new THREE.Raycaster();
    mouse = {};
    mouse.coordinates = new THREE.Vector2();

    requestAnimationFrame(animate);
    // renderer.render(scene, camera);
  });
}

const toss = {
  isTossed: false,
  coinRotationX: 0,
  randomRotation: 0,
  isHead: true,
  randTurn: 0,
};

const tossResult = document.querySelector("#toss-result");
const toFix = 2;

function animate(time) {
  time *= 0.001;

  // here, toss.isTossed is checking if "animation" is still ongoing
  if (toss.isTossed) {
    const normX = (coin.rotation.x / toss.coinRotationX) * 2 - 1; // normalized then to -1 -> 1
    const speed = 0.2 * Math.pow(normX, 2); // parabola
    // const speed = Math.pow(Math.abs(normX), 1.5);

    // 60 frames
    coin.rotation.x += Math.PI / (60 / 2);

    // if( toss.randTurn == (coin.rotation.x / (2*Math.PI)).toFixed() ){
    if (coin.rotation.x.toFixed(toFix) === toss.coinRotationX.toFixed(toFix)) {
      toss.isTossed = false;
      console.log(
        `(coin.rotation.x).toFixed(${toFix}) : ${coin.rotation.x.toFixed(
          toFix
        )}`
      );

      // keeps track of current side
      if (toss.isHead) {
        if ((toss.randomRotation | 0) % 2 === 1) toss.isHead = false;
      } else {
        if ((toss.randomRotation | 0) % 2 === 1) toss.isHead = true;
      }
      tossResult.innerHTML = toss.isHead ? "head" : "tail";
    }
  }

  controls.update();

  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}

init();

function onWindowResize() {
  camera.aspect = container.clientWidth / container.clientHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(container.clientWidth, container.clientHeight);
}

function raycasting(e, _event) {
  mouse.coordinates.x = (e.clientX / window.innerWidth) * 2 - 1;
  mouse.coordinates.y = -(e.clientY / window.innerHeight) * 2 + 1;

  raycaster.setFromCamera(mouse.coordinates, camera);
  const intersects = raycaster.intersectObject(button);
  if (intersects.length > 0) {
    switch (_event) {
      case "move":
        container.style.cursor = "pointer";
        break;
      case "click":
        // here, toss.isTossed is making sure ONLY ONE click per "animation"
        if (!toss.isTossed) {
          tossResult.innerHTML = "";
          toss.isTossed = true;
          toss.randomRotation =
            Math.round(Math.random() * 4) * Math.PI + Math.PI * 2;
          toss.coinRotationX = coin.rotation.x + toss.randomRotation;
          toss.randTurn = Math.round(Math.random() * 4) + 1;
        }
        break;
    }
  } else {
    container.style.cursor = "default";
  }
}

function onDocumentClick(e) {
  raycasting(e, "click");
}

function onDocumentMove(e) {
  raycasting(e, "move");
}

window.addEventListener("resize", onWindowResize);
document.addEventListener("pointerdown", onDocumentClick);
document.addEventListener("pointermove", onDocumentMove);
