
const AppConfig = {
    isDevelopment: true, //if its true it will point directly to dev without checking isStaging.
    isStaging: false, //it will work only if  isDevelopment false.
    name: 'SGLearning App',
    server_url_dev: 'https://sglearning-development.azurewebsites.net/api/v1/',
    server_url_staging: 'https://sglearning-staging.azurewebsites.net/api/v1/',
    server_url_prod: 'https://sglearning.azurewebsites.net/api/v1/',
    supportMail: 'mahesh_sapkal@ghodawatsoftech.com',
}

export default AppConfig;



