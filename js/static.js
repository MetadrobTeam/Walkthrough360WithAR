
let point_6 = new Image();
point_6.src = 'assets/6_Point_high.jpg';

let point_7 = new Image();
point_7.src = 'assets/7_Point_high.jpg';

let point_8 = new Image();
point_8.src = 'assets/8_Point_high.jpg';

let point_91 = new Image();
point_91.src = 'assets/9.01_Point_high.jpg';

let point_92 = new Image();
point_92.src = 'assets/9.02_Point_high.jpg';


let panoramaImages = [
{
  image: point_6.src,
  markers: [
    { id: 'marker1', yaw:  0.16728, pitch: -0.6122, tooltip: '7th point' ,  isProduct : false ,index : 1 },
    { id: 'marker2', yaw:  6.0089, pitch: -0.3514, tooltip: '8th Point' ,isProduct : false, index : 2 },
    { id: 'marker3', yaw: 6.0662, pitch: -0.2170, tooltip: '9.01 Point' ,isProduct : false, index : 3 },
    { id: 'marker4', yaw:  6.1473, pitch: -0.1474, tooltip: '9.02 Point' ,isProduct : false, index : 4 },
    { id: 'product', yaw:  5.9238, pitch: 0.2990, tooltip: 'Cameo' , index : null , isProduct : true },
   

  ]
},
{
  image: point_7.src,
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
    image: point_8.src,
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
    image: point_91.src,
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
    image: point_92.src,
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
