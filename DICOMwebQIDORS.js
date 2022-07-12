import URL from "url-parse";
import _ from "lodash";
import QIDOParameter from "./QIDOParameter.json" assert {type: "json"};

class DICOMwebQIDORS {
    constructor() {
        //QIDOParameter.json
        this.terminologyList = undefined;
        this.parameterList = undefined;
        
        //Token
        this.isUseToken = false;
        this.tokenValue = undefined;

        //url-parse package
        this.hostname = undefined;
        this.pathname = undefined;
        this.port = undefined;
        this.protocol = undefined;
        this.queryParameter = undefined
    }

    async _init() {
        await _loadQIDOParameter();
    }

    async _loadQIDOParameter() {

    }

    async setParameter() {

    }

    async query() {

    }

    async setUseToken(isUseToken = true, tokenValue) {

    }

    async _validateTokenCanUse() {
        
    }

    async _validateUrlComponent() {

    }
}



export default DICOMwebQIDORS;