# CSY-DICOMweb-QIDO-RS
This repository generates the URL and requests PACS for DICOMweb QIDO-RS.
This repository was built by typescript.

## DICOM QIDO Parameter
### Required Matching Attributes
> https://dicom.nema.org/medical/dicom/current/output/chtml/part18/sect_10.6.html
DICOM PS3.18 2022b => 10.6 Search Transaction => Table 10.6.1-5. Required Matching Attributes
> https://dicom.nema.org/medical/dicom/2022b/output/chtml/part18/sect_10.6.html
DICOM PS3.18 2022b => 10.6 Search Transaction => Table 10.6.1-5. Required Matching Attributes

### Query Parameter Syntax (Terminology)
> https://dicom.nema.org/medical/dicom/current/output/chtml/part18/sect_8.3.4.html#sect_8.3.4.1
DICOM PS3.18 2022b => 8.3 Query Parameters => Table 8.3.4-1. Query Parameter Syntax
> https://dicom.nema.org/medical/dicom/2022b/output/chtml/part18/sect_8.3.4.html#sect_8.3.4.1
DICOM PS3.18 2022b => 8.3 Query Parameters => Table 8.3.4-1. Query Parameter Syntax

# How to use : Typescript
```typescript
// 引入套件
import QIDO from "csy-dicomweb-qido-rs";
import _ from "lodash";


// 實體化
const qido = new QIDO();

myFun();

async function myFun() {

    // "必須"自己初始化
    await qido.init();

    // 查詢階層設定：studies、series、instances
    qido.queryLevel = "studies";

    // 有使用到的套件參數設定：url-parse package
    qido.hostname = "test.dicom.tw";
    qido.pathname = "/dicomWeb";
    qido.protocol = "http";
    qido.port = "999";


    // 查詢參數設定：DICOM QIDO-RS Parameter
    let tempQueryParameter = {};

    tempQueryParameter = _.set(tempQueryParameter, "PatientID", "*");
    tempQueryParameter = _.set(tempQueryParameter, "limit", "10");
    tempQueryParameter = _.set(tempQueryParameter, "offset", "0");

    // 查詢參數用物件套入
    qido.queryParameter = tempQueryParameter;


    // 設定 Token:現在尚未啟用
    // let myHeaders = {};
    // myHeaders = _.set(myHeaders, "token", "jf903j2vunf9843nvyf934qc");
    // await qido.setUseToken(myHeaders);


    //查詢 同步模式
    await qido.query();
    console.log(qido.response);
}

```


# How to use : Javascript
```javascript 
import QIDO from "csy-dicomweb-qido-rs";

(async () => {
//實體化
let qido = new QIDO();

//"必須"自己初始化
await qido.init();

//查詢階層設定：studies、series、instances
qido.queryLevel = "studies";

//有使用到的套件參數設定：url-parse package
qido.hostname = "test.dicom.tw";
qido.pathname = "/dicomWeb";
qido.protocol = "http";
qido.port = "999";

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
```