## Gimbal Light-Painter Idea

This should be able to control an LASER point attached to the gimbal,
using a webcam to track its position.

###  Install OpenCV

```
sudo dnf install opencv-devel v4l-devel
npm install
```

### Launch the code

Attach the gimbal, attach the webcam (make sure the webcam device is as specified at the top
of ```spotter.js```, then ensure that both are accessible to you :

```
# In one terminal : 
node painter.js

# In another terminal :
node spotter.js
```

### Control the Robot

Basic scheme (the keystrokes given are on ```spotter.js``` window, unless otherwise specified): 

* Press ```Esc``` : This will cause the gimbal to *freewheel*

* Manually move the pointer so that it's within the field of view of the webcam
   * You can use the arrow keys in the ```painter.js``` window to do this
   * Or... Brute-force the general position by hand (each on USB power, less so on 12V external)

* Then press ```1``` on the ```spotter.js``` viewer window
   * This will set the 'spotter origin' (motor-offset=(0,0)) to the location seen

* Then press ```2``` to do a 'local calibration' for small motor movements

* Then press ```3``` to move the pointer to the center of the screen, using the local calibration only

* Then press ```4``` to do a more comprehensive calibration...

* Then press ```5``` to draw a picture as well as currently possible


