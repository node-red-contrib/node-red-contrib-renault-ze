import "isomorphic-fetch";

interface Accounts {
    accountId: string;
    accountType: string; // "MYRENAULT"
    accountStatus: string; // "ACTIVE"
    country:string; // "DE"
    personId: string;
    relationType: string; // "OWNER"
}

interface Vehicles {
    vin: string;
}
interface Servers {
    target: string;
    apikey:string;
}

export class ZEServices {
    jwt: string = null;
    token: string = null;
    gigyaProd: Servers = null;
    wiredProd: Servers = null;
    country: string ="DE";

    private atob(a: string) {
        return new Buffer(a, 'base64').toString('binary');
    }

    private parseJwt(token: string) {
        var base64Url = token.split('.')[1];
        var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        var jsonPayload = decodeURIComponent(this.atob(base64).split('').map(function (c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        return JSON.parse(jsonPayload);
    }

    constructor() {

    }

    async login(loginId: string, password: string) {

        let configURL = 'https://renault-wrd-prod-1-euw1-myrapp-one.s3-eu-west-1.amazonaws.com/configuration/android/config_en_GB.json';

        let config = await (await fetch(configURL, { method: "GET" })).json();

        this.gigyaProd = config.servers.gigyaProd;
        this.wiredProd = config.servers.wiredProd;

        let oauth = await (await fetch(this.gigyaProd.target
            + "/accounts.login"
            + "?apikey=" + this.gigyaProd.apikey
            + "&loginID=" + encodeURIComponent(loginId)
            + "&password=" + encodeURIComponent(password)
            , { method: "POST" })).json();

        this.token = oauth.sessionInfo.cookieValue;

        let json = await (await fetch(this.gigyaProd.target
            + "/accounts.getJWT"
            + "?apikey=" + this.gigyaProd.apikey
            + "&fields=data.personId,data.gigyaDataCenter"
            + "&oauth_token=" + this.token
            , { method: "POST" })).json();

        this.jwt = json.id_token;

        return true;
    }

    async accounts(): Promise<Accounts[]> {

        if (this.jwt == null) return new Promise((resolve)=> {resolve(null)});

        let personId = this.parseJwt(this.jwt)["data.personId"];

        var account = await(await fetch(this.wiredProd.target
                +"/commerce/v1/persons/"+personId
                +"?country="+this.country
                ,{ 
                    method: "GET",
                    headers:
                    {
                        "apikey" : this.wiredProd.apikey,
                        "x-gigya-id_token": this.jwt
                    }
                })).json();

        return new Promise((resolve)=> {resolve(account.accounts)});;
    }

    async vehicles(accountId: string): Promise<Vehicles[]> {

        if (this.jwt == null) return new Promise((resolve)=> {resolve(null)});

        let vehicles = await(await fetch(this.wiredProd.target
                +"/commerce/v1/accounts/"+accountId
                +"/vehicles"
                +"?country="+this.country
                ,{ 
                    method: "GET",
                    headers:
                    {
                        "apikey" : this.wiredProd.apikey,
                        "x-gigya-id_token": this.jwt
                    }
                })).json();

        return new Promise((resolve)=> {resolve(vehicles.vehicleLinks)});;
    }

    async location(accountId: string, vin: string): Promise<any> {

        if (this.jwt == null) return new Promise((resolve)=> {resolve(null)});

        var result = await(await fetch(this.wiredProd.target
                +"/commerce/v1/accounts/"+accountId
                +"/kamereon/kca/car-adapter/v1/cars/"+vin
                +"/location"
                +"?country="+this.country
                ,{ 
                    method: "GET",
                    headers:
                    {
                        "apikey" : this.wiredProd.apikey,
                        "x-gigya-id_token": this.jwt
                    }
                })).json();

        return new Promise((resolve)=> {resolve(result)});;
    }

    chargingDetails() {
        //  this.jwtObject = this.parseJwt(json.id_token);
        return new Promise((resolve, reject) => {
            resolve();
        });
    }
}