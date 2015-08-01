
var five = require("johnny-five");

var keypress = require("keypress");
keypress(process.stdin);

var pwm_mag=160;  // Can be up to 256 (very maximum...)
function pwm_width(pos) {  // pos is a fraction position, 1 loops around to 0
  //console.log("pwm_width("+pos+")");
  return (128 + Math.sin(2.0 * pos * 3.14159265) * pwm_mag / 2.0) | 0; // integer
}

function pp(v,width,dp) {
  var s="          "+v.toFixed(dp);
  return s.substr(s.length-width);
}
function pp62(v) {
  return pp(v,6,2);
}

if(false) {
  console.log(pp(5.7234234,6,2));
  console.log(pp(5.7234234,6,2));
  return;
}

if(false) {
  for(var pos=0;pos<2.0;pos+=0.02) {
    console.log(pp(pos) +" : "+ 
       pp(pwm_width(pos),4,0) +" "+ 
       pp(pwm_width(pos+1/3),4,0) +" "+ 
       pp(pwm_width(pos+2/3),4,0));
  }
  //console.log(Math.sin(.123));
  //console.log(pwm_width(0));
  return;
}

var board = new five.Board();

// The board's pins will not be accessible until
// the board has reported that it is ready

board.on("ready", function() {
  function motor_init(m) {
    for(var i=0;i<3;i++) {
      //console.log("motor_init("+m[i]+")");
      board.pinMode(m[i], five.Pin.PWM);
    }
  }
  function motor_reset(m) {
    for(var i=0;i<3;i++) {
      // Since these are all at the same PWM, there is no net current in the windings...
      board.analogWrite(m[i], pwm_width(0));
    }
  }
  function motor_pos(m, pos) {
    var p;
    for(var i=0;i<3;i++) {
      p = pwm_width(pos + i/3);
      console.log("motor_pos("+pp(m[i],2,0)+", "+pp62(pos+i/3)+" -> "+pp(p,3,0)+")");
      board.analogWrite(m[i], p);
    }
  }

  console.log("Ready!");

  var led = new five.Led(8);
  led.blink(100);

  console.log("Use Up and Down arrows for CW and CCW respectively. Space to stop.");

  var motor1 = [11,10,09];    
  var motor0 = [06,05,03];
    
  motor_init(motor1); // Appears to be the one on the -ve side of power in
  motor_init(motor0); // Appears to be the one on the +ve side of power in
  
  var motorx = motor1;
  var motory = motor0;
  motor_reset(motorx);
  motor_reset(motory);
  
  /* Now try to find I2C device : MPU6050 */
  var accelerometer = new five.Accelerometer({
    controller: "MPU6050"
  });

  accelerometer.on("change-long", function() { // -long
    console.log("accelerometer");
    console.log("  x            : ", this.x);
    console.log("  y            : ", this.y);
    console.log("  z            : ", this.z);
    console.log("  pitch        : ", this.pitch);
    console.log("  roll         : ", this.roll);
    console.log("  acceleration : ", this.acceleration);
    console.log("  inclination  : ", this.inclination);
    console.log("  orientation  : ", this.orientation);
    console.log("--------------------------------------");
  });  
  accelerometer.on("change", function() { // -line
    console.log("acc:"
      +" xyz:"+p2dp(this.x*20+50, this.y*20+50, this.z*20+50)
      +" pra:"+p2dp(this.pitch*0.4+50, this.roll*0.4+50, this.inclination*0.2+50)
      +" io :"+p2dp((this.acceleration-1)*20+50, this.orientation*10+50, 0)
    );
  });  
  
  var x=0.00, y=0.0, v=0.025;
  motor_pos(motorx, x);
  motor_pos(motory, y);
  
  process.stdin.resume();
  process.stdin.setEncoding("utf8");
  process.stdin.setRawMode(true);

  process.stdin.on("keypress", function(ch, key) {
    if (!key) {
      return;
    }

    if (key.name === "q") {
      console.log("Quitting");
      process.exit();
    } else if (key.name === "up") {
      y += v;
      motor_pos(motory, y);
    } else if (key.name === "down") {
      y -= v;
      motor_pos(motory, y);
    } else if (key.name === "left") {
      x += v;
      motor_pos(motorx, x);
    } else if (key.name === "right") {
      x -= v;
      motor_pos(motorx, x);
    } else if (key.name === "space") {
      console.log("Reset");
      motor_reset(motorx);
      motor_reset(motory);
    }
    console.log("(x,y)=("+pp(x,4,2)+","+pp(y,4,2)+")");
  });
});


function p2dp(x,y,z) {
  return "(" + pp(x,4,2) +","+ pp(y,4,2) +","+ pp(y,4,2) +")";
}
