
import { ZEServices } from "./ZEServices";
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
                    accountId = accounts[0].accountId;
                    return ZE.vehicles(accountId);
                })
                .then((vehicles) => {
                    vin = vehicles[0].vin;
                    return ZE.location(accountId, vin);

                    //   return Promise.all(
                    //[ZE.location(accountId, vin),
                    // ZE.chargingDetails() 
                    //] );

                })
                .then((location)=> {
                    node.send({ payload: location});
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