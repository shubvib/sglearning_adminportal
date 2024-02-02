import React, { useState, useEffect } from 'react';
import { Button, Modal, Spinner } from 'react-bootstrap';
import { GoReport } from "react-icons/go";
import { IoIosRefresh } from "react-icons/io";
import { FileExplorerComponent } from '../../../../components';
import { useWindowSize } from 'react-use'
import Confetti from 'react-confetti'
import FlipNumbers from "react-flip-numbers";
import CommonFunctions from '../../../../utils/CommonFunctions';
import { UrlConfig } from '../../../../config'
import { CommonApiCall, Api } from '../../../../services';
import { connect } from 'react-redux';
import { toast, ToastContainer } from 'react-toastify';
import moment from 'moment';
import { BsChevronDoubleRight } from 'react-icons/bs';
const LiveExamReportModal = (props) => {
    const { width, height } = useWindowSize()
    const { showLiveExamReportModal, closeLiveExamReportModal, examId, selectedExamSchedule, ExamScheduleId } = props;
    const [examAssignedToStudentsCount, setExamAssignedToStudentsCount] = useState();
    const [examDiscardedCount, setExamDiscardedCount] = useState();
    const [examNotStartedCount, setExamNotStartedCount] = useState();
    const [examStartedCount, setExamStartedCount] = useState();
    const [examSubmittedCount, setExamSubmittedCount] = useState();
    const [isDataPresent, setIsDataPresent] = useState(false);
    const [isLoader, setIsLoader] = useState(true);
    const [flag, setFlag] = useState(false);
    const [batchArray, setBatchArray] = useState(null);//required
    const [selectAllBatches, setSelectAllBatches] = useState(false);//required
    const [showLiveButton, setShowLiveButon] = useState(false);
    const [showLive, setShowLiveCount] = useState(false);
    // const [selectedMin, setSelectedMin] = useState();;



    useEffect(() => {
        if (showLiveExamReportModal && (selectedExamSchedule && selectedExamSchedule.length > 0)) {
            setBatchArray(selectedExamSchedule);
        }

    }, [showLiveExamReportModal, selectedExamSchedule]);

    // useEffect(() => {
    //     if (batchArray && batchArray.length > 0) {
    //         const newSelectedBatchArray = batchArray.map(batch => ({ ...batch, checked: selectAllBatches }));
    //         setBatchArray(newSelectedBatchArray);
    //     }

    // }, [selectAllBatches]);

    useEffect(() => {
        console.log(batchArray);
        if (batchArray && batchArray.length > 0) {
            validatedBatchArray();
        }
    }, [batchArray])
    const validatedBatchArray = () => {
        let selectedArray = [];
        batchArray.map((batch) => {
            batch.checked === true && selectedArray.push(batch);
        });
        if (selectedArray && selectedArray.length > 0) {
            setShowLiveButon(true);
        } else {
            setShowLiveButon(false);
        }
        // console.log('selectedArrayselectedArray', selectedArray);
    }

    const resetLiveExamReportModal = () => {
        console.log('reset called')

        if (selectedExamSchedule) {
            selectedExamSchedule.map((batch) => {
                batch.checked = false;
                return true;
            });
        }

        setShowLiveCount(false);
        setIsDataPresent(false);
        setIsLoader(true);
        // setSelectedMin(0);
        setExamStartedCount(0);
        setExamNotStartedCount(0);
        setExamSubmittedCount(0);
        setExamDiscardedCount(0);
        setExamAssignedToStudentsCount(0);

        setBatchArray(null);
        setSelectAllBatches(false);
        // clearInterval(refreshInterval);
        closeLiveExamReportModal()

    }


    /****************Exam Live Report New code end here **************************************/

    /****************Live Count Functionality Start **************************************/

    useEffect(() => {
        if (selectedExamSchedule && selectedExamSchedule.length > 0) {
            checkUnCheckAllBatches();
        }

        showLiveExamReportModal && getLiveReport(true, true);
        return () => {
            setShowLiveCount(false);
            // setSelectedMin(0);
            // clearInterval(refreshInterval);

        }
    }, [showLiveExamReportModal])

    // let refreshInterval;
    const getLiveReportOnInterval = () => {
        if (showLive) {
            // refreshInterval && clearInterval(refreshInterval)
            // refreshInterval = setInterval(() => {
            //     // getLiveReport(selectedBatchArray);
            //     console.log("selected min", selectedMin);
            // }, selectedMin ? selectedMin : 300000)
            getLiveReport(false);
        }
    }

    const [refreshLoader, setRefreshLoader] = useState(false);
    const [liveCountLoader, setLiveCountLoader] = useState(false);

    const getLiveReport = (isLiveReport = false, flag) => {
        var params = new URLSearchParams();
        let count = 0;
        if (!selectAllBatches && !flag && (batchArray && batchArray.length > 0)) {
            batchArray.map((batch) => {
                if (batch.checked) {
                    console.log('batch.checked', batch)
                    params.append("batchExamScheduleIds", batch.id);
                    count = count + 1;
                }
                return true;
            })
        }
        // if (selectAllBatches || count !== 0 || flag) {
        isLiveReport ? setLiveCountLoader(true) : setRefreshLoader(true);
        Api.getApi(`examSchedule/${ExamScheduleId}/liveStats`, params)
            .then((response) => {
                console.log("response of live count", response);
                if (response) {
                    const { data } = response;
                    const { examAssignedToStudentsCount, examDiscardedCount, examNotStartedCount, examStartedCount, examSubmittedCount } = data;
                    setExamStartedCount(examStartedCount);
                    setExamNotStartedCount(examNotStartedCount);
                    setExamSubmittedCount(examSubmittedCount);
                    setExamDiscardedCount(examDiscardedCount);
                    setExamAssignedToStudentsCount(examAssignedToStudentsCount);
                    setShowLiveCount(true);
                    setIsDataPresent(true);
                    setIsLoader(false);
                }
                else {
                    setShowLiveCount(true);
                    setIsDataPresent(false);
                    setIsLoader(false);
                }
                setRefreshLoader(false);
                setLiveCountLoader(false);

            })
            .catch((error) => {
                setShowLiveCount(true);
                setIsDataPresent(false);
                setIsLoader(false);
                setRefreshLoader(false);
                setLiveCountLoader(false);
                const errorMessage = CommonFunctions.apiErrorMessage(error);
                toast(errorMessage, {
                    type: "error",
                });
            })
        // }
        //  else {
        //     toast('Please select at least one batch', {
        //         type: "error",
        //     });
        // }

    }


    const showLiveCount = () => {
        return (
            <div className="live-count-main-wrapper">
                <div className="row">
                    <div className="col-sm-4">
                        <div className="live-count-label-box">
                            <label>Total count of student:
                                            <span className="counter-flip-span">
                                    <FlipNumbers
                                        play
                                        color="#fff"
                                        background="#333333"
                                        width={30}
                                        height={30}
                                        numbers={`${examAssignedToStudentsCount}`}
                                    />
                                </span>
                            </label>
                        </div>
                    </div>
                    <div className="col-sm-4">
                        <div className="live-count-label-box">
                            <label>Exam started count:
                                            <span className="counter-flip-span">
                                    <FlipNumbers
                                        play
                                        color="#fff"
                                        background="#333333"
                                        width={30}
                                        height={30}
                                        numbers={`${examStartedCount}`}
                                    />
                                </span>
                            </label>
                        </div>
                    </div>
                    <div className="col-sm-4">
                        <div className="live-count-label-box">
                            <label>Exam discarded count:
                                            <span className="counter-flip-span">
                                    <FlipNumbers
                                        play
                                        color="#fff"
                                        background="#333333"
                                        width={30}
                                        height={30}
                                        numbers={`${examDiscardedCount}`}
                                    />
                                </span>
                            </label>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-sm-4">
                        <div className="live-count-label-box">
                            <label>Exam not started count:
                                            <span className="counter-flip-span">
                                    <FlipNumbers
                                        play
                                        color="#fff"
                                        background="#333333"
                                        width={30}
                                        height={30}
                                        numbers={`${examNotStartedCount}`}
                                    />
                                </span>
                            </label>
                        </div>
                    </div>
                    <div className="col-sm-4">
                        <div className="live-count-label-box">
                            <label>Exam submited count:
                                            <span className="counter-flip-span">
                                    <FlipNumbers
                                        play
                                        color="#fff"
                                        background="#333333"
                                        width={30}
                                        height={30}
                                        numbers={`${examSubmittedCount}`}
                                    />
                                </span>
                            </label>
                        </div>
                    </div>
                    <div className="col-sm-4"></div>
                </div>
            </div>
        );
    }

    const checkUnCheckAllBatches = () => {
        const newSelectedBatchArray = (batchArray && batchArray.length > 0) ? batchArray.map(batch => ({ ...batch, checked: !selectAllBatches })) : selectedExamSchedule.map(batch => ({ ...batch, checked: !selectAllBatches }));
        setSelectAllBatches(!selectAllBatches);
        setBatchArray(newSelectedBatchArray);
    }
    const selectAllDecider = () => {
        let batchCount = 0;
        batchArray.map((batch, batchIndex) => {
            if (batch.checked === true) {
                batchCount = batchCount + 1;
            }
        })
        if (batchCount === batchArray.length) {
            setSelectAllBatches(true);
        } else {
            setSelectAllBatches(false);
        }
    }
    const BatchSelectionComponent = () => {
        return (
            <>
                <div className="select-all-box-wrapper">
                    <div className={`form-check form-check-neonWhite`} >
                        <label className="form-check-label">
                            <input type="checkbox" className="form-check-input" onChange={(e) => {
                                // setSelectAllBatches(!selectAllBatches);
                                checkUnCheckAllBatches()
                            }}
                                checked={selectAllBatches}
                            />
                            <i className="input-helper"></i>
                            <div className="select-all-content">
                                <span className="select-all-content-text"> Select All</span>
                            </div>
                        </label>
                    </div>
                </div>
                <div className="scroll-select-report-box">
                    {batchArray && batchArray.map((batches, idx) => {
                        let newStartDate = new Date(batches.startDateTime);
                        newStartDate = moment(newStartDate).format("DD MMM YYYY, hh:mm a");
                        return <div className={(idx % 2 === 0) ? "select-report-content-box select-report-content-box-even" : "select-report-content-box select-report-content-box-odd"} key={"tblKey" + idx}><div className={`form-check form-check-neonWhite`} key={`batchCheckboxes_${batches.id}`} >
                            <label className="form-check-label">
                                <input type="checkbox" className="form-check-input"
                                    checked={batches.checked}
                                    index={`chk_${batches.id}`}
                                    onChange={() => {
                                        batches.checked = !batches.checked;
                                        const newBatchArray1 = batchArray.map(batch => ({ ...batch }));
                                        selectAllDecider();
                                        setBatchArray(newBatchArray1);
                                    }}

                                />
                                <i className="input-helper"></i>
                                <div className="select-single-report-content-wrapper">
                                    <div className="select-single-report-content-text">
                                        <span className="select-single-report-content-text-number"> {++idx}</span>
                                    </div>
                                    <div className="select-single-report-content">
                                        <span className="select-single-report-content-text">
                                            {batches.branch.name}
                                            <BsChevronDoubleRight size={14} />
                                            {batches.class.name}
                                            <BsChevronDoubleRight size={14} />
                                            {batches.batch.name}
                                        </span>
                                        <span className="select-single-report-content-date">{newStartDate}</span>
                                    </div>
                                </div>
                            </label>
                        </div>
                        </div>
                    })}
                </div>
            </>

        )
    }
    const EmptyDataComponent = () => {
        return (
            <div className="no-data-found-explorer">
                <h3>No data found</h3>
            </div>
        )
    }


    return (
        <div className="modal-main-dark">
            <Modal show={showLiveExamReportModal} onHide={() => {
                resetLiveExamReportModal()

            }} size="lg" className="modal-dark live-exam-report-modal-dark" centered backdrop="static">
                <ToastContainer autoClose={5000} position="top-right" className="tost-dark-container" style={{ borderRadius: 5, fontFamily: 'GOTHIC' }} />
                <div className="modal-title-box">
                    <h3><GoReport /> Live Student Count</h3>
                </div>
                <Modal.Header closeButton>
                </Modal.Header>
                <Modal.Body>
                    {isDataPresent && <Confetti
                        width={width}
                        height={height}
                        recycle={false}
                    />}

                    <div className="live-exam-report-main-Wrapper">
                        <div className="live-exam-report-tab-Wrapper">
                            {showLive && <div className="live-exam-report-tab-sub-Wrapper">
                                {isLoader ? <div className="loader">
                                    <Spinner animation="border" role="status" style={{ color: '#000', paddin: 25 }}>
                                        <span className="sr-only">Loading...</span>
                                    </Spinner>
                                </div> :
                                    !isDataPresent ? <div className="no-data-found-explorer">
                                        <h3>No data found</h3>
                                    </div> :
                                        showLiveCount()}
                            </div>}
                        </div>
                        <div className="live-exam-report-file-explorer">
                            <div className="left-side-report">
                                {/* <FileExplorerComponent
                                    ComponenetArray={ComponenetArray}
                                    onClickMenuItem={onClickMenuItem}
                                /> */}
                                {(batchArray && batchArray.length > 0) ? <BatchSelectionComponent /> : <EmptyDataComponent />}
                            </div>
                            <div className="right-side-report">
                                <div className="right-sticky-bar">
                                    <div className="refresh-text-box">
                                        {/* <label>
                                            Auto Refresh in
                                           <select name='selectedMin' onChange={e => {
                                                let selectedMin = ((e.target.value) * 1) * 10000;
                                                setSelectedMin(selectedMin);
                                                clearInterval(refreshInterval);
                                                getLiveReportOnInterval();
                                            }} value={selectedMin} className="form-control">
                                                <option>02</option>
                                                <option>03</option>
                                                <option>04</option>
                                                <option>05</option>
                                                <option>07</option>
                                                <option>08</option>
                                                <option>09</option>
                                                <option>10</option>
                                            </select>
                                            min
                                        </label> */}
                                        <div className={isDataPresent ? "refresh-btn-box" : " refresh-btn-box disabled"}>
                                            <Button variant="primary"
                                                onClick={() => { getLiveReportOnInterval() }}
                                                className={`refreshBtn ${(refreshLoader || liveCountLoader) ? 'disabled' : ''}`}>
                                                <div className="circle"></div>
                                                <IoIosRefresh />  Force to refresh  {refreshLoader && <Spinner size="sm" animation="grow" variant="success" />}
                                            </Button>
                                        </div>
                                    </div>

                                    <div className="download-report-btn-box">
                                        <Button variant="primary"
                                            onClick={e => {
                                                getLiveReport(true);
                                                setFlag(true)
                                            }}
                                            className="download-Report-Btn" >
                                            <div className="circle"></div>
                                            Show Live Count {liveCountLoader && <Spinner size="sm" animation="grow" variant="success" />}
                                        </Button>

                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </Modal.Body>
                {/* <Modal.Footer>
                    <Button variant="secondary" onClick={e => setreset( reset.checked =false )} className="closeBtn">
                        Cancel
                    </Button>
                    <Button variant="primary" className="uploadeBtn">
                        Next
                   </Button>
                </Modal.Footer> */}
            </Modal >
        </div >
    )
}
const mapPropsToState = (state) => {
    return {
        ExamList: state.examList,
        accountList: state.accountList,
        ExplorerData: state.explorerData,
    }
}
export default connect(mapPropsToState)(LiveExamReportModal);


