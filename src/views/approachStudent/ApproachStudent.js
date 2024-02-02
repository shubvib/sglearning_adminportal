import React, { useState, useEffect, useLayoutEffect } from 'react';
import { Button, InputGroup, FormControl } from 'react-bootstrap';
import PagesHeader from '../../components/shared/Pageheader';
import { FileExplorerComponent } from '../../components';
import { connect } from 'react-redux';
import { UrlConfig } from '../../config';
import { CommonApiCall, Api } from '../../services';
import CommonFunctions from '../../utils/CommonFunctions';
import { toast } from 'react-toastify';
const ApproachStudent = (props) => {
    /**************************************Use States**************************************/
    const [instituteIndex, setinstituteIndex] = useState(-1);
    const [branchIndex, setBranchIndex] = useState(-1);
    const [classIndex, setclassIndex] = useState(-1);
    const [divisionIndex, setDivisionIndex] = useState(-1);
    const [studentIndex, setStudentIndex] = useState(-1);
    const [activeMainIndex, setActiveIndex] = useState(-1);
    const [branchArray, setBranchArray] = useState([]);
    const [classArray, setClassArray] = useState([]);
    const [batchArray, setBatchArray] = useState([]);
    const [studentArray, setStudentArray] = useState([]);
    const [selectedStudentsListCount, setSelectedStudentsListCount] = useState(0);
    const [FileExplorerArray, setFileExplorerArray] = useState(props.explorerData);
    const [discoveredStudents, setDiscoveredStudents] = useState(null);
    const [closeCollapse, setCloseCollapse] = useState(true);
    const [showLoader, setLoader] = useState(false);
    /**************************************Use States**************************************/

    // Just to check my CI pipeline
    /**************************************Use Effect**************************************/
    useEffect(() => {
        console.log('discoveredStudents', discoveredStudents);
    }, [discoveredStudents])

    useEffect(() => {
        CommonApiCall.getInstituteData();
    }, []);

    useEffect(() => {
        console.log('FileExplorerArray', FileExplorerArray);
        setFileExplorerArray(props.explorerData);
    }, [props.explorerData])

    useEffect(() => {
        getDiscoverStudentStudentReport();
    }, [])

    // useLayoutEffect(() => {
    //     getDiscoverStudentStudentReport();
    // }, [])
    // get Student List for approach
    /**************************************Use Effect**************************************/

    /**************************************API calls**************************************/
    const getDiscoverStudentStudentReport = () => {
        Api.getApi(`${UrlConfig.apiUrls.getStudentsApproach}`)
            .then((response) => {
                console.log('getStudentsApproach', response)
                setDiscoveredStudents(response.data);
            })
            .catch((error) => {
                console.log('error', error);
            })
    }

    const setApprovalStatus = (batch, studentRequestIds) => {
        setLoader(true);
        const payload = {
            studentRequestIds: studentRequestIds,
            batchId: batch.id
        }
        console.log('payload', payload)
        Api.postApi(UrlConfig.apiUrls.setApprovalStatus, payload)
            .then((response) => {
                console.log('approvalStatusResponse', response);
                toast.success(`${studentRequestIds.length} students added to ${batch.name}`);
                setCloseCollapse(false);
                const studentsRemaining = FileExplorerArray[instituteIndex].branches[branchIndex].classes[classIndex].students.filter(stud => !stud.checked);
                console.log('studentsRemaining', studentsRemaining);
                setStudentArray(studentsRemaining);
                const fE = FileExplorerArray;
                fE[instituteIndex].branches[branchIndex].classes[classIndex].students = studentsRemaining;
                setFileExplorerArray(fE);
                setSelectedStudentsListCount(0);
                getDiscoverStudentStudentReport();
                // setDiscoveredStudents(null);
                setLoader(false);
            })
            .catch((error) => {
                const errorMessage = CommonFunctions.apiErrorMessage(error);
                console.log('errorMessage', errorMessage)
                toast.error(errorMessage);
                setLoader(false);
            })
    }
    /**************************************API calls**************************************/

    /**************************************Functions**************************************/
    const mapStudents = async (data, index) => {
        let studentArray = [];
        discoveredStudents && await discoveredStudents.map((studs, index) => {
            if (studs.classes[0].id === data[data.index].id) {
                console.log('thisStuds', studs);
                console.log('index', index);
                const obj = { ...studs, userId: studs.userInfo.id, name: studs.userInfo.name, code: studs.code };
                studentArray.push(obj);
                discoveredStudents[index].mapped = true;
            }
            FileExplorerArray[instituteIndex].branches[branchIndex].classes[data.index].students = studentArray;
            setStudentArray(studentArray);
        })
        console.log('discoveredStudents', discoveredStudents);
        console.log('FileExplorerArray', FileExplorerArray);
    }

    const onClickMenuItem = (name, data) => {
        switch (name) {
            case 'institute':
                setinstituteIndex(data.index);
                const branchData = data.index >= 0 ? FileExplorerArray[data.index].branches : [];
                setBranchArray(branchData);
                setBranchIndex(-1);
                setActiveIndex(0);
                break;
            case 'branch':
                setBranchIndex(data.index);
                console.log(data)
                const classData = data.index >= 0 ? FileExplorerArray[instituteIndex].branches[data.index].classes : []
                setClassArray(classData);
                setclassIndex(-1);
                setActiveIndex(1);
                break;
            case 'class':
                setclassIndex(data.index);
                console.log(data.index, 'data')
                console.log('classData', data);
                const studentData = data.index >= 0 ? FileExplorerArray[instituteIndex].branches[branchIndex].classes[data.index].students : [];
                if (studentData && studentData.length > 0) {
                    setStudentArray(studentData);
                } else {
                    discoveredStudents && discoveredStudents.length > 0 && mapStudents(data, data.index)
                }
                setStudentIndex(-1);
                const batchData = data.index >= 0 ? FileExplorerArray[instituteIndex].branches[branchIndex].classes[data.index].batches : [];
                setBatchArray(batchData);
                setDivisionIndex(-1);
                setActiveIndex(2);
                break;
            case 'student':
                setStudentIndex(data.index);
                setDivisionIndex(-1);
                setActiveIndex(3);
                break;
            case 'batch':
                console.log(data.index, 'data')
                setDivisionIndex(data.index);
                setActiveIndex(4);
                break;
            default:
                break;
        }
    }

    const ComponentArray = [
        {
            name: 'institute',
            title: 'Institute',
            data: FileExplorerArray,
            mainIndex: activeMainIndex,
            currentIndex: instituteIndex,
            onClickMenuItem: (name, data) => onClickMenuItem(name, data),
            showCheckbox: false,
            showComponenet: true,
            isActive: activeMainIndex === 0
        },
        {
            name: 'branch',
            title: 'Branch',
            data: branchArray,
            mainIndex: activeMainIndex,
            currentIndex: branchIndex,
            onClickMenuItem: (name, data) => onClickMenuItem(name, data),
            showCheckbox: false,
            showComponenet: instituteIndex !== -1,
            isActive: activeMainIndex === 1,
        },
        {
            name: 'class',
            title: 'Class',
            data: classArray,
            mainIndex: activeMainIndex,
            currentIndex: classIndex,
            onClickMenuItem: (name, data) => onClickMenuItem(name, data),
            showCheckbox: false,
            showComponenet: instituteIndex !== -1 && branchIndex !== -1,
            isActive: activeMainIndex === 2
        },
        {
            name: 'student',
            title: 'Students',
            data: studentArray,
            mainIndex: activeMainIndex,
            currentIndex: studentIndex,
            onClickMenuItem: (name, data) => onClickMenuItem(name, data),
            showCheckbox: true,
            showComponenet: instituteIndex !== -1 && branchIndex !== -1 && classIndex !== -1,
            isActive: activeMainIndex === 3,
            showRightComponenet: true,
            rightComponentKey: 'code',
            showHeaderButtons: false,
            onCheckboxChange: (isSelected, i) => {
                setStudentIndex(i);
                const studentsToBeApproved = FileExplorerArray[instituteIndex].branches[branchIndex].classes[classIndex].students.filter(stud => stud.checked);
                setSelectedStudentsListCount(studentsToBeApproved.length);
                console.log('studentsToBeApproved', studentsToBeApproved);
            }
        },
        {
            name: 'batch',
            title: 'Batch',
            data: batchArray,
            mainIndex: activeMainIndex,
            currentIndex: divisionIndex,
            onClickMenuItem: (name, data) => onClickMenuItem(name, data),
            showCheckbox: false,
            showComponenet: instituteIndex !== -1 && branchIndex !== -1 && classIndex !== -1,
            isActive: activeMainIndex === 4,
            showRightComponenet: true,
            rightComponentKey: 'batchCode',
            showApproveButton: true,
            onApproveClick: (name, currentBatch) => {
                setDivisionIndex(currentBatch.index);
                console.log('name', name);
                console.log('currentBatch', currentBatch);
                const studentsToBeApproved = FileExplorerArray[instituteIndex].branches[branchIndex].classes[classIndex].students.filter(stud => stud.checked);
                console.log('studentsToBeApproved', studentsToBeApproved);

                let studentRequestIds = [];
                studentsToBeApproved.map((student) => {
                    studentRequestIds.push(student.id);
                })
                console.log('studentRequestIds', studentRequestIds);
                setApprovalStatus(currentBatch, studentRequestIds);

                console.log('discoveredStudents', discoveredStudents);
                console.log('FileExplorerArray', FileExplorerArray);
            }
        },
    ]
    /**************************************Functions**************************************/

    /**************************************Main Return**************************************/
    return (
        <div>
            {/* <Col xs={6} style={{ position: "absolute" }}> */}

            {/* </Col> */}
            <PagesHeader headerText={"Approach Student"} />
            <div className="common-dark-box explorerMainWrapper approachstudMainWrapperView">
                <div className="common-title-wrapper-dark">
                    <h3 className="common-dark-box-title">Approach Student</h3>
                    <div className="explorerSearchWrapper" style={{ width: "250px" }}>
                        <InputGroup>
                            <FormControl
                                placeholder="Search Student"
                                aria-label="Search"
                                aria-describedby="basic-addon2"
                            />
                            <InputGroup.Append>
                                <Button variant="outline-secondary"><i className="fa fa-search"></i></Button>
                            </InputGroup.Append>
                        </InputGroup>
                    </div>
                </div>
                <div className="approach-stud-main-wrapper-view">
                    {props.explorerData && <FileExplorerComponent
                        ComponenetArray={ComponentArray}
                        onClickMenuItem={onClickMenuItem}
                        selectedStudentsListCount={selectedStudentsListCount}
                        closeCollapse={closeCollapse}
                        showLoader1={showLoader}
                    />}
                </div>
            </div>
        </div>
    )
}
const mapPropsToState = (state) => {
    return {
        accountList: state.accountList,
        explorerData: state.explorerData,
    }
}
export default connect(mapPropsToState)(ApproachStudent);
