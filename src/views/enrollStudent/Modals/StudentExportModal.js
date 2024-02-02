import React, { useRef, useState, useEffect } from 'react';
import { Button, Modal, Table, Spinner } from 'react-bootstrap';
import { Api } from '../../../services';
import { UrlConfig } from '../../../config';
import ReactHTMLTableToExcel from 'react-html-table-to-excel';
import moment from 'moment';
import CommonFunctions from '../../../utils/CommonFunctions';
import { toast } from 'react-toastify';
const StudentExportModal = (props) => {
    let i = 0;
    const { showStudentExportModal, dataForStudentExport, closeStudentExportModal } = props;
    const [students, setStudents] = useState(null)
    const [showLoader, setLoader] = useState(false);
    //*******************************Get Students List Conditionally*****************
    useEffect(() => {
        console.log('dataForStudentExport', dataForStudentExport)
        ExportStudents(dataForStudentExport[0], dataForStudentExport[2]);
    }, [dataForStudentExport])


    const ExportStudents = (url, id) => {
        setLoader(true)
        let apiUrl = ((url === 'instituteId') ?
            Api.getApi(`${UrlConfig.apiUrls.getStudentList}?OrderBy=name&PageSize=10000&IsDeleted=false`) :
            Api.getApi(`${UrlConfig.apiUrls.getStudents}?${url}=${id}`, { OrderBy: "name", PageSize: 10000, IsDeleted: false }))

        apiUrl
            .then((response) => {
                setLoader(false)
                if (response) {
                    const { data } = response;
                    console.log('response data for export', data)
                    setStudents(data);
                } else {
                    return false;
                }
            })
            .catch((error) => {
                setLoader(false);
                const errorMessage = CommonFunctions.apiErrorMessage(error);
                console.log('errorMessage', errorMessage)
                toast(errorMessage, {
                    type: "error",
                });
            })
    }


    //****************Main View**************************************/
    return (
        <div className="modal-main-dark">
            <Modal show={showStudentExportModal} onHide={() => closeStudentExportModal()} centered size="lg" className="modal-dark" backdrop="static" >
                {/* <ToastContainer autoClose={5000} position="top-right" className="tost-dark-container" style={{ borderRadius: 5, fontFamily: 'GOTHIC' }} /> */}
                <Modal.Header closeButton>
                    <div className="modal-title-box">
                        <span>Students of "{dataForStudentExport && dataForStudentExport[1]}"</span>
                    </div>
                </Modal.Header>
                {showLoader &&
                    <div className="loader">
                        <Spinner animation="border" role="status">
                            <span className="sr-only">Loading...</span>
                        </Spinner>
                    </div>
                }
                <Modal.Body
                >
                    <div>
                        {students ? <Table striped bordered hover variant="dark" className="dark-light-common-table" id="studentTable" style={{ width: "100%" }}>
                            <thead>
                                <tr>
                                    <td colSpan="8" style={{ textAlign: "center", fontSize: "30px", fontWeight: "600", color: "#2196f3" }} >
                                        {dataForStudentExport[3].InstituteName} {dataForStudentExport[3].BranchName !== "" && `(${dataForStudentExport[3].BranchName})`}
                                    </td>
                                </tr>
                                <tr>
                                    <td colSpan="2" style={{ textAlign: "center", fontWeight: "600" }} >
                                        Time: {moment(new Date(Date.now())).format("LLL")}
                                    </td>
                                    <td colSpan={(dataForStudentExport[0] === "instituteId") ? "4" : "3"} style={{ textAlign: "left", fontWeight: "600" }} >
                                        {/* {accountData[0].name.toUpperCase()} */}
                                    </td>
                                    <td colSpan="2" style={{ textAlign: "center", fontWeight: "600" }} >
                                        Total Students : {students !== null && students.length}
                                    </td>
                                </tr>
                                <tr>
                                    <th style={{ textAlign: "left" }}>Index</th>
                                    <th style={{ textAlign: "left" }}>User Id</th>
                                    <th style={{ textAlign: "left" }}>Student Code</th>
                                    <th style={{ textAlign: "left" }}>Name</th>
                                    <th style={{ textAlign: "left" }}>Email</th>
                                    {dataForStudentExport && (dataForStudentExport[0] === "instituteId") && <th style={{ textAlign: "left" }}>Branch</th>}
                                    <th style={{ textAlign: "left" }}>Class</th>
                                    <th style={{ textAlign: "left" }}>Batch</th>
                                </tr>
                            </thead>
                            <tbody>
                                {students !== null && students.map((student, index) => {
                                    const { userInfo, branches, batches, classes, code } = student;
                                    return (
                                        <tr key={index}>
                                            <td style={{ textAlign: " left" }}>{i = i + 1}</td>
                                            <td style={{ textAlign: " left" }}>{(!userInfo || !userInfo.userName) ? "-" : userInfo.userName}</td>
                                            <td style={{ textAlign: " left" }}>{code === "" ? "-" : code}</td>
                                            <td style={{ textAlign: " left" }}>{userInfo === null || userInfo.name === "" ? "-" : userInfo.name}</td>
                                            <td style={{ textAlign: " left" }}>{userInfo === null || userInfo.email === "" ? "-" : userInfo.email}</td>
                                            {(dataForStudentExport[0] === "instituteId") && <td style={{ textAlign: " left" }}>{userInfo === null || branches[0].name === "" ? "-" : branches[0].name}</td>}
                                            <td style={{ textAlign: " left" }}>{userInfo === null || classes[0].name === "" ? "-" : classes[0].name}</td>
                                            <td style={{ display: 'flex', textAlign: " left", justifyContent: 'space-between' }}>{userInfo === null || batches[0].name === "" ? "-" : batches[0].name}<span>{`(${batches[0].code})`}</span></td>
                                            {/* <td style={{ textAlign: "center" }}>{PostalCode === "" ? "-" : PostalCode}</td> */}
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </Table> :
                            <h2 style={{ textAlign: "center" }}>No Students Found for {dataForStudentExport[1]} </h2>}
                    </div>

                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" className="closeBtn" onClick={() => closeStudentExportModal()} >
                        Cancel
                    </Button>
                    <ReactHTMLTableToExcel
                        className="uploadeBtn btn"
                        table="studentTable"
                        filename={`${dataForStudentExport[1]}_${moment(new Date(Date.now())).format("LLL")}`}
                        sheet="sheet 1"
                        buttonText="Export"
                    />
                </Modal.Footer>
            </Modal>
        </div>
    )
}
export default StudentExportModal