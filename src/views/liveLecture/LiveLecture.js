import React from 'react';
import PagesHeader from '../../components/shared/Pageheader';
import { Tab, Nav, InputGroup, Button, FormControl, Dropdown, } from 'react-bootstrap';
import { BsDash } from "react-icons/bs";
import { FaPlus } from "react-icons/fa";
import { MdCheck, MdVideocam } from "react-icons/md";
import { RiLiveLine } from "react-icons/ri";

import assets from '../../assets';

const LiveVideo = (props) => {
    const SearchView = () => {
        return (
            <div className="explorerSearchWrapper">
                <InputGroup>
                    <FormControl
                        placeholder="Search"
                    />
                    <InputGroup.Append>
                        <Button variant="outline-secondary"><i className="fa fa-search"></i></Button>
                    </InputGroup.Append>
                </InputGroup>
            </div>
        )
    }
    const AddSubject = () => {
        return (
            <Dropdown>
                <Dropdown.Toggle className="nav-link add-subject-btn bg-transparent">
                    <FaPlus />
                </Dropdown.Toggle>
                <Dropdown.Menu className="preview-list navbar-dropdown">
                    <div className="drop-down-scrollbar">
                        <div className="row m-0">
                            <div className="col-sm-6">
                                <Dropdown.Item className="dropdown-item preview-item d-flex align-items-center sub-1">
                                    Maths <MdCheck className="checkedmd" />
                                </Dropdown.Item>
                            </div>
                            <div className="col-sm-6">
                                <Dropdown.Item className="dropdown-item preview-item d-flex align-items-center sub-2">
                                    English
                            </Dropdown.Item>
                            </div>
                        </div>
                        <div className="row m-0">
                            <div className="col-sm-6">
                                <Dropdown.Item className="dropdown-item preview-item d-flex align-items-center sub-3">
                                    Maths
                            </Dropdown.Item>
                            </div>
                            <div className="col-sm-6">
                                <Dropdown.Item className="dropdown-item preview-item d-flex align-items-center sub-4">
                                    English
                            </Dropdown.Item>
                            </div>
                        </div>
                        <div className="row m-0">
                            <div className="col-sm-6">
                                <Dropdown.Item className="dropdown-item preview-item d-flex align-items-center sub-5">
                                    Maths
                            </Dropdown.Item>
                            </div>
                            <div className="col-sm-6">
                                <Dropdown.Item className="dropdown-item preview-item d-flex align-items-center sub-6">
                                    English
                            </Dropdown.Item>
                            </div>
                        </div>
                        <div className="row m-0">
                            <div className="col-sm-6">
                                <Dropdown.Item className="dropdown-item preview-item d-flex align-items-center sub-7">
                                    Maths
                            </Dropdown.Item>
                            </div>
                            <div className="col-sm-6">
                                <Dropdown.Item className="dropdown-item preview-item d-flex align-items-center sub-8">
                                    English
                            </Dropdown.Item>
                            </div>
                        </div>
                        <div className="row m-0">
                            <div className="col-sm-6">
                                <Dropdown.Item className="dropdown-item preview-item d-flex align-items-center sub-7">
                                    Maths
                            </Dropdown.Item>
                            </div>
                            <div className="col-sm-6">
                                <Dropdown.Item className="dropdown-item preview-item d-flex align-items-center sub-8">
                                    English
                            </Dropdown.Item>
                            </div>
                        </div>
                        <div className="row m-0">
                            <div className="col-sm-6">
                                <Dropdown.Item className="dropdown-item preview-item d-flex align-items-center sub-7">
                                    Maths
                            </Dropdown.Item>
                            </div>
                            <div className="col-sm-6">
                                <Dropdown.Item className="dropdown-item preview-item d-flex align-items-center sub-8">
                                    English
                            </Dropdown.Item>
                            </div>
                        </div>

                        <div className="row m-0">
                            <div className="col-sm-6">
                                <Dropdown.Item className="dropdown-item preview-item d-flex align-items-center sub-7">
                                    Maths
                            </Dropdown.Item>
                            </div>
                            <div className="col-sm-6">
                                <Dropdown.Item className="dropdown-item preview-item d-flex align-items-center sub-8">
                                    English
                            </Dropdown.Item>
                            </div>
                        </div> <div className="row m-0">
                            <div className="col-sm-6">
                                <Dropdown.Item className="dropdown-item preview-item d-flex align-items-center sub-7">
                                    Maths
                            </Dropdown.Item>
                            </div>
                            <div className="col-sm-6">
                                <Dropdown.Item className="dropdown-item preview-item d-flex align-items-center sub-8">
                                    English
                            </Dropdown.Item>
                            </div>
                        </div>
                        <div className="row m-0">
                            <div className="col-sm-6">
                                <Dropdown.Item className="dropdown-item preview-item d-flex align-items-center sub-7">
                                    Maths
                            </Dropdown.Item>
                            </div>
                            <div className="col-sm-6">
                                <Dropdown.Item className="dropdown-item preview-item d-flex align-items-center sub-8">
                                    English
                            </Dropdown.Item>
                            </div>
                        </div>
                        <div className="row m-0">
                            <div className="col-sm-6">
                                <Dropdown.Item className="dropdown-item preview-item d-flex align-items-center sub-7">
                                    Maths
                            </Dropdown.Item>
                            </div>
                            <div className="col-sm-6">
                                <Dropdown.Item className="dropdown-item preview-item d-flex align-items-center sub-8">
                                    English
                            </Dropdown.Item>
                            </div>
                        </div>
                        <div className="row m-0">
                            <div className="col-sm-6">
                                <Dropdown.Item className="dropdown-item preview-item d-flex align-items-center sub-7">
                                    Maths
                            </Dropdown.Item>
                            </div>
                            <div className="col-sm-6">
                                <Dropdown.Item className="dropdown-item preview-item d-flex align-items-center sub-8">
                                    English
                            </Dropdown.Item>
                            </div>
                        </div>
                        <div className="row m-0">
                            <div className="col-sm-6">
                                <Dropdown.Item className="dropdown-item preview-item d-flex align-items-center sub-7">
                                    Maths
                            </Dropdown.Item>
                            </div>
                            <div className="col-sm-6">
                                <Dropdown.Item className="dropdown-item preview-item d-flex align-items-center sub-8">
                                    English
                            </Dropdown.Item>
                            </div>
                        </div>
                        <div className="row m-0">
                            <div className="col-sm-6">
                                <Dropdown.Item className="dropdown-item preview-item d-flex align-items-center sub-7">
                                    Maths
                            </Dropdown.Item>
                            </div>
                            <div className="col-sm-6">
                                <Dropdown.Item className="dropdown-item preview-item d-flex align-items-center sub-8">
                                    English
                            </Dropdown.Item>
                            </div>
                        </div>
                        <div className="row m-0">
                            <div className="col-sm-6">
                                <Dropdown.Item className="dropdown-item preview-item d-flex align-items-center sub-7">
                                    Maths
                            </Dropdown.Item>
                            </div>
                            <div className="col-sm-6">
                                <Dropdown.Item className="dropdown-item preview-item d-flex align-items-center sub-8">
                                    English
                            </Dropdown.Item>
                            </div>
                        </div>
                        <div className="row m-0">
                            <div className="col-sm-6">
                                <Dropdown.Item className="dropdown-item preview-item d-flex align-items-center sub-7">
                                    Maths
                            </Dropdown.Item>
                            </div>
                            <div className="col-sm-6">
                                <Dropdown.Item className="dropdown-item preview-item d-flex align-items-center sub-8">
                                    English
                            </Dropdown.Item>
                            </div>
                        </div>
                        <div className="row m-0">
                            <div className="col-sm-6">
                                <Dropdown.Item className="dropdown-item preview-item d-flex align-items-center sub-7">
                                    Maths
                            </Dropdown.Item>
                            </div>
                            <div className="col-sm-6">
                                <Dropdown.Item className="dropdown-item preview-item d-flex align-items-center sub-8">
                                    English
                            </Dropdown.Item>
                            </div>
                        </div>
                    </div>
                    <Dropdown.Item className="dropdown-item preview-item d-flex align-items-center border-0 mt-2 sub-add">
                        <FaPlus />Add Subject
                </Dropdown.Item>
                </Dropdown.Menu>
            </Dropdown>
        )
    }
    const timeTableChart = () => {
        return (<>
            <div className="time-table-chart-content">

                <div className="time time-table-inner-content">
                    <span>09:00 am</span>
                    <span>10:45 am</span>
                </div>
                <div className="subject-schedule-box time-table-inner-content">
                    <button className="subject-btn subj1 current-day">Math</button>
                    <div className="live-lecture-video-box current-live-lecture-video-box">
                        <button className="live-lecture-btn">
                            <RiLiveLine />
                            <div className="live-dot">
                                <span className="blink"></span>
                            </div>
                        </button>
                        <button className="live-lecture-uplode-btn"><MdVideocam /></button>
                    </div>
                </div>
                <div className="subject-schedule-box time-table-inner-content">
                    <button className="subject-btn subj2">English</button>
                </div>
                <div className="subject-schedule-box time-table-inner-content">
                    <button className="subject-btn subj3 dash"><BsDash /></button>
                </div>
                <div className="subject-schedule-box time-table-inner-content">
                    <button className="subject-btn subj4">Math</button>
                </div>
                <div className="subject-schedule-box time-table-inner-content">
                    <button className="subject-btn subj7">Math</button>
                </div>
                <div className="subject-schedule-box time-table-inner-content">
                    <button className="subject-btn subj5 dash"><BsDash /></button>
                </div>
                <div className="subject-schedule-box time-table-inner-content">
                    <button className="subject-btn subj6 dash"><BsDash /></button>
                </div>

            </div>
            <div className="time-table-chart-content">
                <div className="time time-table-inner-content">
                    <span>11:00 am</span>
                    <span>12:45 pm</span>
                </div>
                <div className="subject-schedule-box time-table-inner-content">
                    <button className="subject-btn subj2 current-day">English</button>
                    <div className="live-lecture-video-box">
                        <button className="live-lecture-btn">
                            <RiLiveLine />
                            <div className="live-dot">
                                <span className="blink"></span>
                            </div>
                        </button>
                        <button className="live-lecture-uplode-btn"><MdVideocam /></button>
                    </div>
                </div>
                <div className="subject-schedule-box time-table-inner-content">
                    <button className="subject-btn subj5 dash"><BsDash /></button>
                </div>
                <div className="subject-schedule-box time-table-inner-content">
                    <button className="subject-btn subj6 dash"><BsDash /></button>
                </div>
                <div className="subject-schedule-box time-table-inner-content">
                    <button className="subject-btn subj7">Math</button>
                </div>
                <div className="subject-schedule-box time-table-inner-content">
                    <button className="subject-btn subj4">Math</button>
                </div>
                <div className="subject-schedule-box time-table-inner-content">
                    <button className="subject-btn subj1">Math</button>
                </div>
                <div className="subject-schedule-box time-table-inner-content">
                    <button className="subject-btn subj3 dash"><BsDash /></button>
                </div>

            </div>
            <div className="time-table-chart-content">
                <div className="time time-table-inner-content">
                    <span>01:00 pm</span>
                    <span>02:45 pm</span>
                </div>
                <div className="subject-schedule-box time-table-inner-content">
                    <button className="subject-btn subj7 current-day">Math</button>
                    <div className="live-lecture-video-box">
                        <button className="live-lecture-btn">
                            <RiLiveLine />
                            <div className="live-dot">
                                <span className="blink"></span>
                            </div>
                        </button>
                        <button className="live-lecture-uplode-btn"><MdVideocam /></button>
                    </div>
                </div>
                <div className="subject-schedule-box time-table-inner-content">
                    <button className="subject-btn subj3 dash"><BsDash /></button>
                </div>
                <div className="subject-schedule-box time-table-inner-content">
                    <button className="subject-btn subj2">English</button>
                </div>
                <div className="subject-schedule-box time-table-inner-content">
                    <button className="subject-btn subj4">Math</button>
                </div>
                <div className="subject-schedule-box time-table-inner-content">
                    <button className="subject-btn subj5 dash"><BsDash /></button>
                </div>
                <div className="subject-schedule-box time-table-inner-content">
                    <button className="subject-btn subj6 dash"><BsDash /></button>
                </div>
                <div className="subject-schedule-box time-table-inner-content">
                    <button className="subject-btn subj1">Math</button>
                </div>


            </div>
            <div className="time-table-chart-content">
                <div className="time time-table-inner-content">
                    <span>03:00 pm</span>
                    <span>04:45 pm</span>
                </div>
                <div className="subject-schedule-box time-table-inner-content">
                    <button className="subject-btn subj5 dash current-day"><BsDash /></button>
                </div>
                <div className="subject-schedule-box time-table-inner-content">
                    <button className="subject-btn subj6 dash"><BsDash /></button>
                </div>
                <div className="subject-schedule-box time-table-inner-content">
                    <button className="subject-btn subj4">Math</button>
                </div>
                <div className="subject-schedule-box time-table-inner-content">
                    <button className="subject-btn subj7">Math</button>
                </div>
                <div className="subject-schedule-box time-table-inner-content">
                    <button className="subject-btn subj2">English</button>
                </div>
                <div className="subject-schedule-box time-table-inner-content">
                    <button className="subject-btn subj1">Math</button>
                </div>
                <div className="subject-schedule-box time-table-inner-content">
                    <button className="subject-btn subj3 dash"><BsDash /></button>
                </div>
            </div>
            <div className="time-table-chart-content">
                <div className="time time-table-inner-content">
                    <span>05:00 pm</span>
                    <span>06:00 pm</span>
                </div>
                <div className="subject-schedule-box time-table-inner-content">
                    <button className="subject-btn subj1 current-day">Math</button>
                    <div className="live-lecture-video-box">
                        <button className="live-lecture-btn">
                            <RiLiveLine />
                            <div className="live-dot">
                                <span className="blink"></span>
                            </div>
                        </button>
                        <button className="live-lecture-uplode-btn"><MdVideocam /></button>
                    </div>
                </div>
                <div className="subject-schedule-box time-table-inner-content">
                    <button className="subject-btn subj2">English</button>
                </div>
                <div className="subject-schedule-box time-table-inner-content">
                    <button className="subject-btn subj3 dash"><BsDash /></button>
                </div>
                <div className="subject-schedule-box time-table-inner-content">
                    <button className="subject-btn subj4">Math</button>
                </div>
                <div className="subject-schedule-box time-table-inner-content">
                    <button className="subject-btn subj7">Math</button>
                </div>
                <div className="subject-schedule-box time-table-inner-content">
                    <button className="subject-btn subj5 dash"><BsDash /></button>
                </div>
                <div className="subject-schedule-box time-table-inner-content">
                    <button className="subject-btn subj6 dash"><BsDash /></button>
                </div>

            </div>
        </>
        )
    }
    return (
        <div>
            <PagesHeader headerText={"Live Lecture"} />
            <div className="common-dark-box livelectureMainWrapper">
                {/* <div className="common-title-wrapper-dark">
                    <h3 className="common-dark-box-title">Live Video</h3>

                </div> */}
                <div className="live-lecture-main-wrapper-view">
                    <div className="time-table-tab">
                        <div className="time-table-header-top">

                        </div>
                        <Tab.Container id="left-tabs-example" defaultActiveKey="class1">
                            <div className="row">
                                {/* <div className="col-sm-2 pr-0">
                                    <Nav variant="pills" className="flex-column">
                                        <div className="header-classes-box">
                                            <h3>
                                                Classes
                                             <button className="add-class-btn"><FaPlus /></button>
                                            </h3>
                                            <div className="explorerSearchWrapper">
                                                {SearchView()}
                                            </div>
                                        </div>
                                        <Nav.Item>
                                            <Nav.Link eventKey="class1">11th A</Nav.Link>
                                        </Nav.Item>
                                        <Nav.Item>
                                            <Nav.Link eventKey="class2">11th B</Nav.Link>
                                        </Nav.Item>
                                        <Nav.Item>
                                            <Nav.Link eventKey="class3">11th C</Nav.Link>
                                        </Nav.Item>
                                        <Nav.Item>
                                            <Nav.Link eventKey="class4">11th D</Nav.Link>
                                        </Nav.Item>
                                        <Nav.Item>
                                            <Nav.Link eventKey="class5">12th A</Nav.Link>
                                        </Nav.Item>
                                        <Nav.Item>
                                            <Nav.Link eventKey="class6">12th B</Nav.Link>
                                        </Nav.Item>
                                        <Nav.Item>
                                            <Nav.Link eventKey="class7">12th C</Nav.Link>
                                        </Nav.Item>
                                        <Nav.Item>
                                            <Nav.Link eventKey="class8">12th D</Nav.Link>
                                        </Nav.Item>
                                    </Nav>
                                </div> */}
                                <div className="col-sm-12">
                                    <Tab.Content>
                                        <div className="time-table-content-header">
                                            <div className="header-title-box">
                                                <div className="title-name">
                                                    <span>Time</span>
                                                </div>
                                                <div className="add-lecture-time">
                                                    <FaPlus />
                                                    <input type="time" id="appt" name="appt"
                                                        min="09:00" max="18:00" required />
                                                </div>
                                            </div>
                                            <div className="header-title-box">
                                                <div className="title-name">
                                                    <span>Monday</span>
                                                </div>
                                                <div className="add-lecture">
                                                    {AddSubject()}
                                                </div>
                                            </div>
                                            <div className="header-title-box">
                                                <div className="title-name">
                                                    <span>Tuesday</span>
                                                </div>
                                                <div className="add-lecture">
                                                    {AddSubject()}
                                                </div>
                                            </div>
                                            <div className="header-title-box">
                                                <div className="title-name">
                                                    <span>Wednesday</span>
                                                </div>
                                                <div className="add-lecture">
                                                    {AddSubject()}
                                                </div>
                                            </div>
                                            <div className="header-title-box">
                                                <div className="title-name">
                                                    <span>Thursday</span>
                                                </div>
                                                <div className="add-lecture">
                                                    {AddSubject()}
                                                </div>
                                            </div>
                                            <div className="header-title-box">
                                                <div className="title-name">
                                                    <span>Friday</span>
                                                </div>
                                                <div className="add-lecture">
                                                    {AddSubject()}
                                                </div>
                                            </div>
                                            <div className="header-title-box">
                                                <div className="title-name">
                                                    <span>Saturday</span>
                                                </div>
                                                <div className="add-lecture">
                                                    {AddSubject()}
                                                </div>
                                            </div>
                                            <div className="header-title-box">
                                                <div className="title-name">
                                                    <span>Sunday</span>
                                                </div>
                                                <div className="add-lecture">
                                                    {AddSubject()}
                                                </div>
                                            </div>
                                        </div>
                                        <Tab.Pane eventKey="class1">
                                            <div className="time-table-content">
                                                {timeTableChart()}
                                            </div>
                                        </Tab.Pane>
                                        <Tab.Pane eventKey="class2">
                                            <div className="time-table-content">
                                                {timeTableChart()}
                                            </div>
                                        </Tab.Pane>
                                        <Tab.Pane eventKey="class3">
                                            <div className="time-table-content">
                                                {timeTableChart()}
                                            </div>
                                        </Tab.Pane>
                                        <Tab.Pane eventKey="class4">
                                            <div className="time-table-content">
                                                {timeTableChart()}
                                            </div>
                                        </Tab.Pane>
                                        <Tab.Pane eventKey="class5">
                                            <div className="time-table-content">
                                                {timeTableChart()}
                                            </div>
                                        </Tab.Pane>
                                        <Tab.Pane eventKey="class6">
                                            <div className="time-table-content">
                                                {timeTableChart()}
                                            </div>
                                        </Tab.Pane>
                                        <Tab.Pane eventKey="class7">
                                            <div className="time-table-content">
                                                {timeTableChart()}
                                            </div>
                                        </Tab.Pane>
                                        <Tab.Pane eventKey="class8">
                                            <div className="time-table-content">
                                                {timeTableChart()}
                                            </div>
                                        </Tab.Pane>
                                    </Tab.Content>
                                </div>
                            </div>
                        </Tab.Container>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default LiveVideo;