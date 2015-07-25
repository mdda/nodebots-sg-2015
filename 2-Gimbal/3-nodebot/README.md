


// https://github.com/rwaldron/johnny-five
// https://github.com/rwaldron/johnny-five/wiki/Board
// https://www.arduino.cc/en/Main/ArduinoBoardPro

###  Install StandardFirmata
* In directory above

### Install the essential node module

```
npm install johnny-five
```


### Run the code
(no arduino ```ino``` magic required now)

```
node gimbal.js
```



### PIN assignments for Gimbal

* Blue LED : PIN 8

* PWM PINS : {3, 5, 6, 9, 10, 11}  (confirmed in ```BLcontroller.h```) :
```
  pinMode(3, OUTPUT);
  pinMode(5, OUTPUT);
  pinMode(6, OUTPUT);
  pinMode(9, OUTPUT);
  pinMode(10, OUTPUT);
  pinMode(11, OUTPUT);
  
  // Enable Timer1 Interrupt for Motor Control
  OCR2A = 0;  //D11 APIN
  OCR2B = 0;  //D3
  OCR1A = 0;  //D9  CPIN
  OCR1B = 0;  //D10 BPIN
  OCR0A = 0;  //D6
  OCR0B = 0;  //D5 
```

And, from ```definitions.h``` :
```
// Hardware Abstraction for Motor connectors,
// DO NOT CHANGE UNLES YOU KNOW WHAT YOU ARE DOING !!!
#define PWM_A_MOTOR1 OCR2A
#define PWM_B_MOTOR1 OCR1B
#define PWM_C_MOTOR1 OCR1A

#define PWM_A_MOTOR0 OCR0A
#define PWM_B_MOTOR0 OCR0B
#define PWM_C_MOTOR0 OCR2B
```

Therefore : 

* PWM pins for 1 motor : [A,B,C]=[11, 10, 9]
* PWM pins for 0 motor : [A,B,C]=[ 6,  5, 3]

