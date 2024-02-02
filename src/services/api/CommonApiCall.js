// import { Network } from '../network/Network';
import { UrlConfig } from '../../config';
import Api from './Api';
import { ExplorerDataAction } from '../../reduxManager';
/***common api call here, which is used to check at multiple places
 *  to do: use this function when using separate account and branches array(support admin loginOnly)
 * 
 */
function getBranchesClassesBatches_futerFunction(selectedAccountIndex, instituteList, instituteData = [], config = null) {
    Api.getApi(UrlConfig.apiUrls.branchesClassesBatches, null, config)
        .then((response) => {
            console.log('**** response', response);
            return response.data;
        }).then(data => {
            if (data) {
                const { branches } = data;
                let newExplorerArray = [];
                // ExplorerDataAction.setExplorerData(branches);

                if (instituteData.length > 0) {
                    let currentInstituteData = [];
                    let obj = { ...instituteList[0], ...branches[0] };
                    currentInstituteData.push(obj);
                    const mergedInstituteData = instituteData.concat(currentInstituteData);;
                    newExplorerArray.push(mergedInstituteData);
                } else {
                    instituteList.map((account, accIndex) => {
                        let obj = { ...account };
                        if (accIndex === selectedAccountIndex) {
                            obj = { ...account, ...branches[0] }
                        }
                        return newExplorerArray.push(obj);
                    });
                }
                console.log('newExplorerArrayIncommonCall', newExplorerArray)
                // ExplorerDataAction.setExplorerData(newExplorerArray);
            }
            return data;
        })
        .catch((error) => {
            console.log('********Error request ', error);
            if (error && error.request) {
                if (error.request.status !== 0) {
                    if (error.response && error.response.data && error.response.data.errors) {
                        console.log('********Response response ', error.response);
                        const { message } = error.response.data.errors[0];
                        console.log('********Response request ', message);
                    }
                }
            }
            return error;
        });
}

function getInstituteData() {
    Api.getApi(UrlConfig.apiUrls.branchesClassesBatches)
        .then((response) => {
            console.log('**** response', response);
            return response.data;
        }).then(data => {
            if (data) {
                console.log('institute data', data.accounts);
                const { accounts } = data;
                // const { branches } = data;

                ExplorerDataAction.setExplorerData(accounts);
            }
            return data;
        })
        .catch((error) => {
            console.log('********Error request ', error);
            if (error && error.request) {
                if (error.request.status !== 0) {
                    if (error.response && error.response.data && error.response.data.errors) {
                        console.log('********Response response ', error.response);
                        const { message } = error.response.data.errors[0];
                        console.log('********Response request ', message);
                    }
                }
            }
            return error;
        });
}

export default {
    getInstituteData,
}