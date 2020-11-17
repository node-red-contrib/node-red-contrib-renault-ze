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
    export interface CancellationReason {}

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

export interface DataContainer<T>
{
    data: Data<T>;
}

export interface Data<T> {
    type: string;
    id?: string;
    attributes: T;
}

//#region "Location"
export interface LocationAttributes {
    gpsLatitude: number;
    gpsLongitude: number;
    lastUpdateTime: Date;
}

export interface Location extends DataContainer<LocationAttributes>{}
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

    export interface BatteryStatus extends DataContainer<BatteryStatusAttributes>{}
//#endregion

//#region Cockpit
export interface CockpitAttributes {
    fuelAutonomy: number;
    fuelQuantity: number;
    totalMileage: number;
}

export interface Cockpit extends DataContainer<CockpitAttributes> {
}
//#endregion

//#region ChargeMode
export interface ChargeModeAttributes {
    "chargeMode": "always" | "always_charging" | "schedule_mode";
}

export interface ChargeMode extends DataContainer<ChargeModeAttributes> {
}
//#endregion

//#region HVAC & Charge Shedule
export interface HVAC_Entry {
    startTime: string;
    activationState: boolean;
}

export interface Charge_Entry extends HVAC_Entry {
    duration: number;
}

export interface Calendar<T> {
    monday: T[];
    tuesday: T[];
    wednesday: T[];
    thursday: T[];
    friday: T[];
    saturday: T[];
    sunday: T[];
}

export interface SheduleAttributes<T> {
    calendar: Calendar<T>;
}
export interface HVAC_Shedule extends DataContainer<HVAC_Entry> {
}

export interface Charge_Shedule extends DataContainer<Charge_Entry> {
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
            + "&expiration=3600" // TTL in seconds default 300
            + "&oauth_token=" + this.token
            , { method: "POST" })).json();

        this.jwt = json.id_token;

        return true;
    }

    async getJSON<T>(PATH: string, country?: string): Promise<T> {
        if (this.jwt == null) return new Promise((resolve)=> {resolve(null)});

        if (!country) country = this.country;

        var res = await fetch(this.wiredProd.target+PATH,{
            method: "GET",
            headers:
            {
                "apikey" : this.wiredProd.apikey,
                "x-gigya-id_token": this.jwt
            }
        });

        return res.json();
    }

    async postJSON<T>(data: DataContainer<any>, PATH: string, country?: string): Promise<T> {
        if (this.jwt == null) return new Promise((resolve)=> {resolve(null)});

        if (!country) country = this.country;

        var res = await fetch(this.wiredProd.target+PATH,{
            method: "POST",
            body: JSON.stringify(data),
            headers:
            {
                "apikey" : this.wiredProd.apikey,
                "x-gigya-id_token": this.jwt,
                "Content-Type": "application/vnd.api+json"
            }
        });

        return res.json();
    }

    private  createPath(accountId: string, vin: string, version: number=1):string
    {
        return "/commerce/v1/accounts/"+accountId+"/kamereon/kca/car-adapter/v"+version+"/cars/"+vin;
    }

    async accounts(personId?:string, country?: string): Promise<Accounts> {

        if (!personId) personId = this.parseJwt(this.jwt)["data.personId"];

        return this.getJSON<Accounts>("/commerce/v1/persons/"+personId
                ,country);
    }

    async vehicles(accountId: string, country?: string): Promise<Vehicles> {
        return this.getJSON<Vehicles>(
                "/commerce/v1/accounts/"+accountId
                +"/vehicles"
                ,country);
    }

    async location(accountId: string, vin: string, country?: string): Promise<Location> {
        return this.getJSON<Location>(this.createPath(accountId, vin)+"/location",country);
    }

    async cockpit(accountId: string, vin: string, country?: string): Promise<Cockpit> {
        return this.getJSON<Cockpit>(this.createPath(accountId, vin,2)+"/cockpit",country);
    }

    async batteryStatus(accountId: string, vin: string, country?: string): Promise<BatteryStatus> {
        return this.getJSON<BatteryStatus>(this.createPath(accountId, vin,2)+"/battery-status",country);
    }

    async chargeMode(accountId: string, vin: string, country?: string): Promise<ChargeMode> {
        return this.getJSON<ChargeMode>(this.createPath(accountId, vin)+"/charge-mode",country);
    }

    async hvacSchedule(accountId: string, vin: string, country?: string): Promise<HVAC_Shedule> {
        return this.getJSON<HVAC_Shedule>(this.createPath(accountId, vin)+"/hvac-schedule",country);
    }

    async chargeSchedule(accountId: string, vin: string, country?: string): Promise<Charge_Shedule> {
        return this.getJSON<Charge_Shedule>(this.createPath(accountId, vin)+"/charge-schedule",country);
    }

    async setChargeMode(mode: "always_charging" | "schedule_mode", accountId: string, vin: string, country?: string)
    {
        let data: DataContainer<any> = 
            {
                "data":
                {
                    "type":"ChargeMode",
                    "attributes":
                    {
                        "action": mode
                    }
                }
            };

        return this.postJSON<any>(data, this.createPath(accountId, vin)+"/action/charge-mode",country)
    }

    async setChargeState(charging: boolean, accountId: string, vin: string, country?: string)
    {
        let data: DataContainer<any> = 
            {
                "data":
                {
                    "type":"ChargingStart",
                    "attributes":
                    {
                        "action": charging ? "start" : "stop"
                    }
                }
            };
        
        return this.postJSON<any>(data, this.createPath(accountId, vin)+"/action/charging-start",country);
    }

    async setACState(ac: boolean, temperature: number, accountId: string, vin: string, country?: string)
    {
        if (!temperature && temperature < 0 && temperature > 30)
            temperature = 21;

        let data: DataContainer<any> = 
            {
                "data":
                {
                    "type":"HvacStart",
                    "attributes":
                    {
                        "action": ac ? "start" : "stop", // or cancel are allowed
                        "targetTemperature": Number
                    }
                }
            };

        return this.postJSON<any>(data, this.createPath(accountId, vin)+"/action/hvac-start",country);
    }

    async setChargeShedule(shedule: Charge_Shedule, temperature: number, accountId: string, vin: string, country?: string)
    {
        shedule.data.type = "ChargeSchedule";

        return this.postJSON<any>(shedule, this.createPath(accountId, vin)+"/action/charge-schedule ",country);
    }

    async setHVACVShedule(shedule: HVAC_Shedule, temperature: number, accountId: string, vin: string, country?: string)
    {
        shedule.data.type = "HvacSchedule";

        return this.postJSON<any>(shedule, this.createPath(accountId, vin)+"/action/hvac-schedule ",country);
    }
}