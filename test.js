import QIDO from "./lib/DICOMwebQIDORS.js";

(async () => {
//實體化
let qido = new QIDO();

//"必須"自己初始化
await qido.init();

//查詢階層設定：studies、series、instances
qido.queryLevel = "studies";

//有使用到的套件參數設定：url-parse package
qido.hostname = "hackathon.raccoon.dicom.tw";
qido.pathname = "/dicom-web";
qido.protocol = "https";
qido.port = "443";

//查詢參數設定：DICOM QIDO-RS Parameter
let tempQueryParameter = {};
tempQueryParameter.PatientID = '*';
tempQueryParameter.limit = "10";
tempQueryParameter.offset = "0";

//查詢參數用物件套入
qido.queryParameter = tempQueryParameter;

//設定 Token:現在尚未啟用
// let myHeaders = {};

// myHeaders.token = "jf903j2vunf9843nvyf934qc";
// await qido.setUseToken(myHeaders);

//查詢 同步模式
await qido.query();

//印出 response: json
console.log(qido.response);
})()