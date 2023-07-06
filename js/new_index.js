THREE.ColorManagement.enabled = false; // TODO: Confirm correct color management.

let glbLoader = new THREE.GLTFLoader().setDRACOLoader( new THREE.DRACOLoader().setDecoderPath( './libs/draco/gltf/' ) )
const canvasElement = document.getElementById("viewerCanvas");

let modelsList = {}
let materialList = {};
let deviceObjectMat = [];

let roomScene = undefined;

let roomMaterialList = {}
let roomObjectMat = [];

let canvasWidth = window.innerWidth; 
let canvasHeight =  window.innerHeight; 

let material = null,lightoffTexure,lightonTexure;
let controls;
const guiOptions = {
    refractionIndex: 1.93,
    color: "#FFFFFF",
    dispersion: 0.64,
    roughness: 0.2,
    animation: true,
    geometry: "icosahedron",
    uColor: '#ffffff',
    uRefractionRatio: 0.92,
    uFresnelBias: 0.75,
    uFresnelPower: 0.83,
    uFresnelScale: 0.79,
    uBackfaceVisibility: 0.22,
    threshold : 0,
    strength : 0,
    radius : 0,
  };

  const offGuiOptions = {
    refractionIndex: 1.93,
    dispersion: 0,
    roughness:0.98,
   
    uRefractionRatio: 0.92,
    uFresnelBias: 0.75,
    uFresnelPower: 0.83,
    uFresnelScale: 0.79,
    uBackfaceVisibility: 0.22,

    threshold : 0,
    strength : 0.9,
    radius : 0,
  }
  

const darkMaterial = new THREE.MeshBasicMaterial( { color: 'black' } );
const materials = {};

const renderer = new THREE.WebGLRenderer( { antialias: true , canvas : canvasElement} );
renderer.setPixelRatio( window.devicePixelRatio );
renderer.setSize( canvasWidth, canvasHeight );
// renderer.outputColorSpace = THREE.LinearSRGBColorSpace;
renderer.physicallyCorrectLights = true;
renderer.outputEncoding = THREE.sRGBEncoding;
// renderer.toneMapping = THREE.ReinhardToneMapping;

const scene = new THREE.Scene();



$(window).ready(()=>
{
          const camera = new THREE.PerspectiveCamera( 75, canvasWidth / canvasHeight, 0.1, 1000 );
          camera.position.set(   10.80,4.3,4 );
          controls = new THREE.OrbitControls( camera, renderer.domElement );
          controls.maxPolarAngle = Math.PI /2;
          controls.minPolarAngle = 1;
          controls.minDistance = 1;
          controls.maxDistance = 10;
          controls.addEventListener( 'change', render );
          controls.update();
          controls.saveState();

          scene.add( new THREE.AmbientLight( 0x404040 ) );

          const renderTarget = new THREE.WebGLRenderTarget(
            canvasWidth,
            canvasHeight,
            {
              type: THREE.HalfFloatType
            }
          );

           // material 
          

          // lightonTexure  = new THREE.CubeTextureLoader()
          // .setPath("./assets/cubemap5/")
          // .load(
          //     ["px.png", "nx.png", "py.png", "ny.png", "pz.png", "nz.png"],
          //     // (texture) => {
          //     // material.uniforms.envMap.value = texture;
          //     // }
          // );
          // lightonTexure.minFilter = THREE.LinearFilter;


          // scene.background = lightonTexure;
          // scene.backgroundBlurriness = 0.4;
                    
          let bloomPass = new THREE.UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 1.5, 0.4, 0.85);
          bloomPass.threshold = guiOptions.threshold;
          bloomPass.strength = guiOptions.strength;
          bloomPass.radius = guiOptions.radius;
          
          // Create a composer and add the bloom pass
          let composer = new THREE.EffectComposer(renderer, renderTarget);
          composer.addPass(new THREE.RenderPass(scene, camera));
          composer.addPass(bloomPass);


          setupScene();
          loadLightFromHDRI("./assets/christmas_photo_studio_07_1k.hdr");
          animate();

         

          window.onresize = function () {

              const width = canvasWidth;
              const height = canvasHeight;

              camera.aspect = width / height;
              camera.updateProjectionMatrix();

              renderer.setSize( width, height );

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
                scene.environment = envMap;

              renderer.toneMappingExposure = 0.7;
              renderer.toneMapping = THREE.LinearToneMapping ;
              // scene.environment = pmremGenerator.fromScene(new THREE.RoomEnvironment(), 0.04).texture;

              texture.dispose();
              pmremGenerator.dispose();
              })
              var pmremGenerator = new THREE.PMREMGenerator(renderer);
              pmremGenerator.compileEquirectangularShader();

          }

          function setupScene() {

            glbLoader.load( 'assets/roomModel.glb', function ( gltf ) {
              roomScene = gltf.scene.children[0];
              roomScene.scale.set(5,5,5);
              roomScene.position.y  = -5.5;
              // console.log(roomScene);
              scene.add(roomScene);
              setRoomMaterial()
              // console.log(modelScene);
             
             
          } );


            glbLoader.load( 'assets/model_on_off.glb', function ( gltf ) {
                let modelScene = gltf.scene;
                modelScene.scale.set(7,7,7);
                modelScene.position.y  = 4.2;
                modelScene.name="currentModel";
                scene.add(modelScene);
                modelsList["model_on_off"] = modelScene;
                setDeviceMaterial(modelScene)
               
                // end
               
            } );

           
          }

          function setDeviceMaterial(deviceModel)
          {
            let model = deviceModel.children[0];
              model.traverse(item=>
                  {
                      if(item.isMesh)
                      {
                          // console.log(item);
                          switch(item.name)
                          {
                            case "bulb_glass":
                              {
                              let newTextureModel = deviceModel.getObjectByName("glass_mt_on");
                              materialList["object"] = item;
                              materialList[" defaultMaterial"] = item.material;
                              materialList["onMaterial"] = newTextureModel.material;
                              newTextureModel.visible = false;
                               
                              }
                            break;

                            case "Bulb_inside":
                              {
                                let newTextureModel = deviceModel.getObjectByName("bulb_inside_on");
                                materialList["object"] = item;
                                materialList[" defaultMaterial"] = item.material;
                                materialList["onMaterial"] = newTextureModel.material;
                                newTextureModel.visible = false;
                                 
                              }
                            break;

                            case "Bulb_steel":
                              {
                                let newTextureModel = deviceModel.getObjectByName("steel_mt_on");
                                materialList["object"] = item;
                                materialList[" defaultMaterial"] = item.material;
                                materialList["onMaterial"] = newTextureModel.material;
                                newTextureModel.visible = false;
                                
                              }
                            break;

                            case "Diamond_mt":
                              {
                                let newTextureModel = deviceModel.getObjectByName("diamond_on");
                                materialList["object"] = item;
                                materialList["defaultMaterial"] = item.material;
                                materialList["onMaterial"] = newTextureModel.material;
                                newTextureModel.visible = false;
                                 
                              }
                                
                            break;

                            case "MidPart":
                                {
                                  let newTextureModel = deviceModel.getObjectByName("chrome_on");
                                  materialList["object"] = item;
                                  materialList["defaultMaterial"] = item.material;
                                  materialList["onMaterial"] = newTextureModel.material;
                                  newTextureModel.visible = false;
                                   
                                }
                               
                            break;

                            case "Ring":
                              {
                                let newTextureModel = deviceModel.getObjectByName("silver_on");
                                materialList["object"] = item;
                                materialList["defaultMaterial"] = item.material;
                                materialList["onMaterial"] = newTextureModel.material;
                                newTextureModel.visible = false;
                                 
                              }
                              break;
                          }
                          deviceObjectMat.push(materialList);
                      }
                  })
          }


          function setRoomMaterial()
          {
            
            console.log(roomScene,"room model")
            roomScene.children[0].visible = false;
            roomScene.children[1].traverse(item => 
              {
                roomMaterialList = []
                if(item.isMesh)
                {
                  switch(item.name)
                  {
                      case "Black_marble":
                        roomMaterialList["object"] = item;
                        roomMaterialList["defaultMaterial"] = item.material;
                        roomMaterialList["onMaterial"] = roomScene.getObjectByName("black_marble_mt_sphere").material;
                      break;
                      case "black_plastic_txr_mt1":
                        roomMaterialList["object"] = item;
                        roomMaterialList["defaultMaterial"] = item.material;
                        roomMaterialList["onMaterial"] = roomScene.getObjectByName("black_plastic_txr_mt_sphere").material;
                      break;
                      case "Black_reflective_plastic":
                        roomMaterialList["object"] = item;
                        roomMaterialList["defaultMaterial"] = item.material;
                        roomMaterialList["onMaterial"] = roomScene.getObjectByName("black_reflective_plastic_mt_sphere").material;
                      break;
                      case "BlackWall_Matte":
                        roomMaterialList["object"] = item;
                        roomMaterialList["defaultMaterial"] = item.material;
                        roomMaterialList["onMaterial"] = roomScene.getObjectByName("BlackWall_Matte_mt").material;
                      break;
                      case "books":
                        roomMaterialList["object"] = item;
                        roomMaterialList["defaultMaterial"] = item.material;
                        roomMaterialList["onMaterial"] = roomScene.getObjectByName("Book_MT").material;
                      break;
                      case "Carpet":
                        roomMaterialList["object"] = item;
                        roomMaterialList["defaultMaterial"] = item.material;
                        roomMaterialList["onMaterial"] = roomScene.getObjectByName("Carpet_mt").material;
                      break;
                      case "Copper":
                        roomMaterialList["object"] = item;
                        roomMaterialList["defaultMaterial"] = item.material;
                        roomMaterialList["onMaterial"] = roomScene.getObjectByName("copper_mt").material;
                      break;
                      case "Dark_metal":
                        roomMaterialList["object"] = item;
                        roomMaterialList["defaultMaterial"] = item.material;
                        roomMaterialList["onMaterial"] = roomScene.getObjectByName("Dark_metal_mt").material;
                      break;
                  
                      case "vray_Wood1":
                        roomMaterialList["object"] = item;
                        roomMaterialList["defaultMaterial"] = item.material;
                        roomMaterialList["onMaterial"] = roomScene.getObjectByName("vray_Wood1_MT").material;
                      break;
                      case "white_wax":
                        roomMaterialList["object"] = item;
                        roomMaterialList["defaultMaterial"] = item.material;
                        roomMaterialList["onMaterial"] = roomScene.getObjectByName("white_wax_mt").material;
                      break;
                      case "white_leather_wall":
                        roomMaterialList["object"] = item;
                        roomMaterialList["defaultMaterial"] = item.material;
                        roomMaterialList["onMaterial"] = roomScene.getObjectByName("Whitewall_leather_mt").material;
                      break;
                      case "Whitewall_matte":
                        roomMaterialList["object"] = item;
                        roomMaterialList["defaultMaterial"] = item.material;
                        roomMaterialList["onMaterial"] = roomScene.getObjectByName("Whitewall_matte_mt").material;
                      break;
                     
                      case "Sofa_2":
                        roomMaterialList["object"] = item;
                        roomMaterialList["defaultMaterial"] = item.material;
                        roomMaterialList["onMaterial"] = roomScene.getObjectByName("Sofa_2_MT").material;
                      break;
                      case "ThinGlass":
                        roomMaterialList["object"] = item;
                        roomMaterialList["defaultMaterial"] = item.material;
                        roomMaterialList["onMaterial"] = roomScene.getObjectByName("ThinGlass_MT").material;
                      break;
                      case "sofa_1":
                        roomMaterialList["object"] = item;
                        roomMaterialList["defaultMaterial"] = item.material;
                        roomMaterialList["onMaterial"] = roomScene.getObjectByName("sofa_1_MT").material;
                      break;
                      case "Screen":
                        roomMaterialList["object"] = item;
                        roomMaterialList["defaultMaterial"] = item.material;
                        roomMaterialList["onMaterial"] = roomScene.getObjectByName("Screen_mt").material;
                      break;
                      case "pillow":
                        roomMaterialList["object"] = item;
                        roomMaterialList["defaultMaterial"] = item.material;
                        roomMaterialList["onMaterial"] = roomScene.getObjectByName("pillow_MT").material;
                      break;
                      case "Lampe_Head":
                        roomMaterialList["object"] = item;
                        roomMaterialList["defaultMaterial"] = item.material;
                        roomMaterialList["onMaterial"] = roomScene.getObjectByName("Lamp_head_mt").material;
                      break;
                      case "Orange_matte":
                        roomMaterialList["object"] = item;
                        roomMaterialList["defaultMaterial"] = item.material;
                        roomMaterialList["onMaterial"] = roomScene.getObjectByName("Orange_matte_mt").material;
                      break;
                      case "metal":
                        roomMaterialList["object"] = item;
                        roomMaterialList["defaultMaterial"] = item.material;
                        roomMaterialList["onMaterial"] = roomScene.getObjectByName("Metal_mt").material;
                      break;
                      case "Gold":
                        roomMaterialList["object"] = item;
                        roomMaterialList["defaultMaterial"] = item.material;
                        roomMaterialList["onMaterial"] = roomScene.getObjectByName("Gold_mt").material;
                      break;
                      case "Glass":
                        roomMaterialList["object"] = item;
                        roomMaterialList["defaultMaterial"] = item.material;
                        roomMaterialList["onMaterial"] = roomScene.getObjectByName("Glass_mt").material;
                      break;
                      case "floor":
                        roomMaterialList["object"] = item;
                        roomMaterialList["defaultMaterial"] = item.material;
                        roomMaterialList["onMaterial"] = roomScene.getObjectByName("Floor_mt").material;
                      break;
                      case "Door_Wooden":
                        roomMaterialList["object"] = item;
                        roomMaterialList["defaultMaterial"] = item.material;
                        roomMaterialList["onMaterial"] = roomScene.getObjectByName("Door_wooden_mt").material;
                      break;
                      case "Aluminum":
                        roomMaterialList["object"] = item;
                        roomMaterialList["defaultMaterial"] = item.material;
                        roomMaterialList["onMaterial"] = roomScene.getObjectByName("aluminium_mt_sphere").material;
                      break;

                  }
                  roomObjectMat.push(roomMaterialList)
                }
              });
          }

          
         

          function render() {
            // console.log(camera.position);
            // renderer.setRenderTarget(null);
            // renderer.clear(true, true);
            renderer.render(scene, camera);
            // if(composer) composer.render();
          }

        });


        function updateMaterial(state)
        {
          if(state)
          {
            material.uniforms.refractionIndex.value = guiOptions.refractionIndex;
            material.uniforms.dispersion.value = guiOptions.dispersion;
            material.uniforms.roughness.value = guiOptions.roughness;
            material.uniforms.envMap.value = lightonTexure;
            
          }

          else{
            material.uniforms.refractionIndex.value = offGuiOptions.refractionIndex;
            material.uniforms.dispersion.value = offGuiOptions.dispersion;
            material.uniforms.roughness.value = offGuiOptions.roughness;
            material.uniforms.envMap.value = lightoffTexure;
          }
        }

        function roomLight(status)
          {
           roomObjectMat.map(item=>
            {
              if(status) item.object.material = item.onMaterial;
              else item.object.material = item.defaultMaterial;
              item.object.material.needsUpdate = true;
              
            })

            deviceObjectMat.map(item=>
              {
                // console.log(item)
                if(status) item.object.material = item.onMaterial;
                else item.object.material = item.defaultMaterial;
                item.object.material.needsUpdate = true;
                
              })
          }

        function setModelByProductId(productID)
          {
            console.log(productID);
            let currentModel = scene.getObjectByName("currentModel");
            if(currentModel) scene.remove(currentModel);
            scene.add(modelsList[productID]);

            let arPath = "assets/"+productID+".glb";
            $("#model-viewer").attr('src',arPath)
          }

          function resetControl()
          {
            controls.reset();
          }