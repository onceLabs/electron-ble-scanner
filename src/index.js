// BLE variables
let ble_device;
let ble_server;
let ble_service;
let ble_rw_characteristic;
let ble_nr_characteristic;

//these are my testing device, replace you own.
const BLE_SERVICE_UUID = 'f5dc3761-ce15-4449-8cfa-7af6ad175056';
const BLE_RW_CHARACTERISTIC_UUID = 'f5dc3762-ce15-4449-8cfa-7af6ad175056';
const BLE_NR_CHARACTERISTIC_UUID = 'f5dc3764-ce15-4449-8cfa-7af6ad175056';

/* Utils */
//Display debug msg
let status_buffer = ['', '', '', '', ''];
const status_log = str => {
const d = new Date();
    status_buffer.push(`${d.toLocaleTimeString()} ${str}`);
    status_buffer.shift();
    document.getElementById("status").innerHTML = status_buffer.reduce((a, b) => {return (a + b + "<br />")},'');		
}

// This function keeps calling "toTry" until promise resolves or has
// retried "max" number of times. First retry has a delay of "delay" seconds.
// "success" is called upon success.
const exponentialBackoff = (max, delay, toTry, success, fail) => {
    status_log(`exponentialBackoff: max:${max} delay:${delay}`);
    toTry().then(result => success(result))
    .catch(_ => {
        if (max === 0) {
            return fail();
        }
        setTimeout(() => {
            exponentialBackoff(--max, delay * 2, toTry, success, fail);
        }, delay * 1000);
    });
}

//to check duplecate
let discoverd_id = []; 

//device Id to connect set by renderer
let deviceToConnect = null;

//detect connecting or not
let connecting = false;

//this function called from requestDevice and disconnection event
const connectToDevice = _device => {
    connecting = true;
    status_log("Connecting to device");
    return _device.gatt.connect()
    .then(server =>{
        console.log("server", server)
        status_log("Connected to GATT server");
        ble_server = server;
        // You have get all primary if you include optionalServices when you perform the search,
        // otherwise you will get a privacy violation here
        return server.getPrimaryServices();
    })				
    .then(services => {
        services.forEach((service) => {
            service.getCharacteristics().then((characteristics) => {
              console.log('>> Service: ' + service.uuid)
              characteristics.forEach((characteristic) => {
                console.log('>>>> Characteristic: ' + characteristic.uuid)
              })
            })
          })
        // console.log("service", service)
        // ble_service = service;
        // return Promise.all([
        //     ble_service.getCharacteristic(BLE_NR_CHARACTERISTIC_UUID)
        //         .then(characteristic => {
        //             ble_nr_characteristic = characteristic;
        //             ble_nr_characteristic.startNotifications();
        //             ble_nr_characteristic.addEventListener('characteristicvaluechanged',handleNotifications);
        //             console.log("characteristic:", characteristic);
        //         }),
        //     ble_service.getCharacteristic(BLE_RW_CHARACTERISTIC_UUID)
        //         .then(characteristic => {
        //         ble_rw_characteristic = characteristic;
        //         console.log("characteristic:", characteristic);
        //     })
        // ])
    })
    .then( () => {
        connecting = false;
        status_log("Completed BLE connection");
    })
    .catch(error => {
        console.log(`server func error: ${error}`);
        return fail();
    });
}

//Scan start by user
const scan = () => {
    //unlink active connection
    disconnect();
    //initialize list
    document.getElementById('deviceList').innerHTML = '';
    discoverd_id = [];
    //to receive device list in main, notify to main
    window.api.send('scan', 'scan');
    status_log("Now scanning");
    let options = {};
    let filters = [];

    filters.push({namePrefix: "BLUEBIRD"});
    filters.push({optionalServices: {BLE_SERVICE_UUID}});
    options.acceptAllDevices = false;
    options.filters = filters;
    navigator.bluetooth.requestDevice({
        filters: [{ name: "BLUEBIRD" }],
        optionalServices: ["00003000-c356-78ab-3c46-339399e84975"],//You have to include this, even if it's not acutally advertised so you can discoverServices after connecting
      })
    .then(device => {
        ble_device = device;
        ble_device.addEventListener('gattserverdisconnected', onDisconnected);
        console.log("device", device);
        return connectToDevice(device);
    })
    .catch(error => {
        console.log(`server func error: ${error}`);
    });
}

//receive device information
window.api.on('discoverd-device', (message) => {
    //status_log(message);
    const device = JSON.parse(message);
    if(!discoverd_id.includes(device.deviceId)){
        discoverd_id.push(device.deviceId);
        document.getElementById('deviceList').innerHTML += "<li class=\"list-group-item\" onclick=\"setConnectDeviceId('" + device.deviceId + "')\">" + device.deviceName + ": " + device.deviceId + "</li>";
    }
})

//send deviceId to renderer
const setConnectDeviceId = (deviceId) => {
    deviceToConnect = deviceId;
    status_log('Trying to connect ' + deviceId);
    window.api.send('connectDeviceId', deviceId)  
}

//disconnection event both manually and incidentally
const onDisconnected = () => {
    status_log('Bluetooth Device disconnected from device.');
    
    //sometimes event handler broken 
    if(deviceToConnect !== null && !connecting){
        exponentialBackoff(30, 3,
            () => {
                //sometimes dead ble_device continue to reconnect
                //ble_device.gatt.disconnect();
                return connectToDevice(ble_device);
            },
            () => {
                status_log('exponentialBackoff: Success to reconnect.');
            },
            () => {
                status_log('exponentialBackoff: Failed to reconnect.');
            }
        );					
    }

    if(connecting){
        ble_device.gatt.disconnect();
    }
}

//disconnect manually
const disconnect = () => {
    //initialize list
    document.getElementById('deviceList').innerHTML = '';
    discoverd_id = [];

    //to prevent auto reconnect
    deviceToConnect = null;

    if (!ble_device || !ble_device.gatt.connected) return ;
    ble_device.gatt.disconnect();
    status_log("Manually disconnected from user.")
}

//notification handling
const handleNotifications = event => {
    const value = event.target.value;
    let notf_data = new Uint8Array(20);
    for (let i = 0; i < 20; i++) {
        notf_data[i] = value.getUint8(i);
    }

    status_log(`Notification: ${notf_data}`);
}

