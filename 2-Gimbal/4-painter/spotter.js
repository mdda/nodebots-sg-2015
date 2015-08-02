var webcam_device_index = 1; // X where /dev/videoX is the webcam device

var cv = require('opencv');
var webcam = new cv.VideoCapture(webcam_device_index);
var viewer = new cv.NamedWindow('Video', 0);

var nanomsg = require('nanomsg');
var pub = nanomsg.socket('pub');

var addr = 'tcp://127.0.0.1:7789';
pub.bind(addr);

var t0=new Date(), t1=t0;

function get_frame() {
  webcam.read(function(err, im) {
    if (err) throw err;
    
    t2=new Date();
    console.log(im.size(), (t2 - t1));
    t1=t2;
    
    if (im.size()[0] > 0 && im.size()[1] > 0) {
      //viewer.show(im);
      //console.log("Image displayed");
      var processed = im.copy();
      //processed.convertHSVscale();
      
      var channel = processed.split();
      console.log("Channel.length : ", channel.length);
      // 0=Blue, 1=Green, 2=Red (?)
      // H S V
      
/*
// (B)lue, (G)reen, (R)ed
var lower_threshold = [46, 57, 83];
var upper_threshold = [80, 96, 115];

im.inRange(lower_threshold, upper_threshold);
*/  
      
      var chan=channel[0];
      var o = chan.minMaxLoc();
      console.log(o);
      
      // Alternative : http://stackoverflow.com/questions/4010036/laser-light-detection-with-opencv-and-c
      // http://docs.opencv.org/2.4.9/modules/core/doc/operations_on_arrays.html?highlight=minmaxloc#inrange
      
      var rsize=20;
      chan.rectangle( [o.maxLoc.x-rsize/2, o.maxLoc.y-rsize/2], [rsize, rsize], 200, 1);
      
      viewer.show(chan);
      
      //pub.send(JSON.stringify({ a:'to', xy:[0.1,0.2] }));
    }
    else {
      console.log("No Image returned");
    }
    viewer.blockingWaitKey(1);
  });
}

setInterval(function() {
  get_frame();
}, 50);


/* Pretty Printing functions */
function pp(v,width,dp) {
  var s="          "+v.toFixed(dp);
  return s.substr(s.length-width);
}
function pp62(v) {
  return pp(v,6,2);
}

function p2dp(x,y,z) {
  return "(" + pp(x,4,2) +","+ pp(y,4,2) +","+ pp(y,4,2) +")";
}


