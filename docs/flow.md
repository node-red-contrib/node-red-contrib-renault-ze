# pure node-RED Flow

The first iteration was to implement a pure node-red flow to test and check the functionality.

```json
[
    {
        "id": "9b7058ab.fbb828",
        "type": "credentials",
        "z": "4eec83ba.3c0d9c",
        "name": "",
        "props": [
            {
                "value": "loginId",
                "type": "msg"
            },
            {
                "value": "password",
                "type": "msg"
            }
        ],
        "x": 470,
        "y": 60,
        "wires": [
            [
                "ce85a1be.a4e18"
            ]
        ]
    },
    {
        "id": "14c5deb2.a46a71",
        "type": "http request",
        "z": "4eec83ba.3c0d9c",
        "name": "",
        "method": "GET",
        "ret": "obj",
        "paytoqs": "ignore",
        "url": "https://renault-wrd-prod-1-euw1-myrapp-one.s3-eu-west-1.amazonaws.com/configuration/android/config_en_GB.json",
        "tls": "",
        "persist": false,
        "proxy": "",
        "authType": "",
        "x": 290,
        "y": 60,
        "wires": [
            [
                "9b7058ab.fbb828"
            ]
        ]
    },
    {
        "id": "ce85a1be.a4e18",
        "type": "function",
        "z": "4eec83ba.3c0d9c",
        "name": "gigya Login",
        "func": "return {\n    \"method\": \"POST\",\n    \"url\" :msg.payload.servers.gigyaProd.target+\n        \"/accounts.login\"+\n        \"?apikey=\"+msg.payload.servers.gigyaProd.apikey+\n        \"&loginID=\"+encodeURIComponent(msg.loginId)+\n        \"&password=\"+encodeURIComponent(msg.password),\n    \"wiredProd\" : msg.payload.servers.wiredProd,\n    \"gigyaProd\" : msg.payload.servers.gigyaProd\n};\n",
        "outputs": 1,
        "noerr": 0,
        "initialize": "",
        "finalize": "",
        "x": 290,
        "y": 120,
        "wires": [
            [
                "db0430ea.82ee4"
            ]
        ]
    },
    {
        "id": "db0430ea.82ee4",
        "type": "http request",
        "z": "4eec83ba.3c0d9c",
        "name": "",
        "method": "use",
        "ret": "obj",
        "url": "",
        "tls": "",
        "x": 490,
        "y": 120,
        "wires": [
            [
                "411ad798.141598"
            ]
        ]
    },
    {
        "id": "411ad798.141598",
        "type": "function",
        "z": "4eec83ba.3c0d9c",
        "name": "gigya JWT",
        "func": "return {\n    \"method\": \"GET\",\n    \"url\" :msg.gigyaProd.target+\n        \"/accounts.getJWT\"+\n        \"?apikey=\"+msg.gigyaProd.apikey+\n        \"&fields=data.personId,data.gigyaDataCenter\"+\n        \"&expiration=3000\"+\n        \"&oauth_token=\"+msg.payload.sessionInfo.cookieValue,\n    \"wiredProd\" : msg.wiredProd\n};\n",
        "outputs": 1,
        "noerr": 0,
        "initialize": "",
        "finalize": "",
        "x": 670,
        "y": 120,
        "wires": [
            [
                "97e65279.e6993"
            ]
        ]
    },
    {
        "id": "97e65279.e6993",
        "type": "http request",
        "z": "4eec83ba.3c0d9c",
        "name": "",
        "method": "use",
        "ret": "obj",
        "url": "",
        "tls": "",
        "x": 850,
        "y": 120,
        "wires": [
            [
                "8998f319.64ab4"
            ]
        ]
    },
    {
        "id": "8998f319.64ab4",
        "type": "function",
        "z": "4eec83ba.3c0d9c",
        "name": "get accountid",
        "func": "\nfunction atob(a)\n{\n   return new Buffer(a, 'base64').toString('binary');\n}\n\nfunction parseJwt (token) {\n    var base64Url = token.split('.')[1];\n    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');\n    var jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {\n        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);\n    }).join(''));\n    return JSON.parse(jsonPayload);\n}\n\nlet jwt = parseJwt(msg.payload.id_token);\n\nmsg.personId = jwt[\"data.personId\"];\nmsg.jwt = msg.payload.id_token;\nmsg.country=\"DE\";\n\nreturn {\n    \"method\": \"GET\",\n    \"headers\": {\n        \"apikey\" : msg.wiredProd.apikey,\n        \"x-gigya-id_token\": msg.jwt\n    },\n    \"url\" :msg.wiredProd.target+\n        \"/commerce/v1/persons/\"+msg.personId+\n        \"?country=\"+msg.country,\n    \"wiredProd\" : msg.wiredProd,\n    \"jwt\": msg.jwt,\n    \"personId\": msg.personId\n};\n",
        "outputs": 1,
        "noerr": 0,
        "initialize": "",
        "finalize": "",
        "x": 300,
        "y": 180,
        "wires": [
            [
                "610af131.df409"
            ]
        ]
    },
    {
        "id": "610af131.df409",
        "type": "http request",
        "z": "4eec83ba.3c0d9c",
        "name": "",
        "method": "use",
        "ret": "obj",
        "url": "",
        "tls": "",
        "x": 490,
        "y": 180,
        "wires": [
            [
                "c462290e.5bf998"
            ]
        ]
    },
    {
        "id": "7a618274.112b4c",
        "type": "http request",
        "z": "4eec83ba.3c0d9c",
        "name": "",
        "method": "use",
        "ret": "obj",
        "url": "",
        "tls": "",
        "x": 850,
        "y": 180,
        "wires": [
            [
                "186c611.7cc499f"
            ]
        ]
    },
    {
        "id": "186c611.7cc499f",
        "type": "function",
        "z": "4eec83ba.3c0d9c",
        "name": "extract vehicle",
        "func": "// check for vehicle.status = ACTIVE\n\nlet vehicle = msg.payload.vehicleLinks[0];\n\nmsg.vin=vehicle.vin;\n\nreturn {\n    \"wiredProd\" : msg.wiredProd,\n    \"jwt\": msg.jwt,\n    \"accountId\": msg.accountId,\n    \"country\": msg.country,\n    \"vin\": msg.vin\n};\n",
        "outputs": 1,
        "noerr": 0,
        "initialize": "",
        "finalize": "",
        "x": 280,
        "y": 280,
        "wires": [
            [
                "47e92197.f7b07",
                "4417b0c1.7768a",
                "39f960a0.fb104"
            ]
        ]
    },
    {
        "id": "47e92197.f7b07",
        "type": "function",
        "z": "4eec83ba.3c0d9c",
        "name": "get location",
        "func": "return {\n    \"method\": \"GET\",\n    \"headers\": {\n        \"apikey\" : msg.wiredProd.apikey,\n        \"x-gigya-id_token\": msg.jwt\n    },\n    \"url\" :msg.wiredProd.target+\n        \"/commerce/v1/accounts/\"+msg.accountId+\n        \"/kamereon/kca/car-adapter/v1/cars/\"+msg.vin+\n        \"/location\"+\n        \"?country=\"+msg.country,\n    \"topic\": \"car-location\"\n};\n",
        "outputs": 1,
        "noerr": 0,
        "initialize": "",
        "finalize": "",
        "x": 490,
        "y": 260,
        "wires": [
            [
                "bd171c5b.e52a1"
            ]
        ]
    },
    {
        "id": "4417b0c1.7768a",
        "type": "function",
        "z": "4eec83ba.3c0d9c",
        "name": "get cockpit",
        "func": "return {\n    \"method\": \"GET\",\n    \"headers\": {\n        \"apikey\" : msg.wiredProd.apikey,\n        \"x-gigya-id_token\": msg.jwt\n    },\n    \"url\" :msg.wiredProd.target+\n        \"/commerce/v1/accounts/\"+msg.accountId+\n        \"/kamereon/kca/car-adapter/v2/cars/\"+msg.vin+\n        \"/cockpit\"+\n        \"?country=\"+msg.country,\n    \"topic\": \"car-cockpit\"\n};\n",
        "outputs": 1,
        "noerr": 0,
        "initialize": "",
        "finalize": "",
        "x": 490,
        "y": 300,
        "wires": [
            [
                "bd171c5b.e52a1"
            ]
        ]
    },
    {
        "id": "bd171c5b.e52a1",
        "type": "http request",
        "z": "4eec83ba.3c0d9c",
        "name": "",
        "method": "use",
        "ret": "obj",
        "url": "",
        "tls": "",
        "x": 670,
        "y": 300,
        "wires": [
            [
                "46755762.3054f8"
            ]
        ]
    },
    {
        "id": "39f960a0.fb104",
        "type": "function",
        "z": "4eec83ba.3c0d9c",
        "name": "get battery",
        "func": "return {\n    \"method\": \"GET\",\n    \"headers\": {\n        \"apikey\" : msg.wiredProd.apikey,\n        \"x-gigya-id_token\": msg.jwt\n    },\n    \"url\" :msg.wiredProd.target+\n        \"/commerce/v1/accounts/\"+msg.accountId+\n        \"/kamereon/kca/car-adapter/v2/cars/\"+msg.vin+\n        \"/battery-status\"+\n        \"?country=\"+msg.country,\n    \"topic\": \"car-battery-status\"\n};\n",
        "outputs": 1,
        "noerr": 0,
        "initialize": "",
        "finalize": "",
        "x": 490,
        "y": 340,
        "wires": [
            [
                "bd171c5b.e52a1"
            ]
        ]
    },
    {
        "id": "46755762.3054f8",
        "type": "function",
        "z": "4eec83ba.3c0d9c",
        "name": "prepare influx",
        "func": "let values = msg.payload.data.attributes;\n\nif(values.timestamp)\n    delete values.timestamp;\n\nreturn {\n        measurement : msg.topic,\n        payload : [\n            values,\n            {\n                vin: msg.payload.data.id\n            }\n            ]\n    }\n",
        "outputs": 1,
        "noerr": 0,
        "initialize": "",
        "finalize": "",
        "x": 860,
        "y": 300,
        "wires": [
            []
        ]
    },
    {
        "id": "c462290e.5bf998",
        "type": "function",
        "z": "4eec83ba.3c0d9c",
        "name": "get vehicles",
        "func": "//  check for \"accountStatus\": \"ACTIVE\",\n// loop through array\n\nlet account = msg.payload.accounts[0];\n\nmsg.accountId=account.accountId;\nmsg.country=account.country;\n\nreturn {\n    \"method\": \"GET\",\n    \"headers\": {\n        \"apikey\" : msg.wiredProd.apikey,\n        \"x-gigya-id_token\": msg.jwt\n    },\n    \"url\" :msg.wiredProd.target+\n        \"/commerce/v1/accounts/\"+msg.accountId+\n        \"/vehicles\"+\n        \"?country=\"+msg.country,\n    \"wiredProd\" : msg.wiredProd,\n    \"jwt\": msg.jwt,\n    \"accountId\": msg.accountId,\n    \"country\": msg.country,\n};\n",
        "outputs": 1,
        "noerr": 0,
        "initialize": "",
        "finalize": "",
        "x": 670,
        "y": 180,
        "wires": [
            [
                "7a618274.112b4c"
            ]
        ]
    }
]
```
