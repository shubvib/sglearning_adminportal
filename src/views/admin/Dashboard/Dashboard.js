
import React, { useEffect, useState } from 'react';
import { ProgressBar, Dropdown, Media, InputGroup, FormControl, Button, Image, Col } from 'react-bootstrap';
import assets from '../../../assets';
import { RiShieldUserLine } from "react-icons/ri";
import { GiPodiumWinner } from "react-icons/gi";
import { Api } from '../../../services';
import { AppConfig, UrlConfig } from '../../../config';
import { ExamListAction } from '../../../reduxManager';
import CommonFunctions from '../../../utils/CommonFunctions';
import moment from 'moment';
import { ToastContainer, toast } from "react-toastify";
import { connect } from 'react-redux';

const Dashboard = (props) => {
  const {ExamScheduleId,examList} = props;

  const [platformStudentCount, setPlatformStudentCount] = useState();
  const [platformUpcomingExamCount, setPlatformUpcomingExamCount] = useState();
  const [platformExecutedExamCount, setPlatformExecutedExamCount] = useState();
  const [accountUpcomingExamCount, setAccountUpcomingExamCount] = useState();
  const [accountStudentCount, setAccountStudentCount] = useState();
  const [accountExecutedExamCount, setAccountExecutedExamCount] = useState();
  const [resentRegisteredAccounts, setResentRegisteredAccounts] = useState([]);
  const [instituteList, setInstituteList] = useState([]);
  const [searchedInstitutes, setSearchInstitute] = useState([]);

  const [counterForPresent, setCounterForPresent] = useState(1);
  const [selectAllBatches, setSelectAllBatches] = useState(false);
  const [batchArray, setBatchArray] = useState(null);
  const [responseIsNull, setResponseIsNull] = useState(false);
  const [listLoader, setListLoader] = useState(false);
  const [isDataPresent, setIsDataPresent] = useState();
  const [heading, setHeading] = useState();
  const [flagForExportPresent, setFlagForExportPresent] = useState(false);
  const [showConfirmation, setConfirmation] = useState(false);
  const [confirmationLoader, setConfirmationLoader] = useState(false);
  const [blankData, setBlankData] = useState();
  const [eexamReport, setExamReport] = useState();  
  const [listLaod, setListLoad] = useState(true);
  const [examName, setExamName] = useState();
  const [examDate, setExamDate] = useState();
  const [hideExport, setHideExport] = useState(false);
  const [flag, setFlag] = useState(0);
  const [counterForAbsent, setCounterForAbsent] = useState(1);
  const [attemptedAndDiscardedList, setAttemptedAndDiscardedList] = useState(null);
  const [attemptedButNotSubmittedList, setAttemptedButNotSubmittedList] = useState(null);
  const [attemptedAndDiscardedCountt, setAttemptedAndDiscardedCount] = useState(null);
  const [attemptedButNotSubmittedCountt, setAttemptedButNotSubmittedCount] = useState(null);
  const [notAttemptedCountt, setNotAttemptedCount] = useState(null);
  const [totalStudentsCountt, setTotalStudentsCount] = useState(null);
  const [notAttemptedList, setNotAttemptedList] = useState(null);
  const [showReport, setShowReport] = useState(false);
  const [exportDataList, setExportDataList] = useState(null);
  const [loader, setLoader] = useState(false);
  

  useEffect(() => {
    //get dashboard stats
    getDashBoardStats();
    //get institute on platforms
     getInstituteData();
     //generateRank();
     getReport();
     getExamList();
     //generateRank();
     //examWiseAnalysis();
  }, [])

const getDashBoardStats = () =>{
  Api.getApi(UrlConfig.apiUrls.dashBoard)
    .then((response)=>{
      if(response){
        const {data} = response;
        console.log(data)
        const {platformStudentCount,platformUpcomingExamCount,platformExecutedExamCount,accountStudentCount,accountExecutedExamCount,resentRegisteredAccounts}=data
            setPlatformStudentCount(platformStudentCount);
            setPlatformUpcomingExamCount(platformUpcomingExamCount);
            setPlatformExecutedExamCount(platformExecutedExamCount);
            setAccountUpcomingExamCount(accountUpcomingExamCount);
            setAccountStudentCount(accountStudentCount);
            setAccountExecutedExamCount(accountExecutedExamCount);

            let recentInt = [];

            resentRegisteredAccounts.map((receInt)=>{
              if(receInt.shortName === 'S_MKT' || receInt.shortName === 'S_DEV'){

              }
              else{
                if(AppConfig && !AppConfig.isDevelopment && !AppConfig.isStaging){
                  if(receInt.shortName.trim === 'demoorg' || receInt.shortName.trim === 'Softech Support' || receInt.shortName.trim === 'SGI'){

                  }
                  else{
                    recentInt.push(receInt)
                  }
                }
                else{
                  recentInt.push(receInt)
                }
              }
            })
            setResentRegisteredAccounts(recentInt)
      }
    })
}

const getInstituteData = () =>{
  Api.getApi(UrlConfig.apiUrls.accounts,{AccountType : 2})
      .then((response)=>{
        const {data} = response;
        console.log(data);
        let newInstArray = [];
          data.map((inst,index)=>{
            if(inst.shortName === 'S_MKT' || inst.shortName === 'S_DEV'){

            }
            else{
              if(inst.shortName.trim === 'demoorg' || inst.shortName.trim === 'Softech Support' || inst.shortName.trim === 'SGI'){
                if(AppConfig && !AppConfig.isDevelopment && !AppConfig.isStaging){

                }
                else{
                  newInstArray.push(inst);
                }
              }
              else{
                newInstArray.push(inst);
              }
            }
          })
          setInstituteList(newInstArray);
          setSearchInstitute(newInstArray)
      })
}



  const InstituteCount = () => {
    return (<>

      {resentRegisteredAccounts.map((accounts, index) => {
        return <Media key={index}>
          <img className="img-sm" src={accounts.profileImage ? accounts.profileImage : props.appTheme && props.appTheme.currentTheme === 'dark' ? assets.images.instituteDefaultImage : assets.images.instituteDefaultBlackImage} alt="Institute Icon" />
          <Media.Body key={index}>
            <div className="headermedia">
              <h5>{accounts.shortName}</h5>
              <span className="date-created">{moment(accounts.dateCreated).format('DD MMM YYYY')}</span>
            </div>
            <span>{`(${accounts.name})`}</span>
            <p>
              {accounts.address}
            </p>

          </Media.Body>
        </Media>
      })}


    </>
    )
  }
  const InstituteList = () => {


    return (<>
      <div className="row">
        {searchedInstitutes.map((institute, index) => {
          // const imageUrl = ((institute.profileImage === null) || (institute.profileImage === '')) ?
          //   assets.images.instituteDefaultImage :
          //   institute.profileImage

          const imageUrl = institute.profileImage ? institute.profileImage : props.appTheme && props.appTheme.currentTheme === 'dark' ? assets.images.instituteDefaultImage : assets.images.instituteDefaultBlackImage;


          // console.log(`imageUrl_${index}`, imageUrl);
          return <div className="col-sm-4" key={index}>
            <div className="institutes-info-box">
              {/* <Image className="img-sm mb-1" src={(institute.profileImage === null) || (institute.profileImage === '') ? assets.images.instituteDefaultImage : institute.profileImage} alt="Institute Icon" /> */}
              {/* <Col xs={3} md={2}> */}
              <Image className="img-sm mb-1" src={`${imageUrl}`} rounded />
              {/* </Col> */}
              <h5>{institute.shortName}</h5>
            </div>
          </div>

        })}
      </div>
    </>
    );
  }

  const getReport = () => {

    var params = new URLSearchParams();
 
  
  

    // Api.getApi(UrlConfig.apiUrls.examReport, params)
    Api.getApi(`examSchedule/${ExamScheduleId}/report`, params)
        
            //(counterForPresent === 1)
            //console.log('responseeeee', response);
            .then((response) => {
              const {data} = response
              console.log(data);
              console.log('response', data.examReport[1].score.scoredMarks);

              //eexamReport && getReport(true);
              //setConfirmationLoader(false);
             // setConfirmation(false);
              //toast.success('Ranks Calculated Successfully !!');
          })
          .catch((error) => {
              console.log('error', error)
              const errorMessage = CommonFunctions.apiErrorMessage(error);
              console.log('errorMessage', errorMessage);
              //setConfirmationLoader(false);
              //setConfirmation(false);
              //.error(errorMessage);
          })
      }
    
            
/* generateRank = () => {
  setConfirmationLoader(true);
  const payload = {
      examScheduleId: ExamScheduleId
  }
  Api.getApi(`${UrlConfig.apiUrls.generateRank}`, payload)
      .then((response) => {
          console.log('response', response);
          eexamReport && getReport(true);
          setConfirmationLoader(false);
          setConfirmation(false);
          toast.success('Ranks Calculated Successfully !!');
      })
      .catch((error) => {
          console.log('error', error)
          const errorMessage = CommonFunctions.apiErrorMessage(error);
          console.log('errorMessage', errorMessage);
          setConfirmationLoader(false);
          setConfirmation(false);
          toast.error(errorMessage);
      })
}*/
const getExamList = () => {
  Api.getApi(UrlConfig.apiUrls.getExamList)
      .then((response) => {
          if (response) {
              const { data } = response;
              ExamListAction.setExamList(data);

          } else {
            ExamListAction.setExamList([]);
          }
      })
      .catch(error => {
          const errorMessage = CommonFunctions.apiErrorMessage(error);
          console.log('errorMessage', errorMessage)
          toast(errorMessage, {
              type: "error",
          });
      });
    }


  const searchInstitute = (searchText) => {
    console.log('searchText', searchText);
    if (!instituteList && instituteList.length === 0) return null
    if (!searchText) { setSearchInstitute(instituteList); return null }
    const newSearchText = searchText.toLowerCase();
    const newSearchText1 = searchText.toUpperCase();
    let newSearchedArray = [];
    instituteList.map((item) => {
      const { name, shortName, address } = item;
      if ((name.toLowerCase().indexOf(newSearchText) > -1) || (name.toUpperCase().indexOf(newSearchText1) > -1) || (shortName.toLowerCase().indexOf(newSearchText) > -1) || shortName.toLowerCase().indexOf(newSearchText) > -1 || address.toLowerCase().indexOf(newSearchText) > -1 || address.toUpperCase().indexOf(newSearchText) > -1) {
        newSearchedArray.push(item);
      }
    });
    setSearchInstitute(newSearchedArray)
  }


  return (
    <div className="dashboard-wrapper">
      <div className="row">
        <div className="col-xl-8 col-lg-8 col-md-6 col-sm-6 grid-margin">
          <div className="row">
            <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 grid-margin stretch-card">
              <div className="card card-statistics pull-up">
                <div className="card-body main-box1">

                  <div className="clearfix">
                    <div className="float-left">
                      <p className="mb-0 text-left text-light">Total no of students on SG Learning</p>
                      <div className="fluid-container">
                        <h3 className="font-weight-medium text-left mb-0 mt-3">{platformStudentCount}</h3>
                      </div>
                    </div>
                    <div className="float-right">
                      <div className="card-icon-wrapper box1 slide-top">
                        {/* <i className="mdi mdi-cube icon-lg"></i> */}
                        <RiShieldUserLine />
                      </div>

                    </div>
                  </div>
                  {/* <p className="text-muted mt-3 mb-0">
                  <i className="mdi mdi-alert-octagon mr-1" aria-hidden="true"></i> 65% lower growth
                  </p> */}

                </div>
              </div>
            </div>
            <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 grid-margin stretch-card">
              <div className="card card-statistics pull-up">
                <div className="card-body main-box2">
                  <div className="clearfix">
                    <div className="float-left">
                      <p className="mb-0 text-left text-light">Total no of exams conducted on SG Learning</p>
                      <div className="fluid-container">
                        <h3 className="font-weight-medium text-left mb-0 mt-3 ">{platformExecutedExamCount}</h3>
                      </div>
                    </div>
                    <div className="float-right">
                      <div className="card-icon-wrapper box2 slide-top">
                        <i className="mdi mdi-receipt  icon-lg"></i>
                        {/* <GrDocumentPerformance /> */}
                      </div>
                    </div>
                  </div>
                  {/* <p className="text-muted mt-3 mb-0">
                  <i className="mdi mdi-bookmark-outline mr-1" aria-hidden="true"></i> Product-wise sales
                </p> */}
                </div>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-xl-6 col-lg-6 col-sm-6 stretch-card">
              <div className="card">
                <div className="card-body">
                  <div className="header-box">
                    <h4 className="card-title text-light">Institutes on SG Learning</h4>
                    <span className="total-inst-count">{instituteList.length}</span>
                  </div>
                  <div className="explorerSearchWrapper">
                    <InputGroup>
                      <FormControl
                        placeholder="Search Institute"
                        aria-label="Search"
                        aria-describedby="basic-addon2"

                        onChange={(e) => {
                          searchInstitute(e.target.value);
                        }}
                      />
                      <InputGroup.Append>
                        <Button variant="outline-secondary"><i className="fa fa-search"></i></Button>
                      </InputGroup.Append>
                    </InputGroup>
                  </div>
                  <div className="content-insitute-list">
                    {InstituteList()}
                  </div>

                </div>
              </div>
            </div>
            <div className="col-xl-6 col-lg-6 col-sm-6 stretch-card">
              <div className="card">
                <div className="card-body">
                  <div className="confetti">
                    <div className="header-box">
                      <h4 className="card-title text-light">Recently registered institutes</h4>
                      {/* <span className="total-inst-count">555</span> */}
                    </div>

                    <div className="content-insitute-list incoming-institute-list">
                      {InstituteCount()}
                      {/* <div className="watermark-box"></div> */}
                    </div>
                    <div className="pyro">
                      <div className="before"></div>
                      <div className="after"></div>
                    </div>

                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
        <div className="col-xl-4 col-lg-4 col-md-6 col-sm-6 grid-margin stretch-card">
          <div className="card card-statistics">
            <div className="card-body main-box3">
              <div className="clearfix">
                <div className="float-left">
                  <p className="mb-0 text-left text-light">Last exam toppers</p>
                  <div className="fluid-container">


                  </div>

                </div>
                <div className="float-right">
                  <div className="card-icon-wrapper box3 slide-top">
                    {/* <i className="mdi mdi-poll-box  icon-lg"></i> */}
                    <GiPodiumWinner />
                  </div>

                </div>
              </div>
              <div className="commoning-soon">
                <h3>Coming Soon</h3>
                
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-sm-6 col-md-6 col-lg-6 grid-margin stretch-card">
          <div className="card card-statistics pull-up">
            <div className="card-body main-box1">
              {props.accountList && <div className="name-institute-box-label">
                <span>{props.accountList.shortName}</span>
              </div>}
              <div className="clearfix">
                <div className="float-left">
                  <p className="mb-0 text-left text-light">Total no of students</p>
                  <div className="fluid-container">
                    <h3 className="font-weight-medium text-left mb-0 mt-3">{accountStudentCount}</h3>
                  </div>
                </div>
                <div className="float-right">
                  <div className="card-icon-wrapper box1 slide-top">
                    {/* <i className="mdi mdi-cube icon-lg"></i> */}
                    <RiShieldUserLine />
                  </div>

                </div>
              </div>
              {/* <p className="text-muted mt-3 mb-0">
                  <i className="mdi mdi-alert-octagon mr-1" aria-hidden="true"></i> 65% lower growth
                  </p> */}

            </div>
          </div>
        </div>
        <div className="col-sm-6 col-md-6 col-lg-6 grid-margin stretch-card">
          <div className="card card-statistics pull-up">
            <div className="card-body main-box2">
              {props.accountList && <div className="name-institute-box-label">
                <span>{props.accountList.shortName}</span>
              </div>}
              <div className="clearfix">
                <div className="float-left">
                  <p className="mb-0 text-left text-light">Total no of exams conducted</p>
                  <div className="fluid-container">
                    <h3 className="font-weight-medium text-left mb-0 mt-3">{accountExecutedExamCount}</h3>
                  </div>
                </div>
                <div className="float-right">
                  <div className="card-icon-wrapper box2 slide-top">
                    {/* <i className="mdi mdi-cube icon-lg"></i> */}
                    <i className="mdi mdi-receipt  icon-lg"></i>
                  </div>

                </div>
              </div>
              {/* <p className="text-muted mt-3 mb-0">
                  <i className="mdi mdi-alert-octagon mr-1" aria-hidden="true"></i> 65% lower growth
                  </p> */}

            </div>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-md-4 grid-margin stretch-card">
          <div className="card">
            <div className="card-body py-5">
              <div className="d-flex flex-row justify-content-center align-items">
                <i className="mdi mdi-facebook text-facebook icon-lg"></i>
                <div className="ml-3">
                  <h6 className="text-facebook font-weight-semibold mb-0">2.62 Subscribers</h6>
                  <p className="text-muted card-text">You main list growing</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-4 grid-margin stretch-card">
          <div className="card">
            <div className="card-body py-5">
              <div className="d-flex flex-row justify-content-center align-items">
                <i className="mdi mdi-google-plus text-google icon-lg"></i>
                <div className="ml-3">
                  <h6 className="text-google font-weight-semibold mb-0">3.4k Followers</h6>
                  <p className="text-muted card-text">You main list growing</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-4 grid-margin stretch-card">
          <div className="card">
            <div className="card-body py-5">
              <div className="d-flex flex-row justify-content-center align-items">
                <i className="mdi mdi-twitter text-twitter icon-lg"></i>
                <div className="ml-3">
                  <h6 className="text-twitter font-weight-semibold mb-0">3k followers</h6>
                  <p className="text-muted card-text">You main list growing</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
const mapPropsToState = (state) => {
  return {
    userData: state.userData,
    accountList: state.accountList[0],
    appTheme: state.appTheme,
    examList : state.examList
  }
}
export default connect(mapPropsToState)(Dashboard);











