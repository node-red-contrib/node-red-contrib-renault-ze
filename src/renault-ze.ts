
import {ZEServices} from "./ZEServices";
import * as RED from "node-red";

interface renaultZeConfig extends RED.NodeDef {
    credentials: renaultCredentials
}

interface renaultCredentials
{
    username: string,
    password: string
}

export = function(RED: RED.NodeAPI) {
    function RenaultZENode(config: renaultZeConfig) {
        RED.nodes.createNode(this,config);
        var node = this as RED.Node<renaultCredentials>;
      
        node.credentials
        node.on('input', function(msg: any) {
            let s = new ZEServices();
            s.login(node.credentials.username, node.credentials.password).then(() => {
                s.chargingDetails().then(val => {
                    msg.payload = val;
                    node.send(msg);
                });
            }).catch((err) => {
                node.error(err);
            });
        });

        this.on('close', function() {
        });
    }
    RED.nodes.registerType("renault-ze",RenaultZENode,{
        credentials: {
            username: {type:"text"},
            password: {type:"password"}
        }
    });
}