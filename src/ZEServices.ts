import "isomorphic-fetch";

export class ZEServices {
    token: string;
    vin: string;

    constructor() {
        this.token = "";
        this.vin = "";
        console.log("---------- INIT ZE --------");
    }
    
    login(username:string , password: string) {
        let body = {
            username,
            password,
        };

        console.log("---------- Login --------");

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