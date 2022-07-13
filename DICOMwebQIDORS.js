import URL from "url-parse";
import _ from "lodash";
import fetch from 'node-fetch';

import QIDOParameter from "./Config/QIDOParameter.json" assert {type: "json"};
import QueryLevel from "./Config/QueryLevel.json" assert {type: "json"};
import AllowProtocol from "./Config/AllowProtocol.json" assert {type: "json"};

class DICOMwebQIDORS {
    constructor() {
        //QIDOParameter.json
        this.terminologyList = undefined;
        this.studyParameterList = undefined;
        this.seriesParameterList = undefined;
        this.instanceParameterList = undefined;
        
        //Token
        this.isUseToken = false;
        this.tokenObject = undefined;

        //url-parse package
        this.hostname = undefined;
        this.pathname = undefined;
        this.port = undefined;
        this.protocol = undefined;
        this.queryParameter = undefined

        //Query Level
        this.queryLevel = undefined;

        //Response
        this.response = undefined;
    }

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
            throw "queryLevel Error";
        }
    }

    async setUseToken(tokenObject) {

        //tokenObject 不是 Object 就跳錯誤
        if(!(_.isObject(tokenObject))) {
            throw "tokenValue must be object type."
        }

        this.isUseToken = true;
        this.tokenObject = tokenObject;
        throw "Here is function setUseToken(). This function is not enable in this version.";
    }

    async _loadQIDOParameter() {
        let _terminoloy = _.get(QIDOParameter, "Terminology");
        let _study = _.get(QIDOParameter, "Study");
        let _series = _.get(QIDOParameter, "Series");
        let _instance = _.get(QIDOParameter, "Instance");

        this.terminologyList = _.cloneDeep(_terminoloy);
        this.studyParameterList = _.cloneDeep(await this._getCombinedObjectWithInvertObject(_study));
        this.seriesParameterList = _.cloneDeep(await this._getCombinedObjectWithInvertObject(_series));
        this.instanceParameterList = _.cloneDeep(await this._getCombinedObjectWithInvertObject(_instance));
    }

    async _getCombinedObjectWithInvertObject(object1) {
        return _.assign(object1, _.invert(object1));
    }

    async _validateUrlComponent() {
        //falsy value: null、undefined、NaN、emptyString、0、false
        //https://262.ecma-international.org/5.1/#sec-9.2
        //如果 hostname、pathname、protocol 數值是 falsy 值，就代表是錯的。
        if (!(this.hostname && this.pathname && this.protocol)) {
            throw "hostname、pathname、protocol, three value can not be falsy.\n falsy value: null、undefined、NaN、emptyString、0、false";
        }

        //protocol 必須在清單內。
        if (!(_.get(AllowProtocol, this.protocol))) {
            throw "Protocol Error.\nProtocol ValueSet is [" + _.keys(AllowProtocol) + "]";
        }

        //port 必須是字串型態的數字
        //不是字串 && 轉成數字後不是整數，跳出錯誤。
        if (!(_.isString(this.port) && (_.isInteger((_.toNumber(this.port)))))) {
            throw "port value has be String type and Integer value. Example '443' or '80'. ";
        }

        //queryParameter 必須在字典內
        let legalKeySet = _.keys(_.assign(this.terminologyList, this.studyParameterList, this.seriesParameterList, this.instanceParameterList));
        _.forEach(this.queryParameter, (value, key) => {
            if (!(_.includes(legalKeySet, key))) {
                throw "Key value: " + _.toString(key) + " is no allow.";
            }
        })
        
    }

    async _validateQueryLevel() {
        //falsy value: null、undefined、NaN、emptyString、0、false
        //https://262.ecma-international.org/5.1/#sec-9.2
        //如果 queryLevel 數值是 falsy 值，就代表是錯的。
        if (!(_.get(QueryLevel, this.queryLevel))) {
            throw "QueryLevel Value Error! \nQueryLevel ValueSet is [" + _.keys(QueryLevel) + "]";
        }
    }

    async _queryStudies() {
        let url = new URL();
        url.set('hostname', this.hostname);
        url.set('pathname', this.pathname + "/" + QueryLevel.studies);
        url.set('port', this.port);
        url.set('protocol', AllowProtocol[this.protocol]);
        url.set('query', this.queryParameter);

        console.log(url.toString());
        this.response = await this._getRequestResponse(url.toString());
    }

    async _querySeries() {
        throw "Here is Query Series Level in QIDO-RS. This function is not enable in this version.";
    }

    async _queryInstances() {
        throw "Here is Query Instances Level in QIDO-RS. This function is not enable in this version.";
    }

    async _getRequestResponse(url) {
        let result = undefined;
        let response = undefined;
        
        if (this.isUseToken) {
            response = await fetch(url, {
                headers: this.tokenObject
            });
        } else {
            response = await fetch(url);
        }

        result = await response.json();

        return result;
    }
}

export default DICOMwebQIDORS;