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
// tslint:disable-next-line
export interface CancellationReason { }

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

//#region Data Interfaces
export interface DataContainer<T> {
    data: Data<T>;
}

export interface Data<T> {
    type: string;
    id?: string;
    attributes: T;
}
//#endregion

//#region "Location"
export interface LocationAttributes {
    gpsLatitude: number;
    gpsLongitude: number;
    lastUpdateTime: Date;
}

export interface Location extends DataContainer<LocationAttributes> { }
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

export interface BatteryStatus extends DataContainer<BatteryStatusAttributes> { }
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
/**
 * Chargemode is delayed if the action/start-charge is called with a startDateTime in the future
 */
export interface ChargeModeAttributes {
    "chargeMode": "always_charging" | "schedule_mode" | "delayed";
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
export interface HVAC_Schedule extends DataContainer<HVAC_Entry> {
}

export interface Charge_Schedule extends DataContainer<Charge_Entry> {
}
//#endregion

interface Servers {
    target: string;
    apikey: string;
}

export class ZEServices {
    private jwt: string = null;
    private token: string = null;
    private gigyaProd: Servers = null;
    private wiredProd: Servers = null;
    private country: string = "DE";

    //#region Parse JWT Function
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
    //#endregion

    constructor() {

    }

    /**
     * Login into the renault service and fetch on success the jwt for all further API Calls.
     * @param loginId Username for the renault service.
     * @param password Password for the renault service.
     */
    async login(loginId: string, password: string): Promise<boolean> {

        let configURL = 'https://renault-wrd-prod-1-euw1-myrapp-one.s3-eu-west-1.amazonaws.com/configuration/android/config_en_GB.json';

        // add default config if the renault server is not available
        let config = {
                servers: {
                    gigyaProd: {
                        target: 'https://accounts.eu1.gigya.com',
                        apikey: '3_7PLksOyBRkHv126x5WhHb-5pqC1qFR8pQjxSeLB6nhAnPERTUlwnYoznHSxwX668'
                    },
                    wiredProd: {
                        target: 'https://api-wired-prod-1-euw1.wrd-aws.com',
                        apikey: 'YjkKtHmGfaceeuExUDKGxrLZGGvtVS0J'
                    }
                }
            };
        
        try {
            config = await (await fetch(configURL, { method: "GET" })).json();
        }
        catch { }

        this.gigyaProd = config.servers.gigyaProd;
        this.wiredProd = config.servers.wiredProd;
        // manual override kameron API key searching for new fetchable source
        this.wiredProd.apikey = "YjkKtHmGfaceeuExUDKGxrLZGGvtVS0J"

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
            + "&login_token=" + this.token
            , { method: "POST" })).json();

        this.jwt = json.id_token;

        return true;
    }

    private async getJSON<T>(PATH: string, country?: string): Promise<T> {
        if (this.jwt == null) return new Promise((resolve) => { resolve(null) });

        if (!country) country = this.country;

        var res = await fetch(this.wiredProd.target + PATH + '?country=' + country, {
            method: "GET",
            headers:
            {
                "apikey": this.wiredProd.apikey,
                "x-gigya-id_token": this.jwt
            }
        });

        return res.json();
    }

    private async postJSON<T>(data: DataContainer<any>, PATH: string, country?: string): Promise<T> {
        if (this.jwt == null) return new Promise((resolve) => { resolve(null) });

        if (!country) country = this.country;

        var res = await fetch(this.wiredProd.target + PATH + '?country=' + country, {
            method: "POST",
            body: JSON.stringify(data),
            headers:
            {
                "apikey": this.wiredProd.apikey,
                "x-gigya-id_token": this.jwt,
                "Content-Type": "application/vnd.api+json"
            }
        });

        return res.json();
    }

    private createPath(accountId: string, vin: string, version: number = 1): string {
        return "/commerce/v1/accounts/" + accountId + "/kamereon/kca/car-adapter/v" + version + "/cars/" + vin;
    }
    
    private createPathSpring(accountId: string, vin: string): string {
        return "/commerce/v1/accounts/" + accountId + "/kamereon/kcm/v1/vehicles/" + vin;
    }

    /**
     * Fetch all accounts
     * @param personId optional personId, if not defined taken from the jwt
     * @param country optional country
     */
    async accounts(personId?: string, country?: string): Promise<Accounts> {
        if (!personId) personId = this.parseJwt(this.jwt)["data.personId"];

        return this.getJSON<Accounts>("/commerce/v1/persons/" + personId, country);
    }

    /**
     * Fetch all vehicles that in this account.
     * @param accountId The accountId.
     * @param country optional country
     */
    async vehicles(accountId: string, country?: string): Promise<Vehicles> {
        return this.getJSON<Vehicles>("/commerce/v1/accounts/" + accountId + "/vehicles", country);
    }

    async getAttribute<T>(attribute: string, accountId: string, vin: string, country?: string): Promise<T> {
        let version = 1;
        switch (attribute) {
            case 'battery-status':
                version = 2;
                break;
        }

        return this.getJSON<T>(this.createPath(accountId, vin, version) + "/" + attribute, country);
    }

    /**
     * Fetch the current location of the requested vehicle in the requested account.
     * @param accountId The accountId.
     * @param vin The vehicle identifier.
     * @param country optional country
     */
    async location(accountId: string, vin: string, country?: string): Promise<Location> {
        return this.getAttribute<Location>("location", accountId, vin, country);
    }

    /**
     * Fetch the current cockpit status of the requested vehicle in the requested account.
     * @param accountId The accountId.
     * @param vin The vehicle identifier.
     * @param country optional country
     */
    async cockpit(accountId: string, vin: string, country?: string): Promise<Cockpit> {
        return this.getAttribute<Cockpit>("cockpit", accountId, vin, country);
    }

    /**
     * Fetch the current battery status of the requested vehicle in the requested account.
     * @param accountId The accountId.
     * @param vin The vehicle identifier.
     * @param country optional country
     */
    async batteryStatus(accountId: string, vin: string, country?: string): Promise<BatteryStatus> {
        return this.getAttribute<BatteryStatus>("battery-status", accountId, vin, country);
    }

    /**
     * Fetch the current charge mode of the requested vehicle in the requested account.
     * @param accountId The accountId.
     * @param vin The vehicle identifier.
     * @param country optional country
     */
    async chargeMode(accountId: string, vin: string, country?: string): Promise<ChargeMode> {
        return this.getAttribute<ChargeMode>("charge-mode", accountId, vin, country);
    }

    /**
     * Fetch the current ac schedule of the requested vehicle in the requested account.
     * @param accountId The accountId.
     * @param vin The vehicle identifier.
     * @param country optional country
     */
    async hvacSchedule(accountId: string, vin: string, country?: string): Promise<HVAC_Schedule> {
        return this.getAttribute<HVAC_Schedule>("hvac-schedule", accountId, vin, country);
    }

    /**
     * Fetch the current charge schedule of the requested vehicle in the requested account.
     * @param accountId The accountId.
     * @param vin The vehicle identifier.
     * @param country optional country
     */
    async chargeSchedule(accountId: string, vin: string, country?: string): Promise<Charge_Schedule> {
        return this.getAttribute<Charge_Schedule>("charge-schedule", accountId, vin, country);
    }

    /**
     * Set the charge mode of the defined vehicle in the defined account.
     * @param mode The charge mode can be "always_charging"/"always" or "schedule_mode"/"schedule".
     * @param accountId The accountId.
     * @param vin The vehicle identifier.
     * @param country optional country
     */
    async setChargeMode(mode: "always_charging" | "schedule_mode" | "always" | "schedule", accountId: string, vin: string, country?: string) {
        if (mode == "always") mode = "always_charging";
        if (mode == "schedule") mode = "schedule_mode";

        let data: DataContainer<any> =
        {
            "data":
            {
                "type": "ChargeMode",
                "attributes":
                {
                    "action": mode
                }
            }
        };

        return this.postJSON<any>(data, this.createPath(accountId, vin) + "/actions/charge-mode", country)
    }

    /**
     * Set the charge state of the defined vehicle in the defined account.
     * @param charging With true the car tries to start charging, with false it stops the charging.
     * @param accountId The accountId.
     * @param vin The vehicle identifier.
     * @param country optional country
     */
    async setChargeState(charging: boolean, accountId: string, vin: string, country?: string) {
        //  "startDateTime" with format "YYYY-MM-DDThh:mm:ssZ"

        let data: DataContainer<any> =
        {
            "data":
            {
                "type": "ChargingStart",
                "attributes":
                {
                    "action": charging ? "start" : "stop"
                }
            }
        };
        return this.postJSON<any>(data, this.createPath(accountId, vin) + "/actions/charging-start", country);
    }
    
    /**
     * Pause and resume Charging for Dacia Spring.
     * @param pause With true the car tries to pause charging, with false it resumes the charging.
     * @param accountId The accountId.
     * @param vin The vehicle identifier.
     * @param country optional country
     */
    async setChargePause(pause: boolean, accountId: string, vin: string, country?: string) {
        let data: DataContainer<any> =
        {
            "data":
            {
                "type": "ChargePauseResume",
                "attributes":
                {
                    "action": pause ? "pause" : "resume"
                }
            }
        };
        return this.postJSON<any>(data, this.createPathSpring(accountId, vin) + "/charge/pause-resume", country);
    }

    /**
     * Set the AC state. Starts the AC with the targettemperature or stops with targettemperature = null.
     * @param temperature The targettemperature for the ac.
     * @param accountId The accountId.
     * @param vin The vehicle identifier.
     * @param country optional country
     */
    async setHVACState(targetTemperature: number, accountId: string, vin: string, country?: string) {
        if (typeof targetTemperature === "boolean") {
            if (targetTemperature)
                targetTemperature = 21;
            else
                targetTemperature = undefined;
        }

        let ac = !(targetTemperature === null);
        if (!targetTemperature && targetTemperature < 0 && targetTemperature > 30)
            targetTemperature = 21;

        //  "startDateTime" with format "YYYY-MM-DDThh:mm:ssZ"

        let data: DataContainer<any> =
        {
            "data":
            {
                "type": "HvacStart",
                "attributes":
                {
                    "action": ac ? "start" : "stop", // or cancel are allowed
                    "targetTemperature": targetTemperature
                }
            }
        };

        if (!ac)
            delete data.data.attributes.targetTemperature;

        return this.postJSON<any>(data, this.createPath(accountId, vin) + "/actions/hvac-start", country);
    }

    /**
     * Set the charge schedule.
     * @param shedule The schedule, in the format { data: { attributes: { calendar: ...} }}
     * @param accountId The accountId.
     * @param vin The vehicle identifier.
     * @param country optional country
     */
    async setChargeSchedule(shedule: Charge_Schedule, accountId: string, vin: string, country?: string) {
        shedule.data.type = "ChargeSchedule";

        return this.postJSON<any>(shedule, this.createPath(accountId, vin, 2) + "/actions/charge-schedule ", country);
    }

    /**
     * Set the HACV schedule.
     * @param shedule The schedule.
     * @param accountId The accountId.
     * @param vin The vehicle identifier.
     * @param country optional country
     */
    async setHVACSchedule(shedule: HVAC_Schedule, accountId: string, vin: string, country?: string) {
        shedule.data.type = "HvacSchedule";

        return this.postJSON<any>(shedule, this.createPath(accountId, vin) + "/actions/hvac-schedule ", country);
    }
}
