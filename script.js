   let currentProductIndex = 0;
    let panoramaImages = [
    {
      image: 'assets/6_Point.jpg',
      markers: [
        { id: 'marker1', yaw:  0.16728, pitch: -0.6122, tooltip: '7th point' ,  isProduct : false ,index : 1 },
        { id: 'marker2', yaw:  6.0089, pitch: -0.3514, tooltip: '8th Point' ,isProduct : false, index : 2 },
        { id: 'marker3', yaw: 6.0662, pitch: -0.2170, tooltip: '9.01 Point' ,isProduct : false, index : 3 },
        { id: 'marker4', yaw:  6.1473, pitch: -0.1474, tooltip: '9.02 Point' ,isProduct : false, index : 4 },
        { id: 'product', yaw:  5.9238, pitch: 0.2990, tooltip: 'Cameo' , index : null , isProduct : true },
       

      ]
    },
    {
      image: 'assets/7_Point.jpg',
      markers: [
        { id: 'marker1', yaw:  1.3163, pitch: -0.7996, tooltip: '6th Point' , index : 0 ,isProduct : false},
        { id: 'marker2', yaw: 3.965, pitch: -0.480, tooltip: '8th Point' , index : 2 ,isProduct : false},
        { id: 'marker3', yaw: 4.1710, pitch: -0.2645, tooltip: '9.01 Point' , index : 3 ,isProduct : false},
        { id: 'marker4', yaw: 4.3726, pitch: -0.1934, tooltip: '9.02 Point' , index : 4 ,isProduct : false},
        { id: 'product', yaw:3.21726, pitch:  0.6587, tooltip: 'Cameo' , index : null ,isProduct : true},
        { id: 'product1', yaw:3.7334, pitch:  0.6735, tooltip: 'Cameo 2' , index : null ,isProduct : true},
      ]
    },

    {
        image: 'assets/8_Point.jpg',
        markers: [

          { id: 'marker1', yaw:   6.1615, pitch:-0.3340, tooltip: '9.01 point' , index : 3 ,isProduct : false},
          { id: 'marker2', yaw:  6.1702, pitch:-0.2405, tooltip: '9.02 point' , index : 4,isProduct : false },
          { id: 'marker3', yaw:  1.5003, pitch:-0.6118, tooltip: '7th point' , index : 1 ,isProduct : false},
          { id: 'marker4', yaw:  1.8896, pitch:-0.4742, tooltip: '6th Point' , index : 0 ,isProduct : false},
          { id: 'product', yaw: 1.2895, pitch: 0.8072, tooltip: 'Cameo' , index : null ,isProduct : true},
          { id: 'product1', yaw: 0.2755, pitch:0.9072, tooltip: 'Cameo 2' , index : null ,isProduct : true},
         
  
        ]
      },

      {
        image: 'assets/9.01_Point.jpg',
        markers: [
          { id: 'marker1', yaw:  2.56350, pitch: -0.1894, tooltip: '6th Point' , index : 0 },
          { id: 'marker2', yaw:  2.6127, pitch: -0.2972, tooltip: '7th Point' , index : 1 },
          { id: 'marker3', yaw:  2.9069, pitch:-0.4140, tooltip: '8th Point' , index : 2 },
          { id: 'marker4', yaw:  5.5737, pitch: -0.6038, tooltip: '9.02 point' , index : 4 },
          { id: 'product', yaw:  5.0549, pitch:   0.35016, tooltip: 'Cameo' , index : null ,isProduct : true},
          { id: 'product1', yaw:  2.7236, pitch:   0.3523, tooltip: 'Cameo 2' , index : null ,isProduct : true},
        ]
      },

      {
        image: 'assets/9.02_Point.jpg',
        markers: [
          { id: 'marker1', yaw: 3.32042, pitch: -0.7169, tooltip: '9.01 point' , index : 3 },
          { id: 'marker2', yaw: 3.5868, pitch: -0.3414, tooltip: '8th point' , index : 2 },
          { id: 'marker3', yaw:3.3635, pitch: -0.2632, tooltip: '7th Point' , index : 1 },
          { id: 'marker4', yaw: 3.2626, pitch: -0.1327, tooltip: '6th Point' , index : 0 },
          { id: 'product', yaw:   5.6906, pitch:   0.3865, tooltip: 'Cameo' , index : null ,isProduct : true},

        ]
      },
      {
        image: 'assets/lightoff_2k.png',
        markers: [
          { id: 'product', yaw:    0.0121, pitch:  0.1898, tooltip: 'Click here for description about cameo' , index : null ,isProduct : false,isLight:true},
        ]
      },
      {
        image: 'assets/lighton_2k.png',
        markers: [
          { id: 'product', yaw:   6.2742, pitch: 0.1786, tooltip: 'Click here for description about cameo' , index : null ,isProduct : false,isLight:true},
        ]
      },

      {
        image: 'assets/product2_off.png',
        markers: [
          { id: 'product', yaw:  6.2831, pitch: 0.4837, tooltip: 'Click here for description about cameo' , index : null ,isProduct : false,isLight:true},
        ]
      },
      {
        image: 'assets/product2_on.png',
        markers: [
          { id: 'product', yaw:   0.0035, pitch:0.4779, tooltip: 'Click here for description about cameo' , index : null ,isProduct : false,isLight:true},
        ]
      },
  ];
  
  let currentImageIndex = 0;
  let panoramaViewer = document.getElementById('panorama-viewer');
  let viewerInstance = null;
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
            // if (!data.rightclick) {
            //     markersPlugin.addMarker({
            //         id: '#' + Math.random(),
            //         position: { yaw: data.yaw, pitch: data.pitch },
            //         image: "assets/markers/nav.gif",
            //         size: { width: 32, height: 32 },
            //         anchor: 'bottom center',
            //         tooltip: 'Generated pin',
            //         data: {
            //             generated: true,
            //         },
            //     });
            // }
      });

        const markersPlugin = viewerInstance.getPlugin(PhotoSphereViewer.MarkersPlugin);

            markersPlugin.addEventListener('select-marker', ({ marker }) => {
              
              if(!marker.data.isProduct && !marker.data.isLight)
              {
                currentImageIndex = marker.data.index;
              showCurrentImage();
              }
              else if(marker.data.isProduct){
                // currentImageIndex = panoramaImages.length-2;
                
                let lightIndex = panoramaImages.length-4;
                if(marker.id == "product1") lightIndex = panoramaImages.length-2;
                currentProductIndex = lightIndex;
                let currentImage = panoramaImages[lightIndex].image;
                showCurrentImage(currentImage,lightIndex);
              
              }
              if(marker.data.isLight)
              {
                $("#cardContainer").show();
              }
            });
      }

      else
      {
        console.log(imageUrl);
        viewerInstance.setPanorama(imageUrl)
        .then(() => console.log("completed"));
        const markersPlugin = viewerInstance.getPlugin(PhotoSphereViewer.MarkersPlugin);
        markersPlugin.setMarkers(getMarkersForCurrentImage(lightIndex));
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

  
  showCurrentImage();

  $("#closeBtn").on("click",()=>
  {
    $("#cardContainer").hide();
  })

  $("#toggleBtn").on("change",(e)=>
  {
    let isChecked = $("#toggleBtn").prop("checked");
    let lightIndex = currentProductIndex;
    var currentRotation = viewerInstance.getPosition();
    if(isChecked) lightIndex = currentProductIndex+1;
    let currentImage = panoramaImages[lightIndex].image;
    showCurrentImage(currentImage,lightIndex, currentRotation);
  })

  $("#homeBtn").on("click",()=>
  {
    currentImageIndex = 0;
    showCurrentImage();
    $("#cardContainer").hide();
  })

  $("#gyroBtn").on("click",()=>
  {
    let plugin = viewerInstance.getPlugin('gyroscope');
    // alert(plugin.isSupported());
    plugin.isSupported().then((result)=>
    {
      if (result) {
        if(!isGyroEnabled) 
        {
          $("#gyroBtn").css("background-color","rgb(13, 206, 132)");
          plugin.start();
        }
        else 
        {
          $("#gyroBtn").css("background-color","rgb(212, 64, 64)");
          plugin.stop();
        }
        isGyroEnabled = !isGyroEnabled;
        
      } else {
        console.log('Gyro not supported on this device.');
      }
    })
    
  })

  $("#arBtn").on("click",()=>
  {
    $("#model-viewer").click();
  })
