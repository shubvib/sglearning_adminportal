import React, { useState, useEffect } from 'react';
import { BsCloudDownload } from 'react-icons/bs'
import { GrClose } from 'react-icons/gr';
import { CSVReader } from 'react-papaparse';
import { Tooltip, OverlayTrigger, Dropdown } from 'react-bootstrap';
import { Api } from '../../services';
import { UrlConfig } from '../../config';
import CommonFunctions from '../../utils/CommonFunctions';
import { toast } from 'react-toastify';
import { GiSwordBreak } from 'react-icons/gi';
const buttonRef = React.createRef();

const PagesHeader = ({ headerText, customElementsComponent, dropDownItem }) => {
    // "questionPaperTemplate_Word": "https://sglearningfilestorage.blob.core.windows.net/appfiles/ImportFileTemplates/QuestionPaperTemplate_Word.docx",
    //     "questionPaperTemplate_Excel_CSV": "https://sglearningfilestorage.blob.core.windows.net/appfiles/ImportFileTemplates/QuestionPaperTempate_Excel_CSV.csv",
    //         "importStudentsTemplate_Excel_CSV": "https://sglearningfilestorage.blob.core.windows.net/appfiles/ImportFileTemplates/StudentImportTemplate.csv",
    //             "questionPaperTemplate_Word_SampleData": "https://sglearningfilestorage.blob.core.windows.net/appfiles/ImportFileTemplates/QuestionPaperTemplate_Word_SampleData.docx",
    //                 "studentImportTemplate_SampleData": "https://sglearningfilestorage.blob.core.windows.net/appfiles/ImportFileTemplates/StudentImportTemplate_SampleData.xls",
    const downloadTemplateFiles = (requestedFileName) => {
        console.log('requestedFileName', requestedFileName);
        Api.getApi(UrlConfig.apiUrls.platformTemplates)
            .then((response) => {
                console.log('fileResponse', response);
                if (response) {
                    const { data } = response;
                    const { questionPaperTemplate_Word, questionPaperTemplate_Word_SampleData, importStudentsTemplate_Excel_CSV, studentImportTemplate_SampleData } = data;
                    // let fileUrl = requestedFileName === "questionPaperTemplate_Word" ? questionPaperTemplate_Word : questionPaperTemplate_Word_SampleData;
                    let fileUrl;
                    switch (requestedFileName) {
                        case 'questionPaperTemplate_Word':
                            fileUrl = questionPaperTemplate_Word
                            break;
                        case 'questionPaperTemplate_Word_SampleData':
                            fileUrl = questionPaperTemplate_Word_SampleData;
                            break;
                        case 'importStudentsTemplate_Excel_CSV':
                            fileUrl = importStudentsTemplate_Excel_CSV
                            break;
                        case 'studentImportTemplate_SampleData':
                            fileUrl = studentImportTemplate_SampleData
                            break;
                        default:
                            fileUrl = questionPaperTemplate_Word
                            break;
                    }



                    const url = {
                        file: `${fileUrl}`,
                    };
                    window.open(url.file);
                }
            })
            .catch((error) => {
                const errorMessage = CommonFunctions.apiErrorMessage(error);
                console.log('errorMessage', errorMessage)
                toast(errorMessage, {
                    type: "error",
                });
            })
    }

    return (
        <div>
            <div className="page-header-wrapper">
                <div className="page-header">
                    <h3 className="page-title">
                        {headerText}
                    </h3>
                    <div className="right-side-box">
                        <div className="upload-box" style={{ marginRight: "10px" }}>
                            {customElementsComponent && customElementsComponent()}
                        </div>
                        {dropDownItem && dropDownItem.length > 0 &&
                            <div className="drop-down-box-export drop-down-page-header">
                                <Dropdown className="option-sub-menu">
                                    <Dropdown.Toggle className="nav-link count-indicator bg-transparent">
                                        <OverlayTrigger placement="top" overlay={<Tooltip id="tooltip-bottom" className="common-tooltip">Download Files</Tooltip>}>
                                            <BsCloudDownload size={18} />
                                        </OverlayTrigger>
                                    </Dropdown.Toggle>
                                    <Dropdown.Menu className="preview-list navbar-dropdown">
                                        <Dropdown.Item name="dropDownItem" className="dropdown-item preview-item d-flex align-items-center" value={dropDownItem[0]}
                                            onClick={(e) => {
                                                downloadTemplateFiles(dropDownItem[0]);
                                            }}
                                        >
                                            {dropDownItem[0]}
                                        </Dropdown.Item>
                                        <Dropdown.Item className="dropdown-item preview-item d-flex align-items-center" value={dropDownItem[1]}
                                            onClick={(e) => {
                                                downloadTemplateFiles(dropDownItem[1]);
                                            }}
                                        >
                                            {dropDownItem[1]}
                                        </Dropdown.Item>
                                    </Dropdown.Menu>
                                </Dropdown>
                            </div>
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PagesHeader;