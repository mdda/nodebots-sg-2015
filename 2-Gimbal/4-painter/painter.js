var five = require("johnny-five");

var nanomsg = require("nanomsg");
var sub = nanomsg.socket('sub');

var addr = 'tcp://127.0.0.1:7789';
sub.connect(addr);

var keypress = require("keypress");
keypress(process.stdin);

var state = {
  pins   :[11,10,9, 6,5,3],     // x,x,x  y,y,y  Pin numbers
  written:[ 0, 0,0, 0,0,0],        // x,x,x  y,y,y
  nextpwm:[ 0, 0,0, 0,0,0],        // x,x,x  y,y,y
  
  origin: [0,0],  // origin_x, origin_y
  offset: [0,0]   // offset_x, offset_y
}

var board = new five.Board();
board.on("ready", function() {
  function motors_freewheel() {
    var p=pwm_width(0);
    for(var k=0; k<state.pins.length; k++) {
      // Since these are all at the same PWM, there is no net current in the windings...
      state.nextpwm[k]=p;
    }
  }  
  function motors_pwmcalc() {
    var i,j,p;
    for(i=0; i<2; i++) {   // 0->x 1->y
      p = state.origin[i] + state.offset[i];
      for(j=0; j<3; j++) {  // each of 3 pins
        state.nextpwm[j + i*3] = pwm_width(p + j/3);
      }
    }
  }
  function motors_update() {
    var t0=new Date();
    for(var k=0; k<state.pins.length; k++) {
      if(state.nextpwm[k] != state.written[k]) { // Only send if different
        console.log("motor_pos("+pp(state.pins[k],2,0)+", "+pp(state.nextpwm[k],3,0)+")");
        board.analogWrite(state.pins[k], state.nextpwm[k]);
        state.written[k]=state.nextpwm[k];
      }
    }
    console.log("Update took "+pp(new Date() - t0, 4, 0)+"ms");
  }
  console.log("Ready!");

  for(var i=0; i<state.pins.length; i++) {
    board.pinMode(state.pins[i], five.Pin.PWM);
    state.written[i] = -1;  // Nothing written yet - will be written soon
  }
  motors_freewheel();
  motors_update();
  
  var led = new five.Led(8);
  led.blink(100);

  console.log("Use Up/Down/Left/Right arrows to control gimbal directly. Space to stop.");
  
  var origin_jog=[ 0.025, 0.025 ];
  
  process.stdin.resume();
  process.stdin.setEncoding("utf8");
  process.stdin.setRawMode(true);

  process.stdin.on("keypress", function(ch, key) {
    if (!key) {
      return;
    }

    var pwm = true;
    if (key.name === "q") {
      console.log("Quitting");
      process.exit();
    } else if (key.name === "up") {
      state.origin[1] += origin_jog[1];
    } else if (key.name === "down") {
      state.origin[1] -= origin_jog[1];
    } else if (key.name === "left") {
      state.origin[0] += origin_jog[0];
    } else if (key.name === "right") {
      state.origin[0] -= origin_jog[0];
    } else if (key.name === "space") {
      console.log("Reset");
      motors_freewheel();
      pwm = false; // Don't recalculate PWMs
    }
    if(pwm) {
      //console.log("(x,y)=("+pp(x,4,2)+","+pp(y,4,2)+")");
      motors_pwmcalc();
    }
    motors_update();      
  });

  sub.on('data', function (buf) {
    var json=JSON.parse(buf);
    console.log("Executing :", json);
    var a=json.a || '';
    if(a=='to') {
      state.offset = json.xy;
      console.log("Moved to  :", x, y );
      motors_pwmcalc();
      motors_update();      
    }
    
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

