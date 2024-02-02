import React from 'react';
import PagesHeader from '../../components/shared/Pageheader';
import './reports.scss'
const Reports = () => {
    return (
        <div>
            <PagesHeader headerText={"Report"} />
            <div className="common-dark-box reportMainWrapper">
                <div className="common-title-wrapper-dark">
                    <h3 className="common-dark-box-title">Report</h3>

                </div>
                <div className="report-main-wrapper-view">
                    <div class='comming-soon-body'>
                        <span>
                            <span></span>
                            <span></span>
                            <span></span>
                            <span></span>
                        </span>
                        <div class='base'>
                            <span></span>
                            <div class='face'></div>
                        </div>
                    </div>
                    <div class='longfazers'>
                        <span></span>
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>
                    <h1>...Coming Soon</h1>

                </div>
            </div>
        </div>
    )
}

export default Reports;