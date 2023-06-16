    let currentProductIndex = 0;

  let currentImageIndex = 0;
  let panoramaViewer = document.getElementById('panorama-viewer');
  let viewerInstance = null;
  let gyroInstance = null;
  let markerInstance = null;
  let isGyroEnabled = false;
  
  
  function loadPanorama(imageUrl,lightIndex,currentRotation) {
   if(viewerInstance == null)
   {
        viewerInstance = new PhotoSphereViewer.Viewer({
          container: panoramaViewer,
          panorama: imageUrl,
          loadingImg:"assets/loading.gif",
          navbar : false,
          gyroscope: true,
          
          plugins: [
            [PhotoSphereViewer.MarkersPlugin, {
              markers: getMarkersForCurrentImage(lightIndex),
              // markerStyle: {
              //   color: 'red',
              //   hoverColor: 'blue'
              // }
            },],
            PhotoSphereViewer.GyroscopePlugin
          ]
        });
        if(currentRotation) viewerInstance.rotate(currentRotation)
      
        
        viewerInstance.addEventListener('click', ({ data }) => {
            console.log(data.yaw,  data.pitch)
      });

      if(markerInstance == null)
      {
        markerInstance = viewerInstance.getPlugin(PhotoSphereViewer.MarkersPlugin);

        markerInstance.addEventListener('select-marker', ({ marker }) => {
                
                if(!marker.data.isProduct && !marker.data.isLight)
                {
                  currentImageIndex = marker.data.index;
                showCurrentImage();
                }
                else if(marker.data.isProduct){
                  let lightIndex = panoramaImages.length-4;
                  if(marker.id == "product1") lightIndex = panoramaImages.length-2;
                  currentProductIndex = lightIndex;
                  let currentImage = panoramaImages[lightIndex].image;
                  showCurrentImage(currentImage,lightIndex);
                
                }
                if(marker.data.isLight)
                {
                  setModelByProductId(marker.id)
                  $("#cardContainer").show();
                }
              });
          }
      }

      else
      {
        console.log(imageUrl);
        viewerInstance.setPanorama(imageUrl)
        .then(() => console.log("completed"));
        if(markerInstance) markerInstance.setMarkers(getMarkersForCurrentImage(lightIndex));
      }
  }
  
  function getMarkersForCurrentImage(lightIndex) {
    let currentPanorama = null;
    if(lightIndex) currentPanorama =  panoramaImages[lightIndex]
    else currentPanorama = panoramaImages[currentImageIndex];
    return currentPanorama.markers.map(function(marker) {
      let normalMarker =  `<svg class = "button" expanded = "true" height = "100px" width = "100px">
            <circle class = "innerCircle" cx = "50%" cy = "50%" r = "25%" fill = "none" stroke = "#1B5E20" stroke-width = "10%">
            <animate attributeType="SVG" attributeName="r" begin="0s" dur="1.5s" repeatCount="indefinite" from="20%" to="50%"/>
            <animate attributeType="CSS" attributeName="stroke-width" begin="0s"  dur="1.5s" repeatCount="indefinite" from="3%" to="0%" />
            <animate attributeType="CSS" attributeName="opacity" begin="0s"  dur="1.5s" repeatCount="indefinite" from="1" to="0"/>
            </circle>
          </svg>`
          if(marker.isProduct) 
          {
            normalMarker = `<button class="material-button ">
                              <span class="material-icon">
                                <i class="fa-solid fa-lightbulb"></i>
                              </span>
                            </button>`
          }
          if(marker.isLight) 
          {
            normalMarker = `<button class="material-button ">
                              <span class="material-icon">
                              <i class="fa-solid fa-exclamation"></i>
                              </span>
                            </button>`
          }
      return {
        id: marker.id,
        position: { yaw: marker.yaw, pitch: marker.pitch},
        html : normalMarker,
        // image: 'assets/markers/up-chevron.png',
        size: { width: 32, height: 32 },
        anchor: 'bottom center',
        tooltip: marker.tooltip, 
        data: {
            generated: true,
            index : marker.index,
            isProduct : marker.isProduct,
            isLight : (marker.isLight) ? marker.isLight : null
        },
      };
    });
  }
  
  function showCurrentImage(image,lightIndex,currentRotation) {
    let currentImage  = panoramaImages[currentImageIndex].image;
    
    if(image) currentImage = image;
   
    loadPanorama(currentImage,lightIndex,currentRotation);
  }


  $(document).ready(function() {

      showCurrentImage();
   
      // close button click event
      $("#closeBtn").on("click",()=>
      {
        $("#cardContainer").hide();
      })

      //toggle button click event 
      $("#toggleBtn").on("change",(e)=>
      {
        let isChecked = $("#toggleBtn").prop("checked");
        let lightIndex = currentProductIndex;
        var currentRotation = viewerInstance.getPosition();
        if(isChecked) lightIndex = currentProductIndex+1;
        let currentImage = panoramaImages[lightIndex].image;
        showCurrentImage(currentImage,lightIndex, currentRotation);
      })

      // home button click event
      $("#homeBtn").on("click",()=>
      {
        currentImageIndex = 0;
        showCurrentImage();
        $("#cardContainer").hide();
      })

      // gyro buton click event 
      $("#gyroBtn").on("click",()=>
      {
        if(gyroInstance == null) gyroInstance = viewerInstance.getPlugin('gyroscope');
        // console.log(plugin);
        // plugin.config.absolutePosition = true;
        gyroInstance.config.touchMove = true;
        gyroInstance.isSupported().then((result)=>
        {
          if (result) {
            if(!isGyroEnabled) 
            {
              $("#gyroBtn").css("background-color","rgb(13, 206, 132)");
              gyroInstance.start("smooth");
            }
            else 
            {
              $("#gyroBtn").css("background-color","rgb(212, 64, 64)");
              gyroInstance.stop();
            }
            isGyroEnabled = !isGyroEnabled;
            
          } else {
            console.log('Gyro not supported on this device.');
          }
        })
        
      })

      // AR button click event 
      $(".arBtn").on("click",()=>
      {
        var modelViewer = document.getElementById('model-viewer');
        modelViewer.activateAR();
      })

      $("#panorama-viewer").on("pointerdown",()=>
      {
        if(gyroInstance) gyroInstance.stop();
      })

      $("#panorama-viewer").on("pointerup",()=>
      {
        if(gyroInstance) gyroInstance.start();
      })

  });
  
  
