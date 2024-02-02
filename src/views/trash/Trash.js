import React, { useState, useEffect } from 'react';
import { PagesHeader } from '../../components';
import { ButtonGroup, Button, Tabs, Tab, Table, Col, Image, Nav } from 'react-bootstrap'
import { Api } from '../../services';
import { UrlConfig } from '../../config';
import CommonFunctions from '../../utils/CommonFunctions';
import { toast } from 'react-toastify';
import moment from 'moment';
import assets from '../../assets';
const Trash = () => {
    // *************************************Props***************************************

    // *************************************UseStates***************************************
    const [pageHandler, setPageHandler] = useState("students");
    const [deletedStudentList, setDeletedStudentList] = useState(null);
    const [deletedExamList, setDeletedExamList] = useState(null);
    const [pageLoader, setPageLoader] = useState(false);
    // *************************************UseEffects***************************************

    useEffect(() => {
        deletedExams();
        deletedStudents();
    }, [])
    // *************************************Functions***************************************
    const deletedExams = () => {
        setPageLoader(true)
        Api.getApi(UrlConfig.apiUrls.getDeletedExams)
            .then((response) => {
                console.log('deletedExams', response)
                if (response) {
                    const { data } = response;
                    setDeletedExamList(data);
                }
                setPageLoader(false);
            })
            .catch((error) => {
                const errorMessage = CommonFunctions.apiErrorMessage(error);
                console.log('errorMessage', errorMessage)
                toast(errorMessage, {
                    type: "error",
                });
                setPageLoader(false)
            })
    }
    const deletedStudents = () => {
        setPageLoader(true)
        Api.getApi(UrlConfig.apiUrls.getDeletedStudents)
            .then((response) => {
                console.log('deletedStudent', response);
                if (response) {
                    const { data } = response;
                    setDeletedStudentList(data);
                }
                setPageLoader(false)
            })
            .catch((error) => {
                const errorMessage = CommonFunctions.apiErrorMessage(error);
                console.log('errorMessage', errorMessage)
                toast(errorMessage, {
                    type: "error",
                });
                setPageLoader(false);
            })
    }
    // *************************************Views***************************************
    const studentsView = () => {
        return (
            <div className="trash-table-box">
                <Table striped bordered hover variant="dark">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Profile Image</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Phone Number</th>
                            <th>Academic Info</th>
                        </tr>
                    </thead>
                    <tbody>
                        {deletedStudentList ? deletedStudentList.map((student, index) => {
                            const { userInfo, batches, branches, classes } = student;
                            const { name, email, phone, profileImage, id } = userInfo;

                            return (
                                <tr key={id} style={{ textAlign: "center" }}>
                                    <td>{index + 1}</td>
                                    <td>
                                        <img src={!profileImage ? assets.images.studentDefaultImage : profileImage} alt="" className="img-sm" />

                                    </td>
                                    <td>{name !== null ? `${name}` : '-'}</td>
                                    <td>{email !== null ? `${email}` : '-'}</td>
                                    <td>{phone !== null ? `${phone}` : '-'}</td>
                                    <td>{`${branches[0].name} >> ${classes[0].name} >> ${batches[0].name}`}</td>
                                </tr>
                            )
                        })
                            :
                            pageLoader === true ? <tr >
                                <td colSpan="7" className="grad-loader-anim">
                                    Loading...
                                </td>
                            </tr> :
                                <tr>
                                    <td colSpan="7" >
                                        <span>No Data Found</span>
                                    </td>
                                </tr>
                        }
                    </tbody>
                </Table>
            </div>
        )
    }

    const examsView = () => {
        return (
            <div className="trash-table-box">
                <Table striped bordered hover variant="dark">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Exam Name</th>
                            <th>Date Created</th>
                            <th>Duration</th>
                            <th>Marks</th>
                            <th>No Of Question</th>
                            <th>Applicable Courses</th>
                        </tr>
                    </thead>
                    <tbody>
                        {deletedExamList ? deletedExamList.map((exam, index) => {
                            const { name, dateCreated, duration, marks, noOfQuestion, courses } = exam;
                            return (
                                <tr key={exam.id} style={{ textAlign: "center" }}>
                                    <td>{index + 1}</td>
                                    <td>{name}</td>
                                    <td>{moment(dateCreated).format("DD-MM-yyyy")}</td>
                                    <td>{duration}</td>
                                    <td>{marks}</td>
                                    <td>{noOfQuestion}</td>
                                    <td>{courses && courses.map((c) => {
                                        return (
                                            <span>[ {c.name} ]  </span>
                                        )
                                    })}</td>
                                </tr>
                            )
                        }) :
                            pageLoader === true ? <tr >
                                <td colSpan="7" className="grad-loader-anim">
                                    Loading...
                                </td>
                            </tr> :
                                <tr>
                                    <td colSpan="7" >
                                        <span>No Data Found</span>
                                    </td>
                                </tr>
                        }

                    </tbody>
                </Table>
            </div>
        )
    }
    return (
        <div>
            <PagesHeader headerText={"Trash"} />
            <div className="common-dark-box">
                <div className="common-title-wrapper-dark">
                    <div className="trash-tab-box">
                        <Tab.Container id="uncontrolled-tab-example" defaultActiveKey="deletedExams">
                            <Nav variant="pills" className="header-main-nav" >
                                <Nav.Item>
                                    <Nav.Link eventKey="deletedExams">Removed Exams</Nav.Link>
                                </Nav.Item>
                                <Nav.Item>
                                    <Nav.Link eventKey="deletedStudents">Removed Students</Nav.Link>
                                </Nav.Item>
                            </Nav>
                            {/* Contains inline */}
                            <Tab.Content style={{
                                width: "100%",
                                maxWidth: "initial",
                                overflowX: "auto"
                            }}>
                                <Tab.Pane eventKey="deletedExams">
                                    {examsView()}
                                </Tab.Pane>
                                <Tab.Pane eventKey="deletedStudents">
                                    {studentsView()}
                                </Tab.Pane>
                            </Tab.Content>
                        </Tab.Container>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Trash;