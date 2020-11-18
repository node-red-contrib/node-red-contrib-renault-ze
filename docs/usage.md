# Usage

The renault-ze node can be controlled via the topic.
If no topic is set it automatically request all status informations and delivers messages.

If for example the topic is set to cockpit only this message is requested and delivered.

The node is controlled via 3 properties of the msg object.

The `vin` enables to send the request to only one car.

## Get configuration & status

topic          |description
---------------|-----------------------------------------------
               | like you send 3 messages with the topics: cockpit, location, battery-status
cockpit        | get milage data
location       | get the location
battery-status | get battery status data
charge-mode    | get the actual chargemode (always, scheduled, delayed)
...            |

## Set configuration

topic          |payload                          | description
---------------|---------------------------------|---------------------------------------
set-charge-mode| always_charging / schedule_mode | ...

TBD