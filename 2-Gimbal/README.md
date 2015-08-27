## Gimbal Control

Aims :

* Get control of the gimbal, using non-IDE tools (i.e. ```ino``` on Fedora)
  - ```0-blink```

* Check reference source code for the gimbal
  - ```1-gimbal-original-brugi```

* Upload ```Firmata``` to allow Node control over gimbal
  - ```2-standard-firmata```

* Determine the pin-out of the gimbal 
  - ```3-node-control```

* Do something interesting/alternative with the Gimbal
  - ```4-painter```



#### Mid-way Lightning Talk

A lightning talk about the project was made at at (Hackware v1.0 on 26-Aug-2015 in Singapore](http://www.meetup.com/Hackware/events/223761435).

Brief outline : 

*  Describe origins of 'robot'
   +   Quadcopter
   +   Pricing, features
   +   Nodebot-able Arduino-a-like
*  Describe what can be done
   +   Robot itself
   +   nodejs sending, nodejs opencv (zeromq)
   +   Problems : Cogging, twanging, etc


Demonstrate :

*  moving around using cursor keys
*  Coordinate updates of webcam

### Future Plans

Would like (time permitting) :

*  Calibration mode (small moves)
*  Centering mode (bigger moves, and adjustments)
*  Observation lag calibration mode
*  Circling mode
*  Hello Kitty mode


To accomplish that (ideally) require :

*  'mode' defines goal state(s) for movement
*  Initial 'self model' must be calibrated
*  Model maps 'self state', 'external observations' and 'desired state' to 'control signals'

But, this can be simplistically acheived by :

*  Calibration : Perform given sequence of moves and capture basic dx, dy, timescale sensitivities
   +   Track location after each move and Wait for settle after each one (+/-1 pixel dwell for 100ms?)
   +   Perform move command, and then capture opencv output to timestamped series
   +   After each addition, check whether we should be in our next 'state'
   +   ?States will be 'wait until location stable', 'wait until not at()', etc...
   +   Or : Sequence of commands will be actions() which can include move commands and wait commands

So : Most logical programming enviroment would have 3 processes : 

*  OpenCV 'environment'
*  Controller; and 
*  Robot actions - which would be :
   +  simple position controls 
   +  or maybe velocity 
   +  or maybe accelerations
   +  or velocity/position limits with accelerations, etc (this may make the action space safer to explore, but bigger)

Maybe, OTOH, the better controller output would be a position vs time graph, so that the robot actions (which would be only sampled intermittently, due to frequency of updates, etc) could be interpolated when the next action is desired.  This would avoid having to do synchronous / timing sensitive loops.  

Another rationale for this idea is that (from observation) the webcam state observations are very laggy (compared to the potential movement speed of the motors), so it would be good to have an internal state model that's continuous, which would allow de-lagged state measurements to feedback into estimates of history.
