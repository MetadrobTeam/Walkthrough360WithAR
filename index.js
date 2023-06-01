
let canvas, renderer,scene, cube , orbit,mainModel , cssRenderer;
let canvasElement = document.querySelector("#viewer_canvas");
let raycaster = new THREE.Raycaster();
let mouse = new THREE.Vector2();
let glbloader = new THREE.GLTFLoader();
const dracoLoader = new THREE.DRACOLoader();
dracoLoader.setDecoderPath('https://cdn.jsdelivr.net/npm/three/examples/js/libs/draco/');
glbloader.setDRACOLoader(dracoLoader);

let viewer = document.querySelector("#model-viewer")

init();


$(document).ready(function() {
    const myModel = $('#model-viewer');
  
    // Access the Shadow DOM
    const shadowRoot = myModel[0].shadowRoot;
    console.log(shadowRoot)
  
    if (shadowRoot) {
      // Find and manipulate elements within the Shadow DOM
      const canvas = $(shadowRoot).find('canvas');
      canvas.hide();
    }
  });

function init()
{

    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight,0.1,10000);



    renderer = new THREE.WebGLRenderer({canvas:canvasElement});
    // renderer.setSize($("#cardContainer").width(), $("#cardContainer").height());
    // renderer.domElement.style.zIndex = 10;
    // document.body.appendChild(renderer.domElement);

    // cssRenderer = new THREE.CSS3DRenderer();
    // cssRenderer.setSize(window.innerWidth, window.innerHeight);
    // cssRenderer.domElement.className = "cssRenderer";
    // document.body.appendChild(cssRenderer.domElement);

    camera.position.z = 5;

    orbit = new THREE.OrbitControls(camera,renderer.domElement);
    orbit.enableDamping = true;
    orbit.dampingFactor = 0.05;
    orbit.saveState();
    orbit.update()

    loadModel("assets/cameo_round.glb");
    loadLightFromHDRI("assets/footprint_court_2k.hdr");
    // createEnvironement("assets/building.jpg");
    animate();

    renderer.domElement.addEventListener("pointerup",(event)=>
    {
        // mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        // mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;
        // raycaster.setFromCamera(mouse, camera);
        // let intersection = raycaster.intersectObject(mainModel, true);
        // console.log(intersection[0].object.name);
    })


}

function createEnvironement(path)
{
    const geometry = new THREE.SphereGeometry( 500, 60, 40 );
    geometry.scale( - 1, 1, 1 );

    const texture = new THREE.TextureLoader().load( path );
    texture.colorSpace = THREE.SRGBColorSpace;
    const material = new THREE.MeshBasicMaterial( { map: texture } );

    const mesh = new THREE.Mesh( geometry, material );

    scene.add( mesh );
}

function createHotspot()
{
    const cssObject = new THREE.CSS3DObject();
    scene.add(cssObject);
    
    // Create the arrow element
    const arrowElement = document.createElement('div');
    arrowElement.className = 'arrow';
    
    // Append the arrow element to the CSS3DObject's element
    cssObject.element.appendChild(arrowElement);
    
}


function loadModel(path)
{
    if(mainModel) scene.remove(mainModel);
    glbloader.load(path, (gltf) => {
        // console.log(gltf);
        mainModel = gltf.scene;
        scene.add(mainModel);

        setEffect("Diamonds1");
    });
}

function setEffect(name)
{

    const path = "assets/Park3Med/";
    const format = '.jpg';
    let urls = [
        path + 'px' + format, path + 'nx' + format,
        path + 'py' + format, path + 'ny' + format,
        path + 'pz' + format, path + 'nz' + format
    ];
    let reflectionCube = new THREE.CubeTextureLoader().load( urls );
    reflectionCube.format = THREE.RGBAFormat;

    let whiteMaterial = new THREE.MeshPhongMaterial( {
        // map: new THREE.TextureLoader().load("assets/white.jpg"),
        color: new THREE.Color(0x79b5d4),
        metalness: 0.8,
        roughness: 0,
        // opacity: 0.8,
        side: THREE.DoubleSide,
        // transparent: true,
        // envMapIntensity: 6,
        // premultipliedAlpha: true,
        // envMap: reflectionCube,
      } );
    let object = scene.getObjectByName(name);
    if(object)
    {
        object.material = whiteMaterial;
        // object.material.transparent = true
        // object.material.envMap = reflectionCube;
        // object.material.envMapIntensity = 4;
        // object.material.opacity = 0.8

        object.material.needsUpdate = true;
    }
}

function loadLightFromHDRI(path) {

    new THREE.RGBELoader().load(path, (texture) => {

      var envMap = pmremGenerator.fromEquirectangular(texture).texture;

    //   scene.background = envMap;
    //   scene.environment = envMap;

      renderer.toneMappingExposure = 0.8;
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      scene.environment = pmremGenerator.fromScene(new THREE.RoomEnvironment(), 0.04).texture;

      texture.dispose();
      pmremGenerator.dispose();
    })
    var pmremGenerator = new THREE.PMREMGenerator(renderer);
    pmremGenerator.compileEquirectangularShader();

  }

function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
    orbit.update()
}

$(".resetBtn").on("click",()=>
{
    if(mainModel) mainModel.scale.set(1,1,1);
    if(orbit)  orbit.reset();
})

$(".uploadBtn").on("click",()=>
{
    $("#inputBox").click();
})

$(".closeBtn").on("click",()=>
{
    $(".product-card").hide();
})

$(".buyBtn").on("click",()=>
{
    
    $(".product-card").show();
})
$("#inputBox").on('change', handleFileSelection);



function handleFileSelection(event)
{
    var selectedFile = event.target.files[0];
    console.log('Selected file:', selectedFile);
    let objUrl = URL.createObjectURL(selectedFile);
    loadModel(objUrl);
}

$("#scaleSlider").on('change', handleScale);

function handleScale(event)
{
    // console.log($('#scaleSlider').val())
    setScale($('#scaleSlider').val())
}

function setScale(value)
{

    if(mainModel) mainModel.scale.set(value,value,value);
    $(".slider-value").text(value);
}