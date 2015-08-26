var webcam_device_index = 1; // X where /dev/videoX is the webcam device

var cv = require('opencv');
var webcam = new cv.VideoCapture(webcam_device_index);
var viewer = new cv.NamedWindow('Video', 0);

var nanomsg = require('nanomsg');
var pub = nanomsg.socket('pub');

var addr = 'tcp://127.0.0.1:7789';
pub.bind(addr);

var t0=new Date(), t1=t0;

var background=undefined;

function get_frame() {
  var t1=new Date();
  webcam.read(function(err, im) {
    if (err) throw err;
    var sz = im.size();
    
    var t1=new Date();
    console.log('Grabbed image in : '+(t2 - t1)+"ms, shape:", sz);
    
    if (sz[0] > 0 && sz[1] > 0) {
      //viewer.show(im);
      //console.log("Image displayed");
      var processed = im.copy();  // Raw is BGR (~ RGB data)
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
      if(background) {
        chan = chan - background;
      }
      
      // Want possibility of capturing a background image to subtract out of 
      // subsequent frames...
      
      var o = chan.minMaxLoc();
      console.log(o);
      
      // Alternative : http://stackoverflow.com/questions/4010036/laser-light-detection-with-opencv-and-c
      // http://docs.opencv.org/2.4.9/modules/core/doc/operations_on_arrays.html?highlight=minmaxloc#inrange
      
      var rsize=20;
      var disp = chan.copy();
      disp.rectangle( [o.maxLoc.x-rsize/2, o.maxLoc.y-rsize/2], [rsize, rsize], 200, 1);
      
      viewer.show(disp);
      
      //pub.send(JSON.stringify({ a:'to', xy:[0.1,0.2] }));
    }
    else {
      console.log("No Image returned");
    }
    
    var key = viewer.blockingWaitKey(1);
    //console.log(key);
    /// or : see onKeyDown column of http://www.asquare.net/javascript/tests/KeyCode.html
    // 27='esc', 49='1'
    if(66 == key) { // 66='b'
      background = chan.copy();
    }
    if(67 == key) { // 67='c'
      background = undefined;
    }
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


