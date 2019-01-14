Renault ZE Services node
========================

Provides functionality to retrieve data from the Renault ZE Services API. Designed to be installed into Node Red.

Currently, this node only supports a single vehicle on the account and will require configuration of the credentials used to sign on to the Renault ZE service.

When triggered, the node will login and retrive the current charging state of the vehicle. It will output a message payload as follows:

``` json
{
    "charging":false,
    "plugged":false,
    "charge_level":23,
    "remaining_range":21,
    "last_update":1547487992000
}
```