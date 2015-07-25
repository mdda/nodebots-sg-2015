
var five = require("johnny-five");

var keypress = require("keypress");
keypress(process.stdin);

var mag=80;  // Can be up to 256 (very maximum...)
function pwm_width(pos) {  // pos is a fraction position, 1 loops around to 0
  //console.log("pwm_width("+pos+")");
  return (128 + Math.sin(2.0 * pos * 3.14159265) * mag / 2.0) | 0; // integer
}

//console.log(Math.sin(.123));
//console.log(pwm_width(0));
//console.log(pwm_width(.25));
//return;

var board = new five.Board();

// The board's pins will not be accessible until
// the board has reported that it is ready

board.on("ready", function() {
  function motor_init(m) {
    for(var i=0;i<3;i++) {
      //console.log("motor_init("+m[i]+")");
      board.pinMode(m[i], five.Pin.PWM);
      board.analogWrite(m[i], pwm_width(0));
    }
  }
  function motor_reset(m) {
    for(var i=0;i<3;i++) {
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

  var p=0, v=0.1;
  
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
      console.log("CW  "+p);
      p += v;
      motor_pos(motor, p);
    } else if (key.name === "down") {
      console.log("CCW "+p);
      p -= v;
      motor_pos(motor, p);
    } else if (key.name === "space") {
      console.log("Reset");
      motor_reset(motor);
    }
  });
});

