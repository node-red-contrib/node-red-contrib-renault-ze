
import { ZEServices, Vehicles } from "./ZEServices";
import { NodeAPI, Node } from "node-red";

interface renaultCredentials {
    username: string,
    password: string
}

export = function (RED: NodeAPI) {
    function RenaultZENode(config: any) {
        var node = this as Node<renaultCredentials>;
        RED.nodes.createNode(node, config);

        let ZE = new ZEServices();

        node.on('input', (msg: any) => {

            let accountId: string = null;
            let vin: string = null;

            let topicList = [];
            if (!msg.topic) {
                topicList.push('location');
                topicList.push('cockpit');
                topicList.push('battery-status');
            }
            else
                topicList.push(msg.topic.toLowerCase());

            ZE.login(node.credentials.username, node.credentials.password)
                .then(() => {
                    return ZE.accounts();
                })
                .then((accounts) => {
                    let result: Promise<Vehicles>[] = [];
                    for (let item of accounts.accounts) {
                        result.push(ZE.vehicles(item.accountId))
                    }
                    return Promise.all(result);
                })
                .then((accountvehicles) => {
                    for (let account of accountvehicles) {
                        for (let vehicles of account.vehicleLinks) {
                            // if a vin is defined only this will be fetched
                            if (!(!msg?.vin) && vehicles.vin != msg.vin) {
                                break;
                            }

                            for (let topic of topicList) {
                                switch (topic) {
                                    case "set-charge-mode":
                                        ZE.setChargeMode(msg.payload, account.accountId, vehicles.vin, account.country)
                                            .then((result) => node.send({ ...msg, topic: topic, payload: result }));
                                        break;
                                    case "set-charge-state":
                                        ZE.setChargeState(msg.payload, account.accountId, vehicles.vin, account.country)
                                            .then((result) => node.send({ ...msg, topic: topic, payload: result }));
                                        break;
                                    case "set-hvac-state":
                                        ZE.setHVACState(msg.payload, account.accountId, vehicles.vin, account.country)
                                            .then((result) => node.send({ ...msg, topic: topic, payload: result }));
                                        break;
                                    case "set-charge-schedule":
                                        ZE.setChargeSchedule(msg.payload, account.accountId, vehicles.vin, account.country)
                                            .then((result) => node.send({ ...msg, topic: topic, payload: result }));
                                        break;
                                    case "set-hvac-schedule":
                                        ZE.setHVACSchedule(msg.payload, account.accountId, vehicles.vin, account.country)
                                            .then((result) => node.send({ ...msg, topic: topic, payload: result }));
                                        break;
                                    default:
                                        ZE.getAttribute(topic, account.accountId, vehicles.vin, account.country)
                                            .then((result) => node.send({ ...msg, topic: topic, payload: result }));
                                        break;
                                }
                            }
                        }
                    }
                })
                .catch((err) => {
                    node.error(err);
                });
        });
    }

    RED.nodes.registerType("renault-ze", RenaultZENode, {
        credentials: {
            username: { type: "text" },
            password: { type: "password" }
        }
    });
}