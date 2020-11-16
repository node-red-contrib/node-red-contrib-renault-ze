[![CLA assistant](https://cla-assistant.io/readme/badge/node-red-contrib/node-red-contrib-renault-ze)](https://cla-assistant.io/node-red-contrib/node-red-contrib-renault-ze)
![compile](https://github.com/node-red-contrib/node-red-contrib-renault-ze/workflows/compile/badge.svg)
[![CodeFactor](https://www.codefactor.io/repository/github/node-red-contrib/node-red-contrib-renault-ze/badge)](https://www.codefactor.io/repository/github/node-red-contrib/node-red-contrib-renault-ze)
[![npm version](https://badge.fury.io/js/node-red-contrib-renault-ze.svg)](https://badge.fury.io/js/node-red-contrib-renault-ze)

# Renault ZE Services node

Provides functionality to retrieve data from the Renault ZE Services API. Designed to be installed into Node Red.

When triggered, the node will login and retrieve the status of the vehicles.
It will output multiple messages for battery, cockpit,... payload see the following example:

``` json
{
    "data": {
        "type": "Car",
        "id": "VF1XX000000000000",
        "attributes": {
            "timestamp": "2020-11-15T14:02:00Z",
            "batteryLevel": 86,
            "batteryTemperature": 20,
            "batteryAutonomy": 310,
            "batteryCapacity": 0,
            "batteryAvailableEnergy": 44,
            "plugStatus": 0,
            "chargingStatus": 0,
            "chargingRemainingTime": 30,
            "chargingInstantaneousPower": 11.9
        }
    }
}
```