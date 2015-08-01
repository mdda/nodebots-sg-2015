## Gimbal Light-Painter Idea

This should be able to control an LASER point attached to the gimbal,
using a webcam to track its position.


###  Install OpenCV

```
sudo dnf install opencv-devel v4l-devel
npm install
```

### Run the code

Attach the gimbal, attach the webcam (make sure the webcam device is as specified at the top
of ```painter.js```, then ensure that both are accessible to you :

```
node painter.js
```
