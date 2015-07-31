
var five = require("johnny-five");

var keypress = require("keypress");
keypress(process.stdin);

var mag=160;  // Can be up to 256 (very maximum...)
function pwm_width(pos) {  // pos is a fraction position, 1 loops around to 0
  //console.log("pwm_width("+pos+")");
  return (128 + Math.sin(2.0 * pos * 3.14159265) * mag / 2.0) | 0; // integer
}

if(false) {
  for(var pos=0;pos<2.0;pos+=0.02) {
    console.log(pos.toFixed(2) +" : "+ 
       pwm_width(pos).toFixed(0) +" "+ 
       pwm_width(pos+1/3).toFixed(0) +" "+ 
       pwm_width(pos+2/3).toFixed(0));
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
    for(var i=0;i<3;i++) {
      //console.log("motor_pos("+m[i]+", "+pos+")");
      board.analogWrite(m[i], pwm_width(pos + i/3));
    }
  }

  console.log("Ready!");

  var led = new five.Led(8);
  led.blink(100);

  console.log("Use Up and Down arrows for CW and CCW respectively. Space to stop.");

  var motor1 = [11,10,09];    
  var motor0 = [06,05,03];
    
  motor_init(motor1); // Appears to be the one on the -ve side of power in
  //motor_init(motor0); // Appears to be the one on the +ve side of power in
  var motor = motor1;
  motor_reset(motor);
  
  /* Now try to find I2C device : MPU6050 */
  var accelerometer = new five.Accelerometer({
    controller: "MPU6050"
  });

  accelerometer.on("xchange", function() {
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
  accelerometer.on("change", function() {
    console.log("acc:"+
      " xyz:"+p2dp(this.x, this.y, this.z)+
      " pra:"+p2dp(this.pitch, this.roll, this.acceleration)+
      " io :"+p2dp(this.inclination, this.orientation, 0)
    );
  });  
  
  var p=0.00, v=0.03333333333333333333;
  //motor_pos(motor, p);
  
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
      p += v;
      console.log("CW  "+p.toFixed(3));
      motor_pos(motor, p);
    } else if (key.name === "down") {
      p -= v;
      console.log("CCW "+p.toFixed(3));
      motor_pos(motor, p);
    } else if (key.name === "space") {
      console.log("Reset");
      motor_reset(motor);
    }
  });
});


function p2dp(x,y,z) {
  return "(" + x.toFixed(2) +","+ y.toFixed(2) +","+ z.toFixed(2) +")";
}
