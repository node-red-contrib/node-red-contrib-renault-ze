import "isomorphic-fetch";

//#region Accounts
export interface RegisterData {
    purposes: any[];
    events: any[];
}

export interface Idp {
    idpId: string;
    idpType: string;
    idpStatus: string;
    login: string;
    loginType: string;
    lastLoginDate: Date;
    termsConditionAcceptance: boolean;
    termsConditionLastAcceptanceDate: Date;
    registerData: RegisterData;
    originUserId: string;
    originApplicationName: string;
}

export interface Email {
    emailType: string;
    emailValue: string;
    validityFlag: boolean;
    createdDate: Date;
    lastModifiedDate: Date;
    functionalCreationDate: Date;
    functionalModificationDate: Date;
}

export interface Account {
    accountId: string;
    accountType: string;
    accountStatus: string;
    country: string;
    personId: string;
    relationType: string;
}

export interface Accounts {
    personId: string;
    type: string;
    country: string;
    firstName: string;
    lastName: string;
    idp: Idp;
    emails: Email[];
    identities: any[];
    myrRequest: boolean;
    accounts: Account[];
    partyId: string;
    createdDate: Date;
    lastModifiedDate: Date;
    functionalCreationDate: Date;
    functionalModificationDate: Date;
    locale: string;
    originApplicationName: string;
    originUserId: string;
}
//#endregion

//#region Vehicles
    export interface CancellationReason {
    }

    export interface ConnectedDriver {
        role: string;
        createdDate: Date;
        lastModifiedDate: Date;
    }

    export interface DeliveryCountry {
        code: string;
        label: string;
    }

    export interface Family {
        code: string;
        label: string;
        group: string;
    }

    export interface Tcu {
        code: string;
        label: string;
        group: string;
    }

    export interface NavigationAssistanceLevel {
        code: string;
        label: string;
        group: string;
    }

    export interface Battery {
        code: string;
        label: string;
        group: string;
    }

    export interface RadioType {
        code: string;
        label: string;
        group: string;
    }

    export interface RegistrationCountry {
        code: string;
    }

    export interface Brand {
        label: string;
    }

    export interface Model {
        code: string;
        label: string;
        group: string;
    }

    export interface Gearbox {
        code: string;
        label: string;
        group: string;
    }

    export interface Version {
        code: string;
    }

    export interface Energy {
        code: string;
        label: string;
        group: string;
    }

    export interface Rendition {
        resolutionType: string;
        url: string;
    }

    export interface Asset {
        assetType: string;
        renditions: Rendition[];
    }

    export interface VehicleDetails {
        vin: string;
        engineType: string;
        engineRatio: string;
        modelSCR: string;
        deliveryCountry: DeliveryCountry;
        family: Family;
        tcu: Tcu;
        navigationAssistanceLevel: NavigationAssistanceLevel;
        battery: Battery;
        radioType: RadioType;
        registrationCountry: RegistrationCountry;
        brand: Brand;
        model: Model;
        gearbox: Gearbox;
        version: Version;
        energy: Energy;
        registrationNumber: string;
        vcd: string;
        assets: Asset[];
        yearsOfMaintenance: number;
        connectivityTechnology: string;
        easyConnectStore: boolean;
        electrical: boolean;
        rlinkStore: boolean;
        deliveryDate: string;
        retrievedFromDhs: boolean;
        engineEnergyType: string;
        radioCode: string;
    }

    export interface VehicleLink {
        brand: string;
        vin: string;
        status: string;
        linkType: string;
        garageBrand: string;
        mileage: number;
        mileageDate: string;
        startDate: string;
        createdDate: Date;
        lastModifiedDate: Date;
        cancellationReason: CancellationReason;
        connectedDriver: ConnectedDriver;
        vehicleDetails: VehicleDetails;
    }

    export interface Vehicles {
        accountId: string;
        country: string;
        vehicleLinks: VehicleLink[];
    }
//#endregion

//#region "Location"
    export interface LocationAttributes {
        gpsLatitude: number;
        gpsLongitude: number;
        lastUpdateTime: Date;
    }

    export interface LocationData {
        type: string;
        id: string;
        attributes: LocationAttributes;
    }

    export interface Location {
        data: LocationData;
    }
//#endregion

//#region "BatteryStatus"
    export interface BatteryStatusAttributes {
        timestamp: Date;
        batteryLevel: number;
        batteryTemperature: number;
        batteryAutonomy: number;
        batteryCapacity: number;
        batteryAvailableEnergy: number;
        plugStatus: number;
        chargingStatus: number;
        chargingRemainingTime: number;
        chargingInstantaneousPower: number;
    }

    export interface BatteryStatusData {
        type: string;
        id: string;
        attributes: BatteryStatusAttributes;
    }

    export interface BatteryStatus {
        data: BatteryStatusData;
    }
//#endregion

//#region Cockpit
export interface CockpitAttributes {
    fuelAutonomy: number;
    fuelQuantity: number;
    totalMileage: number;
}

export interface CockpitData {
    type: string;
    id: string;
    attributes: CockpitAttributes;
}

export interface Cockpit {
    data: CockpitData;
}

//#endregion

interface Servers {
    target: string;
    apikey:string;
}

export class ZEServices {
    private jwt: string = null;
    private token: string = null;
    private gigyaProd: Servers = null;
    private wiredProd: Servers = null;
    private country: string ="DE";

    private atob(a: string) {
        return Buffer.from(a, 'base64').toString('binary');
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

// ADD expiration -> TTL in seconds default 300

            + "&oauth_token=" + this.token
            , { method: "POST" })).json();

        this.jwt = json.id_token;

        return true;
    }

    async accounts(personId?:string, country?: string): Promise<Accounts> {

        if (!country) country = this.country;

        if (!personId) personId = this.parseJwt(this.jwt)["data.personId"];

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

        return new Promise((resolve)=> {resolve(account)});;
    }

    async vehicles(accountId: string, country?: string): Promise<Vehicles> {

        if (!country) country = this.country;

        if (this.jwt == null) return new Promise((resolve)=> {resolve(null)});

        let vehicles = await(await fetch(this.wiredProd.target
                +"/commerce/v1/accounts/"+accountId
                +"/vehicles"
                +"?country="+country
                ,{ 
                    method: "GET",
                    headers:
                    {
                        "apikey" : this.wiredProd.apikey,
                        "x-gigya-id_token": this.jwt
                    }
                })).json();

        return new Promise((resolve)=> {resolve(vehicles)});;
    }

    async location(accountId: string, vin: string, country?: string): Promise<Location> {

        if (!country) country = this.country;

        var result = await(await fetch(this.wiredProd.target
                +"/commerce/v1/accounts/"+accountId
                +"/kamereon/kca/car-adapter/v1/cars/"+vin
                +"/location"
                +"?country="+country
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

    async cockpit(accountId: string, vin: string, country?: string): Promise<Cockpit> {

        if (!country) country = this.country;

        var result = await(await fetch(this.wiredProd.target
                +"/commerce/v1/accounts/"+accountId
                +"/kamereon/kca/car-adapter/v2/cars/"+vin
                +"/cockpit"
                +"?country="+country
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

    async battery(accountId: string, vin: string, country?: string): Promise<BatteryStatus> {

        if (!country) country = this.country;

        var result = await(await fetch(this.wiredProd.target
                +"/commerce/v1/accounts/"+accountId
                +"/kamereon/kca/car-adapter/v2/cars/"+vin
                +"/battery-status"
                +"?country="+country
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
}