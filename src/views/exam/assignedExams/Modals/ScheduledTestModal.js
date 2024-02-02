import React, { useState, useEffect } from 'react';
import { Tooltip, OverlayTrigger, Button, Modal, Spinner } from 'react-bootstrap';
import { BsChevronDoubleDown } from 'react-icons/bs';
import { GrDocumentUser } from 'react-icons/gr';
import { AiOutlineDoubleRight } from 'react-icons/ai'
import { FcCancel } from 'react-icons/fc';
import { BsChevronDoubleRight } from 'react-icons/bs';
import moment from 'moment';
import UrlConfig from '../../../../config/UrlConfig';
import { Api } from '../../../../services';
import { ToastContainer, toast } from 'react-toastify';
import CommonFunctions from '../../../../utils/CommonFunctions';
import CancellationReasonModal from './CancellationReasonModal';

const ScheduledTestModal = (props) => {
    const { showScheduledModal = false, cloaseScheduledModal = false, examScheduleData, duration, metaDataForShedule } = props;
    // let i = 0;
    const [flag, setflag] = useState(true);
    const [index, setIndex] = useState(0);
    const [showLoader, setLoader] = useState(true);

    // ****************************************For Update Data***********************************
    const [currentExamScheduleData, setCurrentExamScheduleData] = useState([])
    const [updatedDateTime, setUpdatedDateTime] = useState(null);
    const [batchToBeReScheduled, setBatchToBeReScheduled] = useState(null);

    // ******************************************************************************************
    //const [flagForHideButtons, setFlagForHidButtons] = useState(false);
    // ****************************************Cancel Exam for Batch***********************************
    const [batchToBeCancelled, setBatchToBeCancelled] = useState(null);
    const [batchToBeCancelledIndex, setBatchToBeCancelledIndex] = useState(null);
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    let flagForHideButtons = false;

    // *****************************************UseEffects************************************************************************
    useEffect(() => {
        console.log('examScheduleData', examScheduleData);

    }, [examScheduleData])
    useEffect(() => {
        if (showScheduledModal) {
            setTimeout(() => {
                setLoader(false);
            }, 2000);
        }
    }, [showScheduledModal])

    useEffect(() => {
        setCurrentExamScheduleData([])
        setCurrentExamScheduleData(examScheduleData)
        setLoader(false)
    }, [examScheduleData])



    // ******************************************************Api Call******************************************************
    const cancelExam = (reasonForCancellation) => {
        console.log('batchToBeCancelled', batchToBeCancelled);
        setLoader(true);
        const payload = {
            "examScheduleId": `${batchToBeCancelled.examScheduleId}`,
            "batchExamScheduleId": `${batchToBeCancelled.id}`,
            "reason": `${reasonForCancellation}`
        }
        console.log('payload', payload);
        Api.deleteApi(`${UrlConfig.apiUrls.cancelExamSchedule}/${batchToBeCancelled.examScheduleId}/batchExamSchedule/${batchToBeCancelled.id}`, payload)
            .then((response) => {
                console.log('CancelExamScheduleResponse', response)
                toast.success(`Exam Cancelled for: ${batchToBeCancelled.batch.name}`)
                console.log('examScheduleData', examScheduleData);
                let a = examScheduleData;
                a[batchToBeCancelledIndex - 1].isDeleted = true;
                console.log('a', a);
                // examScheduleData[batchToBeCancelledIndex].isDeleted = true;
                setBatchToBeCancelledIndex(null);
                setBatchToBeCancelled(null);
                setLoader(false);
                handleClose();
            }).catch((error) => {
                setLoader(false);
                const errorMessage = CommonFunctions.apiErrorMessage(error);
                console.log('errorMessage', errorMessage)
                toast(errorMessage, {
                    type: "error",
                });
                handleClose();
            })
    }

    // ***************************************************************************************************************************************

    // *****************************************ReSchedule Exam*************************************************
    const updateExamDateTime = (batchData, index) => {
        console.log('batchData', batchData);
        console.log(`${updatedDateTime}:00+05:30`)
        let formattedDateTime = `${updatedDateTime}:00+05:30`
        setLoader(true);
        const payload = {
            "examScheduleId": `${batchData.examScheduleId}`,
            "batchExamScheduleId": `${batchData.id}`,
            "startDateTime": `${formattedDateTime}`,
            "reason": "test rescheduled"
        }
        Api.putApi(`${UrlConfig.apiUrls.updateExamScheduleNew}/${batchData.examScheduleId}/batchExamSchedule/${batchData.id}`, payload).then((response) => {
            console.log('Rescheduled Response', response)
            let newStartDate = new Date(updatedDateTime);
            newStartDate = moment(updatedDateTime).format("LLLL");
            setLoader(false);
            toast.success(`Exam Rescheduled to: ${newStartDate}`);
            setUpdatedDateTime(null);
            setBatchToBeReScheduled(null);
        }).catch((error) => {
            const errorMessage = CommonFunctions.apiErrorMessage(error);
            setLoader(false);
            console.log('errorMessage', errorMessage)
            toast(errorMessage, {
                type: "error",
            });
        })
    }
    // *****************************************************************************************************************

    // ***************************************************Main View************************************************************
    return (
        <div className="modal-main-dark">
            <div className="sheduled-preview-box">
                <div className="sheduled-preview-inner-box">
                    {(examScheduleData && examScheduleData.length > 0) && <div className="sheduled-preview-header-box">
                        <div className="sheduled-preview-header-sub">
                            <div className="sheduled-preview-header align-left" style={{ width: "10%" }}>
                                <span className="sheduled-preview-header-title"> <BsChevronDoubleDown size={15} /></span>
                            </div>
                            <div className="sheduled-preview-header align-left" style={{ width: "20%" }}>
                                <span className="sheduled-preview-header-title">Branch</span>
                            </div>
                            <div className="sheduled-preview-header" style={{ width: "20%" }}>
                                <span className="sheduled-preview-header-title">Class<BsChevronDoubleRight size={14} />Batch</span>
                            </div>
                            <div className="sheduled-preview-header" style={{ width: "50%" }}>
                                <span className="sheduled-preview-header-title"> Date/Time</span>
                            </div>
                        </div>
                    </div>}
                    <div className="sheduled-preview-content-box">
                        {((!examScheduleData && examScheduleData.length === 0) && !showLoader) && <div className="no-data-found">
                            <h3>No data found</h3>
                        </div>}
                        {/* {currentExamScheduleData &&currentExamScheduleData.map((data, i) => { */}
                        {(examScheduleData && examScheduleData.length > 0) &&
                            // setLoader(false)
                            examScheduleData.map((data, i) => {
                                const { accountId, batch, branch, bufferTimeInMinutes, examId, isDeleted, startDateTime, id } = data;
                                // console.log('examStartData', startDateTime);
                                let newStartDate = new Date(startDateTime);
                                newStartDate = moment(newStartDate).format("YYYY-MM-DDTHH:mm:ss");
                                let TodaysDate = Date.now();
                                TodaysDate = moment(TodaysDate).format("YYYY-MM-DDTHH:mm:ss");
                                let tempNewStartDate = new Date(newStartDate);
                                tempNewStartDate.setMinutes(tempNewStartDate.getMinutes() + duration);
                                let date1 = new Date(TodaysDate);
                                let date2 = new Date(tempNewStartDate);
                                // console.log("metaDataForShedule", metaDataForShedule)
                                if (date1 > date2) {
                                    let diffDate = Math.abs(date1 - date2);
                                    diffDate = moment.duration(diffDate, "millisecond");
                                    const { _milliseconds } = diffDate;
                                    if (_milliseconds > 10) {

                                        flagForHideButtons = true
                                    }
                                }
                                else {
                                    flagForHideButtons = false;
                                }
                                let borderDeletedRight = isDeleted === true ? "solid 10px red" : '';
                                // if (isDeleted) return null;
                                return (
                                    <div style={{ borderRight: `${borderDeletedRight}` }} className={(i % 2 === 0) ? "sheduled-preview-content-sub sheduled-preview-content-sub-even" : "sheduled-preview-content-sub sheduled-preview-content-sub-odd"} key={"tblKey" + i}>
                                        <div className="sheduled-preview-content align-left" style={{ width: "10%" }}>
                                            <span className="sheduled-preview-content-text"> {++i}</span>
                                        </div>
                                        <div className="sheduled-preview-content align-left" style={{ width: "20%" }}>
                                            <span className="sheduled-preview-content-text">{data.branch.name}</span>
                                        </div>
                                        <div className="sheduled-preview-content" style={{ width: "20%" }}>
                                            <span className="sheduled-preview-content-text"> {data.class.name}<BsChevronDoubleRight size={14} />
                                                {data.batch.name}</span>
                                        </div>
                                        <div className="sheduled-preview-content" style={{ width: "50%" }}>
                                            <div className="date-time-edit-main-wrapper">
                                                <div className="date-time-edit-wrapper">
                                                    <div className="form-group">
                                                        <input
                                                            key={id}
                                                            disabled={isDeleted === true ? true : false}
                                                            value={newStartDate}
                                                            name={startDateTime}
                                                            type="datetime-local"
                                                            className={!flagForHideButtons ? "form-control date-sheduled-preview" : "form-control date-sheduled-preview disabled"}
                                                            onFocus={() => {
                                                                setIndex(i);
                                                                setflag(false)
                                                            }}
                                                            onChange={(e) => {
                                                                currentExamScheduleData.map((data) => {
                                                                    if (data.id === id) {
                                                                        console.log('myData', data);
                                                                        data.startDateTime = e.target.value;
                                                                        setUpdatedDateTime(e.target.value);
                                                                        setBatchToBeReScheduled(id);
                                                                    }
                                                                    setCurrentExamScheduleData({ ...data })
                                                                });
                                                                setCurrentExamScheduleData(currentExamScheduleData);
                                                            }}
                                                            onBlur={() => { setflag(true) }}
                                                        />
                                                    </div>
                                                    {isDeleted === false && !flagForHideButtons &&
                                                        <div className={`action-btn-wrap action-btn-wrap-apply ${startDateTime ? '' : 'disabled'}`}>
                                                            <Button
                                                                variant="primary"
                                                                className={updatedDateTime === null ? 'uploadeBtn disabled' : 'uploadeBtn'}
                                                                type="button"
                                                                onClick={() => {
                                                                    updateExamDateTime(data)
                                                                }}
                                                            >
                                                                Apply
                                                            </Button>
                                                        </div>}
                                                </div>
                                                {
                                                    (isDeleted === false) ?
                                                        !flagForHideButtons && <div className="action-btn-wrap action-btn-wrap-cancel">
                                                            <OverlayTrigger placement="left" overlay={<Tooltip id="tooltip-bottom" className="common-tooltip">Cancel Exam</Tooltip>}>
                                                                <Button variant="secondary" className="closeBtn"
                                                                    onClick={(e) => {
                                                                        console.log('data', data);
                                                                        handleShow();
                                                                        setBatchToBeCancelled(data);
                                                                        console.log(i);
                                                                        setBatchToBeCancelledIndex(i);
                                                                    }}
                                                                >
                                                                    <FcCancel size={26} />
                                                                </Button>
                                                            </OverlayTrigger>
                                                            {/* {ReasonPopUp(data, i)} */}
                                                        </div> :
                                                        <div style={{
                                                            borderBottom: "0px",
                                                            boxShadow: "1px 1px 10px black",
                                                            width: "200px",
                                                            textAlign: "center",
                                                            backgroundColor: "#000000c4"
                                                        }}>
                                                            <div style={{ width: "100%", padding: 0 }}>
                                                                <span style={{ color: "white", fontWeight: "600", fontSize: "20px" }} >Schedule Deleted</span>
                                                            </div>
                                                        </div>
                                                }

                                            </div>
                                        </div>
                                    </div>
                                )
                            })}
                    </div>
                </div>
            </div>
            {
                show && <CancellationReasonModal
                    batchData={batchToBeCancelled}
                    index={batchToBeCancelledIndex}
                    show={show}
                    handleClose={() => { handleClose() }}
                    showLoader={showLoader}
                    cancelExam={cancelExam}
                />
            }
        </div >
    )
}

export default ScheduledTestModal;