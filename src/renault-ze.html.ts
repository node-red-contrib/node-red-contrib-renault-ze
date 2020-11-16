import {EditorRED} from "node-red";
declare var RED: EditorRED;

RED.nodes.registerType('renault-ze',{
    category: 'Renault',
    color: '#a6bbcf',
    defaults: {
        name: {value:""}
    },
    inputs:1,
    outputs:1,
    icon: "file.png",
    label: function() {
        return this.name||"renault-ze";
    },
    credentials: {
        username: {type:"text"},
        password: {type:"password"}
    },
    //settings: ({} as any)
});