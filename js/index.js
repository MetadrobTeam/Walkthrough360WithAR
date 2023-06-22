THREE.ColorManagement.enabled = false; // TODO: Confirm correct color management.

let glbLoader = new THREE.GLTFLoader().setDRACOLoader( new THREE.DRACOLoader().setDecoderPath( './libs/draco/gltf/' ) )
const canvasElement = document.getElementById("viewerCanvas");

let modelsList = {}

let canvasWidth = 300; 
let canvasHeight = 200; 
console.log(document.getElementsByClassName("section1")[0].clientWidth)
const ENTIRE_SCENE = 0, BLOOM_SCENE = 1;

const bloomLayer = new THREE.Layers();
bloomLayer.set( BLOOM_SCENE );

const params = {
    exposure: 0.98,
    bloomStrength: 2.01 ,
    bloomThreshold: 0.16,
    bloomRadius: 1,
    scene: 'Scene with Glow'
};

const darkMaterial = new THREE.MeshBasicMaterial( { color: 'black' } );
const materials = {};

const renderer = new THREE.WebGLRenderer( { antialias: true , canvas : canvasElement} );
renderer.setPixelRatio( window.devicePixelRatio );
renderer.setSize( canvasWidth, canvasHeight );
renderer.outputColorSpace = THREE.LinearSRGBColorSpace;
renderer.toneMapping = THREE.ReinhardToneMapping;
//   document.body.appendChild( renderer.domElement );

const scene = new THREE.Scene();
$(window).ready(()=>
{
         

          const camera = new THREE.PerspectiveCamera( 40, canvasWidth / canvasHeight, 1, 200 );
          camera.position.set( 0, 0, 20 );
          camera.lookAt( 0, 0, 0 );

          const controls = new THREE.OrbitControls( camera, renderer.domElement );
          controls.maxPolarAngle = Math.PI * 0.5;
          controls.minDistance = 1;
          controls.maxDistance = 100;
          controls.addEventListener( 'change', render );

          scene.add( new THREE.AmbientLight( 0x404040 ) );

          const renderScene = new THREE.RenderPass( scene, camera );

          const bloomPass = new THREE.UnrealBloomPass( new THREE.Vector2( canvasWidth, canvasHeight ), 1.5, 0.4, 0.85 );
          bloomPass.threshold = params.bloomThreshold;
          bloomPass.strength = params.bloomStrength;
          bloomPass.radius = params.bloomRadius;

          const bloomComposer = new THREE.EffectComposer( renderer );
          bloomComposer.renderToScreen = false;
          bloomComposer.addPass( renderScene );
          bloomComposer.addPass( bloomPass );

          const finalPass = new THREE.ShaderPass(
              new THREE.ShaderMaterial( {
                  uniforms: {
                      baseTexture: { value: null },
                      bloomTexture: { value: bloomComposer.renderTarget2.texture }
                  },
                  vertexShader: document.getElementById( 'vertexshader' ).textContent,
                  fragmentShader: document.getElementById( 'fragmentshader' ).textContent,
                  defines: {}
              } ), 'baseTexture'
          );
          finalPass.needsSwap = true;

          const finalComposer = new THREE.EffectComposer( renderer );
          finalComposer.addPass( renderScene );
          finalComposer.addPass( finalPass );

          const raycaster = new THREE.Raycaster();

          const mouse = new THREE.Vector2();

          window.addEventListener( 'pointerdown', onPointerDown );

          // const gui = new GUI();

          // gui.add( params, 'scene', [ 'Scene with Glow', 'Glow only', 'Scene only' ] ).onChange( function ( value ) {

          // 	switch ( value ) 	{

          // 		case 'Scene with Glow':
          // 			bloomComposer.renderToScreen = false;
          // 			break;
          // 		case 'Glow only':
          // 			bloomComposer.renderToScreen = true;
          // 			break;
          // 		case 'Scene only':
          // 			// nothing to do
          // 			break;

          // 	}

          // 	render();

          // } );

          // const folder = gui.addFolder( 'Bloom Parameters' );

          // folder.add( params, 'exposure', 0.1, 2 ).onChange( function ( value ) {

          // 	renderer.toneMappingExposure = Math.pow( value, 4.0 );
          // 	render();

          // } );

          // folder.add( params, 'bloomThreshold', 0.0, 1.0 ).onChange( function ( value ) {

          // 	bloomPass.threshold = Number( value );
          // 	render();

          // } );

          // folder.add( params, 'bloomStrength', 0.0, 10.0 ).onChange( function ( value ) {

          // 	bloomPass.strength = Number( value );
          // 	render();

          // } );

          // folder.add( params, 'bloomRadius', 0.0, 1.0 ).step( 0.01 ).onChange( function ( value ) {

          // 	bloomPass.radius = Number( value );
          // 	render();

          // } );

          setupScene();
            loadLightFromHDRI("./assets/footprint_court_2k.hdr");
          animate();

          function onPointerDown( event ) {

              mouse.x = ( event.clientX / canvasWidth ) * 2 - 1;
              mouse.y = - ( event.clientY / canvasHeight ) * 2 + 1;

              raycaster.setFromCamera( mouse, camera );
              const intersects = raycaster.intersectObjects( scene.children, false );
              if ( intersects.length > 0 ) {

                  const object = intersects[ 0 ].object;
                  object.layers.toggle( BLOOM_SCENE );
                  // render();

              }

          }

          window.onresize = function () {

              const width = canvasWidth;
              const height = canvasHeight;

              camera.aspect = width / height;
              camera.updateProjectionMatrix();

              renderer.setSize( width, height );

              bloomComposer.setSize( width, height );
              finalComposer.setSize( width, height );

              // render();

          };

          function animate(time)
          {
              requestAnimationFrame(animate)
              render();
          }

    
          function loadLightFromHDRI(path) {

              new THREE.RGBELoader().load(path, (texture) => {

              var envMap = pmremGenerator.fromEquirectangular(texture).texture;

              // scene.background = new THREE.Color("green");
              //   scene.environment = envMap;

              // renderer.toneMappingExposure = 0.2;
              // renderer.toneMapping = THREE.ACESFilmicToneMapping;
              scene.environment = pmremGenerator.fromScene(new THREE.RoomEnvironment(), 0.04).texture;

              texture.dispose();
              pmremGenerator.dispose();
              })
              var pmremGenerator = new THREE.PMREMGenerator(renderer);
              pmremGenerator.compileEquirectangularShader();

          }

          function setupScene() {

              scene.traverse( disposeMaterial );
              scene.children.length = 0;

              let light  = new THREE.DirectionalLight(0xffffff,5);
              light.position.set(0,10,5);
              scene.add(light);
              const path = "./assets/Park3Med/";
              const format = '.jpg';
              let urls = [
                  path + 'px' + format, path + 'nx' + format,
                  path + 'py' + format, path + 'ny' + format,
                  path + 'pz' + format, path + 'nz' + format
              ];
              let reflectionCube = new THREE.CubeTextureLoader().load( urls );
              reflectionCube.format = THREE.RGBAFormat
              let whiteMaterial = new THREE.MeshPhysicalMaterial( {
                  // map: new TextureLoader().load("./white.jpg"),
                  color: new THREE.Color(0xF4FF81),
                  metalness: 1.0,
                  roughness: 0,
                  opacity : 0.8,
                  transparent: true,
                  // envMapIntensity: 15,
                  envMap : reflectionCube
                } );
             
                glbLoader.load( 'assets/cameo_round.glb', function ( gltf ) {
                    let modelScene = gltf.scene;
                    modelScene.scale.set(5,5,5);
                    modelScene.name="currentModel";
                    scene.add(modelScene)
                    let model = scene.getObjectByName("Diamonds1")
                    console.log(model)
                    // model.traverse(item=>
                    //     {
                    //         if(item.isMesh)
                    //         {
                    //             item.material = whiteMaterial;
                    //             item.material.needsUpdate = true;
                    //             item.layers.enable( BLOOM_SCENE );
                    //         }
                    //     })
                    model.material = whiteMaterial;
                    model.material.needsUpdate = true;
                    model.layers.enable( BLOOM_SCENE );
                    modelsList["cameo_round"] = modelScene;
                    

                } );

                glbLoader.load( 'assets/cameo_rect.glb', function ( gltf ) {
                    let modelScene = gltf.scene;
                    modelScene.scale.set(8,8,8);
                    modelScene.name="currentModel";
                    // scene.add( modelScene );
                    modelsList["cameo_rect"] = modelScene;
                    let model = modelScene.getObjectByName("Chandeliear_Bulb5")
                    // console.log(modelScene);
                    model.traverse(item=>
                        {
                            if(item.isMesh)
                            {
                                item.material = whiteMaterial;
                                item.material.needsUpdate = true;
                                item.layers.enable( BLOOM_SCENE );
                            }
                        })
                    model.material = whiteMaterial;
                    model.material.needsUpdate = true;
                    model.layers.enable( BLOOM_SCENE );

                } );

              // render();

          }

          function disposeMaterial( obj ) {

              console.log(obj);
              if ( obj.material ) {

                  obj.material.dispose();

              }

          }

          

          function render() {

              switch ( params.scene ) {

                  case 'Scene only':
                      renderer.render( scene, camera );
                      break;
                  case 'Glow only':
                      renderBloom( false );
                      break;
                  case 'Scene with Glow':
                  default:
                      // render scene with bloom
                      renderBloom( true );

                      // render the entire scene, then render bloom scene on top
                      finalComposer.render();
                      break;

              }

          }

          function renderBloom( mask ) {

              if ( mask === true ) {

                  scene.traverse( darkenNonBloomed );
                  bloomComposer.render();
                  scene.traverse( restoreMaterial );

              } else {

                  camera.layers.set( BLOOM_SCENE );
                  bloomComposer.render();
                  camera.layers.set( ENTIRE_SCENE );

              }

          }

          function darkenNonBloomed( obj ) {

              if ( obj.isMesh && bloomLayer.test( obj.layers ) === false ) {

                  materials[ obj.uuid ] = obj.material;
                  obj.material = darkMaterial;

              }

          }

          function restoreMaterial( obj ) {

              if ( materials[ obj.uuid ] ) {

                  obj.material = materials[ obj.uuid ];
                  delete materials[ obj.uuid ];

              }

          }

        });

        function setModelByProductId(productID)
          {
            let currentModel = scene.getObjectByName("currentModel");
            if(currentModel) scene.remove(currentModel);
            scene.add(modelsList[productID]);

            let arPath = "assets/"+productID+".glb";
            $("#model-viewer").attr('src',arPath)
          }