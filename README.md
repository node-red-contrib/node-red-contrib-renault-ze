[![CLA assistant](https://cla-assistant.io/readme/badge/node-red-contrib/node-red-contrib-renault-ze)](https://cla-assistant.io/node-red-contrib/node-red-contrib-renault-ze)
![compile](https://github.com/node-red-contrib/node-red-contrib-renault-ze/workflows/compile/badge.svg)
[![CodeFactor](https://www.codefactor.io/repository/github/node-red-contrib/node-red-contrib-renault-ze/badge)](https://www.codefactor.io/repository/github/node-red-contrib/node-red-contrib-renault-ze)
[![npm version](https://badge.fury.io/js/node-red-contrib-renault-ze.svg)](https://badge.fury.io/js/node-red-contrib-renault-ze)

# Renault ZE Services node

Provides functionality to retrieve data from the Renault ZE Services API. Thanks to [Muscat's OxBlog](https://muscatoxblog.blogspot.com/2019/07/delving-into-renaults-new-api.html) for the documentation of the new API.
Designed to be installed into Node Red.

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

# Install

Install via the palette manage in the Node-RED admin ui (no restart needed). 

Alternatively run the following command in your Node-RED user directory (typically `~/.node-red`):

```sh
npm install node-red-contrib-renault-ze
```

then restart Node-RED and add an instance of the renault-ze node.

# Usage

Just send a messages to the node and you will receive a lot of status messages.
For details read the following [here](docs/usage.md).

You can simple start with the following flow to fetch some data from your cars:

![simple Flow](docs/quickstart.png)

<details>
  <summary>Click to expand the flow!</summary>
<pre>
[
    {
        "id": "8d884832.0b75d8",
        "type": "renault-ze",
        "z": "35cd1e62.3f2ff2",
        "name": "",
        "x": 480,
        "y": 300,
        "wires": [
            [
                "22f4a942.cea996"
            ]
        ]
    },
    {
        "id": "b923017a.ce46",
        "type": "inject",
        "z": "35cd1e62.3f2ff2",
        "name": "no topic -> charge / cockpit & location",
        "props": [],
        "repeat": "",
        "crontab": "",
        "once": false,
        "onceDelay": 0.1,
        "topic": "",
        "x": 190,
        "y": 220,
        "wires": [
            [
                "8d884832.0b75d8"
            ]
        ]
    },
    {
        "id": "22f4a942.cea996",
        "type": "debug",
        "z": "35cd1e62.3f2ff2",
        "name": "",
        "active": true,
        "tosidebar": true,
        "console": false,
        "tostatus": false,
        "complete": "true",
        "targetType": "full",
        "statusVal": "",
        "statusType": "auto",
        "x": 630,
        "y": 300,
        "wires": []
    },
    {
        "id": "ba475199.d46a9",
        "type": "inject",
        "z": "35cd1e62.3f2ff2",
        "name": "",
        "props": [
            {
                "p": "topic",
                "vt": "str"
            }
        ],
        "repeat": "",
        "crontab": "",
        "once": false,
        "onceDelay": 0.1,
        "topic": "charge-mode",
        "x": 270,
        "y": 280,
        "wires": [
            [
                "8d884832.0b75d8"
            ]
        ]
    },
    {
        "id": "9282bcf2.18602",
        "type": "inject",
        "z": "35cd1e62.3f2ff2",
        "name": "",
        "props": [
            {
                "p": "topic",
                "vt": "str"
            }
        ],
        "repeat": "",
        "crontab": "",
        "once": false,
        "onceDelay": 0.1,
        "topic": "hvac-schedule",
        "x": 260,
        "y": 340,
        "wires": [
            [
                "8d884832.0b75d8"
            ]
        ]
    },
    {
        "id": "931c1bd0.7fa698",
        "type": "inject",
        "z": "35cd1e62.3f2ff2",
        "name": "",
        "props": [
            {
                "p": "topic",
                "vt": "str"
            }
        ],
        "repeat": "",
        "crontab": "",
        "once": false,
        "onceDelay": 0.1,
        "topic": "charge-schedule",
        "x": 260,
        "y": 400,
        "wires": [
            [
                "8d884832.0b75d8"
            ]
        ]
    }
]
</pre>
</details>
