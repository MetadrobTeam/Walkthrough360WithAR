THREE.ColorManagement.enabled = false; // TODO: Confirm correct color management.

let glbLoader = new THREE.GLTFLoader().setDRACOLoader( new THREE.DRACOLoader().setDecoderPath( './libs/draco/gltf/' ) )
const canvasElement = document.getElementById("viewerCanvas");

let modelsList = {}

let canvasWidth = 350; 
let canvasHeight = 200; 

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
    threshold : 0.33,
    strength : 0.35,
    radius : 0.54,
  };
  

const darkMaterial = new THREE.MeshBasicMaterial( { color: 'black' } );
const materials = {};

const renderer = new THREE.WebGLRenderer( { antialias: true , canvas : canvasElement} );
renderer.setPixelRatio( window.devicePixelRatio );
renderer.setSize( canvasWidth, canvasHeight );
renderer.outputColorSpace = THREE.LinearSRGBColorSpace;
renderer.toneMapping = THREE.ReinhardToneMapping;

const scene = new THREE.Scene();
$(window).ready(()=>
{
          const camera = new THREE.PerspectiveCamera( 40, canvasWidth / canvasHeight, 1, 200 );
          camera.position.set( 0, 0, 20 );

          const controls = new THREE.OrbitControls( camera, renderer.domElement );
          controls.maxPolarAngle = Math.PI * 1;
          controls.minDistance = 1;
          controls.maxDistance = 100;
          controls.addEventListener( 'change', render );

          scene.add( new THREE.AmbientLight( 0x404040 ) );

          const renderTarget = new THREE.WebGLRenderTarget(
            canvasWidth,
            canvasHeight,
            {
              type: THREE.HalfFloatType
            }
          );
          
          let bloomPass = new THREE.UnrealBloomPass(new THREE.Vector2(canvasWidth, canvasHeight), 1.5, 0.4, 0.85);
          bloomPass.threshold = guiOptions.threshold;
          bloomPass.strength = guiOptions.strength;
          bloomPass.radius = guiOptions.radius;
          
          // Create a composer and add the bloom pass
          let composer = new THREE.EffectComposer(renderer, renderTarget);
          composer.addPass(new THREE.RenderPass(scene, camera));
          composer.addPass(bloomPass);


          setupScene();
          loadLightFromHDRI("./assets/footprint_court_2k.hdr");
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

           
            // material 
            const material = new THREE.ShaderMaterial({
                uniforms: {
                  resolution: new THREE.Uniform(
                    new THREE.Vector2(canvasWidth, canvasHeight).multiplyScalar(
                      window.devicePixelRatio
                    )
                  ),
                  backNormals: new THREE.Uniform(renderTarget.texture),
                  envMap: new THREE.Uniform(THREE.CubeTexture.DEFAULT_IMAGE),
                  refractionIndex: new THREE.Uniform(guiOptions.refractionIndex),
                  color: new THREE.Uniform(new THREE.Color(guiOptions.color)),
                  dispersion: new THREE.Uniform(guiOptions.dispersion),
                  roughness: new THREE.Uniform(guiOptions.roughness)
                },
                vertexShader: `
                varying vec3 vWorldCameraDir;
                varying vec3 vWorldNormal;
                varying vec3 vViewNormal;
              
                void main() {
                  vec4 worldPosition = modelMatrix * vec4( position, 1.0);
              
                  vWorldCameraDir = worldPosition.xyz - cameraPosition;
                  vWorldCameraDir = normalize(vec3(-vWorldCameraDir.x, vWorldCameraDir.yz));
              
                  vWorldNormal = (modelMatrix * vec4(normal, 0.0)).xyz;
                  vWorldNormal = normalize(vec3(-vWorldNormal.x, vWorldNormal.yz));
              
                      vViewNormal = normalize( modelViewMatrix * vec4(normal, 0.0)).xyz;
              
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }`,
                fragmentShader: `
                #define REF_WAVELENGTH 579.0
                #define RED_WAVELENGTH 650.0
                #define GREEN_WAVELENGTH 525.0
                #define BLUE_WAVELENGTH 440.0
              
                uniform vec2 resolution;
                uniform sampler2D backNormals;
                uniform samplerCube envMap;
                uniform float refractionIndex;
                uniform vec3 color;
                uniform float dispersion;
                uniform float roughness;
                varying vec3 vWorldCameraDir;
                varying vec3 vWorldNormal;
                varying vec3 vViewNormal;
              
                vec4 refractLight(float wavelength, vec3 backFaceNormal) {
                  float index = 1.0 / mix(refractionIndex, refractionIndex * REF_WAVELENGTH / wavelength, dispersion);
                  vec3 dir = vWorldCameraDir;
                  dir = refract(dir, vWorldNormal, index);
                  dir = refract(dir, backFaceNormal, index);
                  return textureCube(envMap, dir);
                }
              
                vec3 fresnelSchlick(float cosTheta, vec3 F0)
                {
                  return F0 + (1.0 - F0) * pow(1.0 + cosTheta, 5.0);
                }
              
                void main() {
                  vec3 backFaceNormal = texture2D(backNormals, gl_FragCoord.xy / resolution).rgb;
              
                  float r = refractLight(RED_WAVELENGTH, backFaceNormal).r;
                  float g = refractLight(GREEN_WAVELENGTH, backFaceNormal).g;
                  float b = refractLight(BLUE_WAVELENGTH, backFaceNormal).b;
              
                  vec3 fresnel = fresnelSchlick(dot(vec3(0.0,0.0,-1.0), vViewNormal), vec3(0.04));
                  vec3 reflectedColor = textureCube(envMap, reflect(vWorldCameraDir, vWorldNormal)).rgb * saturate((1.0 - roughness) + fresnel);
              
                  gl_FragColor.rgb = vec3(r,g,b) * color + reflectedColor;
                }`
              });

              let texture  = new THREE.CubeTextureLoader()
              .setPath("./assets/cubemap5/")
              .load(
                  ["px.png", "nx.png", "py.png", "ny.png", "pz.png", "nz.png"],
                  (texture) => {
                  material.uniforms.envMap.value = texture;
                  }
              );

              texture.minFilter = THREE.LinearFilter;

              scene.background = texture;

            glbLoader.load( 'assets/ball_light.glb', function ( gltf ) {
                let modelScene = gltf.scene;
                modelScene.scale.set(20,20,20);
                modelScene.position.y  = -2.5;
                modelScene.name="currentModel";
                scene.add(modelScene)
                let model = scene.getObjectByName("Diamond1")
                model.material = material;
                model.material.needsUpdate = true;
                modelsList["ball_light"] = modelScene;
            } );

            glbLoader.load( 'assets/cameo_rect.glb', function ( gltf ) {
                let modelScene = gltf.scene;
                modelScene.scale.set(8,8,8);
                modelScene.name="currentModel";
                modelsList["cameo_rect"] = modelScene;
                let model = modelScene.getObjectByName("Chandeliear_Bulb5")
                model.traverse(item=>
                    {
                        if(item.isMesh)
                        {
                            item.material = material;
                            item.material.needsUpdate = true;
                        }
                    })
                model.material = material;
                model.material.needsUpdate = true;

            } );
          }

         

          function render() {
            renderer.setRenderTarget(null);
            renderer.clear(true, true);
            renderer.render(scene, camera);
            if(composer) composer.render();
          }

        });

        function setModelByProductId(productID)
          {
            console.log(productID);
            let currentModel = scene.getObjectByName("currentModel");
            if(currentModel) scene.remove(currentModel);
            scene.add(modelsList[productID]);

            let arPath = "assets/"+productID+".glb";
            $("#model-viewer").attr('src',arPath)
          }