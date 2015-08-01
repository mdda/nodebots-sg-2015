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
      viewer.show(im);
      console.log("Image displayed");
      
      //pub.send("123123");
      pub.send(JSON.stringify({ a:'to', xy:[0.1,0.2] }));
    }
    else {
      console.log("No Image returned");
    }
    viewer.blockingWaitKey(1);
    //viewer.blockingWaitKey(-1);
  });
}

setInterval(function() {
  get_frame();
}, 50);



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
