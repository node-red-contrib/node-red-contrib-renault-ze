
import {ZEServices} from "./ZEServices";
import * as RED from "node-red";

interface renaultZeConfig extends RED.NodeDef {
    credentials: {
        username: string,
        password: string
    }
}

export default function(RED: RED.NodeAPI) {
    function RenaultZENode(config: renaultZeConfig) {
        RED.nodes.createNode(this,config);
        var node = this as RED.Node;
      
        node.on('input', function(msg: any) {
            let s = new ZEServices();
            s.login(config.credentials.username, config.credentials.password).then(() => {
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