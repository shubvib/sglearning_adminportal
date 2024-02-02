import { React, useState } from 'react';
import { CommonApiCall, Api } from "../../services";
import { UrlConfig } from "../../config";
import { toast } from "react-toastify";
import CommonFunctions from "../../utils/CommonFunctions";


//*********************************************************Student Batch Shift********************************************************
const StudentBatchShift = async (studentData, batch, dIndex) => {
    let message = "hello"
    console.log('studentData', studentData)
    console.log('batchData', batch);
    const payload = {
        "studentIds": [`${studentData.id}`],
        "batchId": `${batch.id}`
    }
    console.log('payload', payload);
    await Api.putApi(UrlConfig.apiUrls.changeStudentBatch, payload)
        .then((response) => {
            message = "success";
            console.log('response======================>', response)
            toast.warning(`${studentData.name} shifted to "${batch.name}"`)
        })
        .catch((error) => {
            console.log('error======================>', error)
            const errorMessage = CommonFunctions.apiErrorMessage(error);
            toast(errorMessage, {
                type: "error",
            });
            message = "wrong";
        })
    return message;

}

export default {
    StudentBatchShift
}