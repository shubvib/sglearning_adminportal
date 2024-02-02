import React, { useState, useEffect } from 'react';

import { Button, Modal } from 'react-bootstrap';
import { BsChevronDoubleDown, BsPeople, } from 'react-icons/bs';
import { GrDocumentStore } from "react-icons/gr";
import CommonFunctions from '../../../../utils/CommonFunctions';
const SubjectMappingModal = (props) => {
    const { showSubjectMappingModal, closeSubjectMappingModal, onSubjectMapingSubmit, documentSubjects, subjectList, courseWiseSubjects } = props;
    const [docSubjects, setDocSubjects] = useState([]);
    const [mappingSubjects, setSubjectList] = useState([]);
    const [mappedSubjects, setMappedSubjects] = useState([subjectList]);
    const [disableMapButton, setMapButtonDisabled] = useState(true);

    useEffect(() => {
        if (showSubjectMappingModal) {
            let mappingArray = [];
            documentSubjects.map((sub, index) => {
                let findMatchingSubject = -1;
                if (sub) {
                    findMatchingSubject = subjectList.find((e) => e.name.toLowerCase() === sub.toLowerCase());
                    if (findMatchingSubject) {
                        findMatchingSubject = findMatchingSubject.name;
                    } else {
                        findMatchingSubject = -1;
                    }
                }
                // const subCaseChange = CommonFunctions.toTitleCase(sub);

                mappingArray[index] = findMatchingSubject;
            });
            console.log('mapping on useEffect', mappingArray)
            setMappedSubjects(mappingArray);
            console.log('length', mappingArray.length);
            console.log('document length', documentSubjects.length);
        }
    }, [showSubjectMappingModal]);

    useEffect(() => {
        handleDisableMapButton();
    }, [mappedSubjects])


    const handleChange = (e, index) => {
        console.log('handle change', e.target.value, index)
        let mappingArray = [];
        mappedSubjects.map((subject, i) => {
            let obj = subject;
            if (i === index) obj = e.target.value;
            mappingArray.push(obj)
        });
        // mappingArray[index] = e.target.value;
        setMappedSubjects(mappingArray);
    }

    const handleDisableMapButton = () => {
        console.log('maaped subjects', mappedSubjects);
        const notSelected = mappedSubjects.find((e) => (e === -1 || e === '-1'));
        console.log('notSelected', notSelected);
        if (notSelected === -1 || notSelected === '-1') {
            setMapButtonDisabled(true);
            return true;
        }
        setMapButtonDisabled(false);

        return false;
    }

    return (
        <div className="modal-main-dark">
            <Modal show={showSubjectMappingModal} onHide={closeSubjectMappingModal} size="sm" className="modal-dark subject-mapping-modal" centered>
                <Modal.Header closeButton>
                    <div className="modal-title-box">
                        <h3><GrDocumentStore size={26} /> Subject Mapping</h3>
                    </div>
                </Modal.Header>
                <Modal.Body>
                    <div className="subject-mapping-wrapper">
                        <div className="subject-mapping-box">
                            <div className="row">
                                <div className="col-sm-6">
                                    <div className="subject-mapping-header-title">
                                        <label className="subject-mapping-label-title">Doc Subjects</label>
                                    </div>
                                </div>
                                <div className="col-sm-6">
                                    <div className="subject-mapping-header-title">
                                        <label className="subject-mapping-label-title">Applicable Subjects</label>
                                    </div>
                                </div>
                            </div>
                            {documentSubjects.map((subject, i) => {
                                return <div className="row mr-b" key={`docSubj_${i}`}>
                                    <div className="col-sm-6">
                                        <div className="subject-mapping-list-box">
                                            <label className="subject-mapping-label">{subject ? subject : 'None'}</label>
                                        </div>
                                    </div>
                                    <div className="col-sm-6">
                                        <div className="subject-mapping-select-list-box">
                                            <div className="form-group">
                                                {/* <select className={`form-control ${!mappedSubjects[i] ? 'inputError' : ''}`} */}
                                                <select className={`form-control ${mappedSubjects[i] === -1 || mappedSubjects[i] === '-1' ? 'inputError' : ''}`}
                                                    onChange={(e) => handleChange(e, i)}
                                                    value={mappedSubjects[i]}
                                                >
                                                    <option key={`listItem_${i}_default`} value={-1} label={'--Select--'} ></option>
                                                    {
                                                        // subjectList.map((sub, index) => {
                                                        courseWiseSubjects.map((sub, index) => {
                                                            return <option key={`listItem_${sub.id}`} >{sub.name}</option>
                                                        })}
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            })}
                        </div>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" className="closeBtn" onClick={closeSubjectMappingModal}>
                        Close
                    </Button>
                    <Button variant="primary" className={`uploadeBtn ${disableMapButton ? 'disabled' : ''}`} onClick={() => {
                        onSubjectMapingSubmit(mappedSubjects)

                    }}>
                        Map
                   </Button>
                </Modal.Footer>
            </Modal >
        </div >
    )
}

export default SubjectMappingModal;