import URL from "url-parse";
import _ from "lodash";
import fetch from 'node-fetch';

import QIDOParameter from "./Config/QIDOParameter.json" assert {type: "json"};
import QueryMode from "./Config/QueryMode.json" assert {type: "json"};
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
        this.tokenValue = undefined;

        //url-parse package
        this.hostname = undefined;
        this.pathname = undefined;
        this.port = undefined;
        this.protocol = undefined;
        this.queryParameter = undefined

        //Query Mode
        this.queryMode = undefined;

        //Response
        this.response = undefined;
    }

    async init() {
        await this._loadQIDOParameter();
    }

    async query() {
        await this._validateQueryMode();
        await this._validateUrlComponent();

        if (this.queryMode === QueryMode.studies) {
            await this._queryStudies();
        } else if (this.queryMode === QueryMode.series) {
            await this._querySeries();
        } else if (this.queryMode === QueryMode.instances) {
            await this._queryInstances();
        } else {
            throw "queryMode Error";
        }
    }

    async setUseToken(isUseToken = true, tokenValue) {
        throw "This function is inactivate.";
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

    async _validateTokenCanUse() {
        throw "This function is inactivate.";
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

    async _validateQueryMode() {
        //falsy value: null、undefined、NaN、emptyString、0、false
        //https://262.ecma-international.org/5.1/#sec-9.2
        //如果 queryMode 數值是 falsy 值，就代表是錯的。
        if (!(_.get(QueryMode, this.queryMode))) {
            throw "QueryMode Value Error! \nQueryMode ValueSet is [" + _.keys(QueryMode) + "]";
        }
    }

    async _queryStudies() {
        let url = new URL();
        url.set('hostname', this.hostname);
        url.set('pathname', this.pathname + "/" + QueryMode.studies);
        url.set('port', this.port);
        url.set('protocol', AllowProtocol[this.protocol]);
        url.set('query', this.queryParameter);

        console.log(url.toString());
        this.response = await this._getRequestResponse(url.toString());
    }

    async _querySeries() {
        throw "This function is inactivate.";
    }

    async _queryInstances() {
        throw "This function is inactivate.";
    }

    async _getRequestResponse(url) {
        let result = undefined;

        const response = await fetch(url);
        const data = await response.json();
        result = data;

        return result;
    }
}

export default DICOMwebQIDORS;