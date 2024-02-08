//############### ENV vars ###############//
export const isProduction = process.env.NODE_ENV === "production";

//############### API ###############//
export const BaseDevelopmentAQDApiUrl = process.env.REACT_APP_API_DEV_ORIGIN; //Azure service
export const URI = "api/graphql"; // in dev mode is being used by setupProxy.js
export const AQD_URI = `${isProduction ? window.location.origin : BaseDevelopmentAQDApiUrl
  }/api/graphql`; // aqd URL
export const AQD_FILE_URI = `${isProduction ? window.location.origin : BaseDevelopmentAQDApiUrl}`; // file aqd URL
