/*
Copyright 2019 Andrew Stock

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("isomorphic-fetch");
class ZEServices {
    constructor() {
        this.token = "";
        this.vin = "";
    }
    login(username, password) {
        let body = {
            username,
            password,
        };
        return new Promise((resolve, reject) => {
            fetch("https://www.services.renault-ze.com/api/user/login", {
                "credentials": "omit",
                "headers": {
                    "accept": "application/json, text/plain, */*",
                    "accept-language": "en-US,en;q=0.9,en-GB;q=0.8",
                    "content-type": "application/json;charset=UTF-8"
                },
                "referrer": "https://www.services.renault-ze.com/user/login",
                "referrerPolicy": "no-referrer-when-downgrade",
                "body": JSON.stringify(body), "method": "POST", "mode": "cors"
            }).then(resp => {
                resp.json().then(val => {
                    this.token = val.token;
                    this.vin = val.user.vehicle_details.VIN;
                    resolve(true);
                }).catch(err => {
                    reject(err);
                });
            }).catch(err => {
                reject(err);
            });
        });
    }
    chargingDetails() {
        return new Promise((resolve, reject) => {
            fetch("https://www.services.renault-ze.com/api/vehicle/" + this.vin + "/battery", {
                "credentials": "include",
                "headers": {
                    "accept": "application/json, text/plain, */*",
                    "accept-language": "en-US,en;q=0.9,en-GB;q=0.8",
                    "authorization": "Bearer " + this.token
                },
                "referrer": "https://www.services.renault-ze.com/user/login",
                "referrerPolicy": "no-referrer-when-downgrade",
                "body": null,
                "method": "GET",
                "mode": "cors"
            }).then(resp => {
                resolve(resp.json());
            }).catch(err => {
                reject(err);
            });
        });
    }
}

module.exports = function(RED) {
    function RenaultZENode(config) {
        RED.nodes.createNode(this,config);
        var node = this;

        node.on('input', function(msg) {
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