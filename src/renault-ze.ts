
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
            ZE.login(node.credentials.username, node.credentials.password)
                .then(() => {
                    return ZE.accounts();
                })
                .then((accounts) => {
                    let result: Promise<Vehicles>[] = [];
                    for (let item of accounts.accounts)
                    {
                        result.push(ZE.vehicles(item.accountId))
                    }
                    return Promise.all(result);
                })
                .then((accountvehicles) => {
                    for(let account of accountvehicles)
                    {
                        for(let vehicles of account.vehicleLinks)
                        {
                            if ((msg?.topic ?? 'location') == 'location')
                                ZE.location(account.accountId, vehicles.vin, account.country)
                                    .then((result)=> node.send({...msg, topic: 'location', payload: result}));
                            
                            if ((msg?.topic ?? 'battery-status') == 'battery-status')
                                ZE.batteryStatus(account.accountId, vehicles.vin, account.country)
                                    .then((result)=> node.send({...msg, topic: 'battery-status', payload: result}));

                            if ((msg?.topic ?? 'cockpit') == 'cockpit')
                                ZE.cockpit(account.accountId, vehicles.vin, account.country)
                                    .then((result)=> node.send({...msg, topic: 'cockpit', payload: result}));     
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