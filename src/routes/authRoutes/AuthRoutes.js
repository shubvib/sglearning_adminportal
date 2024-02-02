import React, { Component, Suspense, lazy } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import { Dashboard, } from '../../views';
import { Spinner } from '../../components';
//import { UrlConfig } from '../../config';
//import Dashboard from '../../views/admin/Dashboard/Dashboard'
import { UrlConfig } from '../../config';
const HomePage = lazy(() => import('../../views/admin/Dashboard/Dashboard'));
//const Dashboard = lazy(() => import('../../views/admin/Dashboard/Dashboard'));
const PageNotFound = lazy(() => import('../../views/404/404'));
const QuestionPapers = lazy(() => import('../../views/exam/questionPapers/QuestionPapers'));
const AssignedExams = lazy(() => import('../../views/exam/assignedExams/AssignedExams'));
const Demopage = lazy(()=> import ('../../views/admin/Demopage/Demopage'))
// const PublishExam = lazy(() => import('../../views/exam/PublishExam'));
const EnrollStudent = lazy(() => import('../../views/enrollStudent/EnrollStudent'));
//const EnrollFaculty = lazy(() => import('../../views/enrollFaculty/EnrollFaculty'));
//const Reports = lazy(() => import('../../views/reports/Reports'));
//const LiveLecture = lazy(() => import('../../views/liveLecture/LiveLecture'));
//const TermsPrivacyPolicy = lazy(() => import('../../views/termsPrivacyPolicy/TermsPrivacyPolicy'));
//const Trash = lazy(() => import('../../views/trash/Trash'));
const ReportAnalysis = lazy(() => import('../../views/reportAnalysis/ReportAnalysis'));
// const Register = lazy(() => import('../../views/Register/Register'));

const AuthRoutes = () => {
    return (
        <Suspense fallback={<Spinner />}>
            <Switch>
                <Route exact path={UrlConfig.routeUrls.dashboard} component={HomePage} />
                <Route exact path="/" component={HomePage} />
                <Route exact path={UrlConfig.routeUrls.questionpapers} component={QuestionPapers} />
                <Route exact path={UrlConfig.routeUrls.assignedexams} component={AssignedExams} />
                 {/*<Route exact path={UrlConfig.routeUrls.publishexam} component={PublishExam} /> */}
                <Route exact path={UrlConfig.routeUrls.enrollstudent} component={EnrollStudent} />
               {/* <Route exact path={UrlConfig.routeUrls.enrollfaculty} component={EnrollFaculty} />
                <Route exact path={UrlConfig.routeUrls.reports} component={Reports} />
                <Route exact path={UrlConfig.routeUrls.liveLecture} component={LiveLecture} />
                <Route exact path={UrlConfig.routeUrls.termsPrivacyPolicy} component={TermsPrivacyPolicy} />
                <Route exact path={UrlConfig.routeUrls.trash} component={Trash} />
                <Route exact path="/" component={HomePage} /> */}
                <Route exact path={UrlConfig.routeUrls.reportAnalysis} component={ReportAnalysis} />
                {/* <Route exact path="/register"component={Register} /> */}
                {/* <Redirect to="/dashboard" /> */} 
                
                <Route exact path={UrlConfig.routeUrls.demopage} component={Demopage}  />
                <Route component={PageNotFound} />
            </Switch>
        </Suspense>
    );
}

export default AuthRoutes;