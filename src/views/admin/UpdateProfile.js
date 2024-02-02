import React, { useEffect, useState } from 'react';
import { Dropdown, Media, Image, Modal, Button, Form } from 'react-bootstrap';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai'
import { ToastContainer } from 'react-toastify';
//import { UserAction, UserAuthenticationAction, AccountListAction } from '../../../reduxManager';

const UpdateProfile = (props) => {
    // ---------------props-------------------------
    const { showUpdateProfile, closeUpdateModal, updateProfileModal } = props;

    // ***---------------------------*useStates---------------------------****
    const [currentPassCode, setCurrentPassCode] = useState("");
    const [newPassCode, setNewPassCode] = useState("");
    const [confirmNewPassCode, setConfirmNewPassCode] = useState("");
    const [message, setMessage] = useState(null);
    const [count, setCount] = useState(0);
    const [color, setColor] = useState('red');
    const [showCurrentPassCode, setShowCurrentPassCode] = useState(false);
    const [showNewPassCode, setShowNewPassCode] = useState(false);
    const [showConfirmNewPassCode, setShowConfirmNewPassCode] = useState(false);

    // useEffect(() => {
    //     console.log('showPassCode', showPassCode)
    // }, [showPassCode])
    // --------------------------Functions-------------------------------------
    const clearStates = () => {
        setCurrentPassCode("");
        setNewPassCode("");
        setConfirmNewPassCode("");
        setMessage(null);
        setColor('red');
    }
    const updateCurrentPassword = (e) => {
        let value = e.target.value;
        if (isNaN(e.target.value) || value.length > 4) return false;
        setCurrentPassCode(e.target.value)
    }

    const updateNewPassword = (e) => {
        let value = e.target.value;
        if (isNaN(e.target.value) || value.length > 4) return false;
        setNewPassCode(e.target.value)
    }

    const updateConfirmPassword = (e) => {
        let value = e.target.value;
        if (isNaN(e.target.value) || value.length > 4) return false;
        setConfirmNewPassCode(e.target.value)
    }

    const handleChangePassCodeButton = () => {
        if (newPassCode !== confirmNewPassCode) {
            setMessage('New Pass-Code does not matched')
            setCount(1);
            return false;
        }
        
        clearStates();
    }
    // ------------ ----------------useEffect ------------ ------------ ------------
    useEffect(() => {
        if (count !== 0) {
            if (confirmNewPassCode && newPassCode) {
                if (confirmNewPassCode === newPassCode) {
                    setMessage('Pass-Code matched');
                    setColor('green')
                } else {
                    setColor('red');
                    setMessage('New Pass-Code does not matched');
                }
            }
        }
    }, [confirmNewPassCode, newPassCode, message, count])
    // ------------ ----------------Main Return ------------ ------------ ------------
    return (
        <div className="modal-main-dark">
            <Modal show={showUpdateProfile} centered size="md" onHide={() => {
                closeUpdateModal();
                clearStates();
            }} className="modal-dark change-password-modal">
                <ToastContainer autoClose={5000} position="top-right" className="tost-dark-container" style={{ borderRadius: 5, fontFamily: 'GOTHIC' }} />
                <Modal.Header closeButton>
                    <div className="modal-title-box">
                        <h3>Change Password</h3>
                        {/* <span>Faculty to be added: {filePreviewData.length}</span> */}
                    </div>
                </Modal.Header>
                <Modal.Body>
                    <div className="change-password">
                        <div className="form-group">
                            <div className="form-group-sub">
                                <input
                                    maxLength="4"
                                    id="currentPassCode"
                                    type={showCurrentPassCode === true ? "text" : "password"}
                                    name="currentPassCode"
                                    required
                                    value={currentPassCode}
                                    onChange={updateCurrentPassword}
                                    className="form-control"
                                />
                                <label className="form-control-placeholder">Current Pass-Code<sup>*</sup></label>
                                <div className="show-password-eye"
                                    onClick={() => {
                                        setShowCurrentPassCode(!showCurrentPassCode);
                                    }}
                                ><span>{showCurrentPassCode === true ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}</span></div>
                            </div>
                        </div>
                        <div className="form-group">
                            <div className="form-group-sub">
                                <input
                                    maxLength="4"
                                    id="newPassCode"
                                    type={showNewPassCode === true ? "text" : "password"}
                                    name="newPassCode"
                                    required
                                    value={newPassCode}
                                    onChange={updateNewPassword}
                                    className="form-control"
                                />
                                <label className="form-control-placeholder">Change Pass-Code<sup>*</sup></label>
                                <div className="show-password-eye"
                                    onClick={() => {
                                        setShowNewPassCode(!showNewPassCode);
                                    }}
                                ><span>{showNewPassCode === true ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}</span></div>
                            </div>
                        </div>
                        <div className="form-group">
                            <div className="form-group-sub">
                                <input
                                    maxLength="4"
                                    id="confirmNewPassCode"
                                    type={showConfirmNewPassCode === true ? "text" : "password"}
                                    name="confirmNewPassCode"
                                    required
                                    value={confirmNewPassCode}
                                    onChange={updateConfirmPassword}
                                    className="form-control"
                                />
                                <label className="form-control-placeholder">Confirm new Pass-Code<sup>*</sup></label>
                                <div className="show-password-eye"
                                    onClick={() => {
                                        setShowConfirmNewPassCode(!showConfirmNewPassCode);
                                    }}
                                ><span>{showConfirmNewPassCode === true ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}</span></div>
                            </div>
                            {message && <div className="error-msg-box">
                                <span style={{ color: `${color}` }}>{message}</span>
                            </div>}
                        </div>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" className="closeBtn" onClick={() => {
                        closeUpdateModal();
                        clearStates();
                    }}>
                        Close
                     </Button>
                    <Button variant="primary" className={(currentPassCode.length === 4 && newPassCode.length === 4 && confirmNewPassCode.length === 4) ? `uploadeBtn` : `uploadeBtn disabled`} onClick={() => {
                        handleChangePassCodeButton();
                    }}>
                        Change Pass-Code
          </Button>
                </Modal.Footer>
            </Modal>
        </div>
    )
}

export default UpdateProfile;