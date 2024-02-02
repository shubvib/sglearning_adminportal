import React, { useRef, useEffect } from 'react';
import { Tooltip, OverlayTrigger, Button, Modal, Form, Spinner } from 'react-bootstrap';
import { BsCloudUpload } from 'react-icons/bs';
import { GrDocumentUpload } from 'react-icons/gr';
import { MdClose } from 'react-icons/md';
import { ToastContainer } from 'react-toastify';
import { useState } from 'react';

const DemoModal = (props) =>{
    const {courseList,Disabled,columwiseFormat,showLoader=false,handleDemoClose,isValidCreateData,handleCreateSubmit,show} = props;

    const [disabled,setDisabled] = useState(false)

    useEffect (()=>{
        setDisabled(Disabled)

        return ()=>{
            setDisabled(false);
        }
    })


    const Demoupload = () =>{
            return(
                <div>
                    <div className="row">
                        {
                            courseList.map((option,i)=>{
                                
                                    return <div className="col-md-6">
                                    hi
                                </div>
                                
                            })
                        }
                    </div>
                </div>
            )
    }


    return(
        <div className="modal-main-dark">
            <Modal show={show} onHide={handleDemoClose} className="modal-dark create-test-modal" centered backdrop="static">
                {showLoader && <div className="loader">
                    <Spinner animation="border" role="status">
                        <span className="sr-only">Loading...</span>
                    </Spinner>
                </div>}
                <ToastContainer autoClose={5000} position="top-right" className="tost-dark-container" style={{ borderRadius: 5, fontFamily: 'GOTHIC' }} />
                <Modal.Header closeButton>
                    <div className="modal-title-box">
                        <h3><GrDocumentUpload size={26} />Demo Modal</h3>
                    </div>
                </Modal.Header>
                <Modal.Body>
                    <div className="modal-contemt-wrapper">
                        <form className="forms-sample">
                            {Demoupload()}
                        
                        </form>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" className="closeBtn" onClick={handleDemoClose}>
                        Close
                </Button>
                    <Button
                        variant="primary" className={`uploadeBtn ${isValidCreateData ? '' : 'disabled'}`} onClick={() => {
                            handleCreateSubmit()
                        }} >
                        Submit
                </Button>
                </Modal.Footer>
            </Modal>
        </div>
    )
}
export default DemoModal;