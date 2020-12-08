

export default {

    "environmentalServiceUUID" : "00001000-c356-78ab-3c46-339399e84975",
      "tempCharacteristicUUID" : "00001001-c356-78ab-3c46-339399e84975",
      "lightSensorCharacteristicUUID" : "00001003-c356-78ab-3c46-339399e84975",

    "motionServiceUUID" : "00002000-c356-78ab-3c46-339399e84975",
      "accelerometerCharacteristicUUID" : "00002001-c356-78ab-3c46-339399e84975",

    "deviceInformationUUID" : "0000180a-0000-1000-8000-00805f9b34fb",
      "firmwareVersionCharacteristicUUID" : "00002a26-0000-1000-8000-00805f9b34fb",
      "serialNumberCharacteristicUUID" : "00002a28-0000-1000-8000-00805f9b34fb",

    "gpioServiceUUID" : "00003000-c356-78ab-3c46-339399e84975",
      "gpioOneCharacteristicUUID" : "00003001-c356-78ab-3c46-339399e84975",
      "gpioTwoCharacteristicUUID" : "00003002-c356-78ab-3c46-339399e84975",
      "gpioThreeCharacteristicUUID" : "00003004-c356-78ab-3c46-339399e84975",
      "gpioFourCharacteristicUUID" : "00003005-c356-78ab-3c46-339399e84975",

    "ledServiceUUID" :  "00004000-c356-78ab-3c46-339399e84975",
      "ledCharacteristicUUID" : "00004001-c356-78ab-3c46-339399e84975",

    "serialServiceUUID" : "00005000-c356-78ab-3c46-339399e84975",
      
    "audioServiceUUID" : "00006000-c356-78ab-3c46-339399e84975",
      "audioCharacteristicUUID" : "00006002-c356-78ab-3c46-339399e84975",

    "advertisingName": "BLUEBIRD",
  
    "services": {
      // information: "180a": {},
      "device_information" : {
        "name": "deviceInformation",
        "characteristics": {
          "software_revision_string": "serialNumber",
          "firmware_revision_string": "firmwareVersion", 
        }
      },
      "00001000-c356-78ab-3c46-339399e84975" : {
        "name": "environment",
        "characteristics": {
          "00001001-c356-78ab-3c46-339399e84975": "toggleTEMP",
          "00001003-c356-78ab-3c46-339399e84975": "colorSensorAmbient",
        }
      },
      "00002000-c356-78ab-3c46-339399e84975" : {
        "name": "motion",
        "characteristics": {
          "00002001-c356-78ab-3c46-339399e84975": "toggleAcceleration",
        }
      },
      "00003000-c356-78ab-3c46-339399e84975" : {
        "name": "gpio",
        "characteristics": {
          "00003001-c356-78ab-3c46-339399e84975": "gpio1",
          "00003002-c356-78ab-3c46-339399e84975": "gpio2",
          "00003003-c356-78ab-3c46-339399e84975": "gpio3",
          "00003004-c356-78ab-3c46-339399e84975": "gpio4",
        }
      },
      "00004000-c356-78ab-3c46-339399e84975" : {
        "name": "led",
        "characteristics": {
          "00004001-c356-78ab-3c46-339399e84975": "ledColor",
        }
      },
      "00005000-c356-78ab-3c46-339399e84975" : {
        "name": "serial",
        "characteristics": { }
      },
      "00006000-c356-78ab-3c46-339399e84975" : {
        "name": "audio",
        "characteristics": {
          "00006002-c356-78ab-3c46-339399e84975": "toggleAudio",
        }
      },
    }
  };
  