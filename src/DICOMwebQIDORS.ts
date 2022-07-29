import URL from "url-parse";
import _ from "lodash";
import fetch from 'node-fetch';

import QIDOParameter from "./config/QIDOParameter.config";
import QueryLevel from "./config/QueryLevel.config";
import AllowProtocol from "./config/AllowProtocol.config";

class DICOMwebQIDORS {

    // QIDOParameter.json
    terminologyList: object = {};
    studyParameterList: object = {};
    seriesParameterList: object = {};
    instanceParameterList: object = {};
    
    // Token
    isUseToken: boolean = false;
    tokenObject: object = {};

    // url-parse package
    hostname: string = "";
    pathname: string = "";
    port: string = "";
    protocol: string = "";
    queryParameter: object = {}

    // Query Level
    queryLevel: string = "";

    // Response
    response: object = {};


    async init() {
        await this._loadQIDOParameter();
    }

    async query() {
        await this._validateQueryLevel();
        await this._validateUrlComponent();

        if (this.queryLevel === QueryLevel.studies) {
            await this._queryStudies();
        } else if (this.queryLevel === QueryLevel.series) {
            await this._querySeries();
        } else if (this.queryLevel === QueryLevel.instances) {
            await this._queryInstances();
        } else {
            console.log("queryLevel Error");
        }
    }

    async setUseToken(tokenObject: object) {

        // tokenObject 不是 Object 就跳錯誤
        if(!(_.isObject(tokenObject))) {
            console.log("tokenValue must be object type.");
        }

        this.isUseToken = true;
        this.tokenObject = tokenObject;
        console.log("Here is function setUseToken(). This function is not enable in this version.");
    }



    async _loadQIDOParameter() {
        const _terminoloy = _.get(QIDOParameter, "Terminology");
        const _study = _.get(QIDOParameter, "Study");
        const _series = _.get(QIDOParameter, "Series");
        const _instance = _.get(QIDOParameter, "Instance");

        this.terminologyList = _.cloneDeep(_terminoloy);
        this.studyParameterList = _.cloneDeep(await this._getCombinedObjectWithInvertObject(_study));
        this.seriesParameterList = _.cloneDeep(await this._getCombinedObjectWithInvertObject(_series));
        this.instanceParameterList = _.cloneDeep(await this._getCombinedObjectWithInvertObject(_instance));
    }


    async _getCombinedObjectWithInvertObject(object1: object) {
        return _.assign(object1, _.invert(object1));
    }


    async _validateQueryLevel() {
        // falsy value: null、undefined、NaN、emptyString、0、false
        // https://262.ecma-international.org/5.1/#sec-9.2
        // 如果 queryLevel 數值是 falsy 值，就代表是錯的。
        if (!(_.get(QueryLevel, this.queryLevel))) {
            console.log("QueryLevel Value Error! \nQueryLevel ValueSet is [" + _.keys(QueryLevel) + "]");
        }
    }

    async _validateUrlComponent() {
        // falsy value: null、undefined、NaN、emptyString、0、false
        // https://262.ecma-international.org/5.1/#sec-9.2
        // 如果 hostname、pathname、protocol 數值是 falsy 值，就代表是錯的。
        if (!(this.hostname && this.pathname && this.protocol)) {
            console.log("hostname、pathname、protocol, three value can not be falsy.\n falsy value: null、undefined、NaN、emptyString、0、false");
        }

        // protocol 必須在清單內。
        if (!(_.get(AllowProtocol, this.protocol))) {
            console.log("Protocol Error.\nProtocol ValueSet is [" + _.keys(AllowProtocol) + "]");
        }

        // port 必須是字串型態的數字
        // 不是字串 && 轉成數字後不是整數，跳出錯誤。
        if (!(_.isString(this.port) && (_.isInteger((_.toNumber(this.port)))))) {
            console.log("port value has be String type and Integer value. Example '443' or '80'. ");
        }

        // queryParameter 必須在字典內
        const legalKeySet = _.keys(_.assign(this.terminologyList, this.studyParameterList, this.seriesParameterList, this.instanceParameterList));
        _.forEach(this.queryParameter, (value, key) => {
            if (!(_.includes(legalKeySet, key))) {
                console.log("Key value: " + _.toString(key) + " is no allow.");
            }
        })
        
    }




    async _queryStudies() {
        const url = new URL("");
        url.set('hostname', this.hostname);
        url.set('pathname', this.pathname + "/" + QueryLevel.studies);
        url.set('port', this.port);
        url.set('protocol', _.get(AllowProtocol, this.protocol));
        url.set('query', this.queryParameter);

        console.log(url.toString());
        this.response = await this._getRequestResponse(url.toString());
    }

    async _querySeries() {
        console.log("Here is Query Series Level in QIDO-RS. This function is not enable in this version.");
    }

    async _queryInstances() {
        console.log("Here is Query Instances Level in QIDO-RS. This function is not enable in this version.");
    }

    async _getRequestResponse(url: string): Promise<object> {
        let result: object | undefined;
        let response;
        
        if (this.isUseToken) {
            response = await fetch(url, {
                headers: this.tokenObject as HeadersInit
            });
        } else {
            response = await fetch(url);
        }

        result = await response.json() as object;

        return result;
    }
}

export default DICOMwebQIDORS;