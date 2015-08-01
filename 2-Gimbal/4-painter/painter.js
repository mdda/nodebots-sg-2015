var five = require("johnny-five");

var keypress = require("keypress");
keypress(process.stdin);

var board = new five.Board();
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

var pwm_mag=160;  // Can be up to 256 (very maximum...)
function pwm_width(pos) {  // pos is a fraction position, 1 loops around to 0
  //console.log("pwm_width("+pos+")");
  return (128 + Math.sin(2.0 * pos * 3.14159265) * pwm_mag / 2.0) | 0; // integer
}

