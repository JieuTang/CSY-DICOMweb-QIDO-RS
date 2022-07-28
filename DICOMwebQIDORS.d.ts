export default class DICOMwebQIDORS {
    terminologyList: Object | undefined;
    studyParameterList: Object | undefined;
    seriesParameterList: Object | undefined;
    instanceParameterList: Object | undefined;

    //Token
    isUseToken: Boolean;
    tokenObject: Object | undefined;

    //url-parse package
    hostname: string | undefined;
    pathname: string | undefined;
    port: string | undefined;
    protocol: string | undefined;
    queryParameter: Object | undefined

    //Query Level
    queryLevel: string | undefined;

    //Response
    response: Object | undefined;

   init(): Promise<void>;
   
   query(): Promise<void>;
   
   setUseToken(tokenObject: Object): Promise<void>;
}