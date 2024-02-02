// THis file contains Inline Styles please refer this Omkar Sir
import React, { useState, useEffect } from 'react';
import DatePicker from 'react-date-picker';
import moment from 'moment';
import { Button } from 'react-bootstrap';
import { MdClose } from "react-icons/md";

const FilterMenu = (props) => {
    // ****************************************************Props*************************************************************
    const { showFilterMenu, filterParam, UpdateFilterParams, courseList, columnWiseFormat, clearFilters, applyFilters, closeHandle } = props;
    // ********************************************************Use-States********************************************************
    const [updater, setUpdater] = useState(false);

    // ********************************************************Functions********************************************************
    const statesChecker = () => {
        if (((filterParam.isDateRangeSelected === true) && (filterParam.dateRange.startDate !== null && filterParam.dateRange.endDate !== null)) || ((filterParam.isCurrentDateSelected === true) && (filterParam.currentDate !== null))) {
            return true;
        } else if (filterParam.applicableFor.length > 0) {
            return true;
        } else {
            return false;
        }
    }

    // **************Use-Effects**************
    useEffect(() => {
        console.log('filterParams', filterParam);
    }, [filterParam])

    useEffect(() => {
        // UpdateFilterParams(filterParams)
        console.log('filterParam', filterParam);
    }, [showFilterMenu === true])

    return (
        <div hidden={!showFilterMenu} className="filter-box-main-wrapper">
            {/*************************************************************Date Filter ************************************************************  */}
            <button className="close-btn" onClick={() => {
                UpdateFilterParams(filterParam)
                // clearFilters();
                closeHandle()
                setUpdater(!updater);
            }}><MdClose /></button>
            {/* INLINE */}
            <div className="date-selection-filter">
                {/******************************* CheckBoxes for DateFilter Start ********************************/}
                {/* INLINE */}
                <div className="row">
                    <div className="col-sm-6">
                        <div className="form-check form-check-neonWhite">
                            <label className="form-check-label">
                                <input type="checkbox" id="currentDate" name="currentDate" value="currentDate" checked={filterParam.isCurrentDateSelected}
                                    onChange={() => {
                                        filterParam.isCurrentDateSelected = !filterParam.isCurrentDateSelected;
                                        if (filterParam.isDateRangeSelected === true) {
                                            filterParam.isDateRangeSelected = false;
                                        }
                                        filterParam.currentDate = new Date(Date.now());
                                        UpdateFilterParams(filterParam)
                                        setUpdater(!updater)
                                    }}
                                />
                                <i className="input-helper"></i>
                                Single-Date
                          </label>
                        </div>
                    </div>
                    <div className="col-sm-6">
                        <div className="form-check form-check-neonWhite">
                            <label className="form-check-label">
                                <input type="checkbox" id="dateRange" name="dateRange" value="dateRange" checked={filterParam.isDateRangeSelected} onChange={() => {
                                    filterParam.isDateRangeSelected = !filterParam.isDateRangeSelected;
                                    if (filterParam.isCurrentDateSelected === true) {
                                        filterParam.isCurrentDateSelected = false;
                                    }
                                    filterParam.dateRange.startDate = new Date(Date.now());
                                    filterParam.dateRange.endDate = new Date(Date.now());
                                    UpdateFilterParams(filterParam)
                                    setUpdater(!updater)
                                }} />
                                <i className="input-helper"></i>
                                Date-Range
                            </label>
                        </div>
                    </div>
                </div>
                {/******************************* CheckBoxes for DateFilter End ********************************/}
                {/******************************* Date Range Start ********************************/}
                <div
                    // hidden={filterParam.isDateRangeSelected === false} 
                    //  INLINE 
                    style={(filterParam.isDateRangeSelected === true || filterParam.isCurrentDateSelected === true) ? { opacity: "1" } : { opacity: "0" }}>
                    {filterParam.isDateRangeSelected === true ?
                        <div className="date-range-for-filter">
                            <div className="row">
                                <div className="col-sm-6">
                                    <div>
                                        <DatePicker
                                            clearIcon={null}
                                            format="d-MM-yyyy"
                                            value={(filterParam.dateRange.startDate === "" ? new Date(Date.now()) : filterParam.dateRange.startDate)}
                                            onChange={(value) => {
                                                filterParam.dateRange.startDate = value;
                                                console.log('filterParam.dateRange.startDate', filterParam.dateRange.startDate);
                                                console.log('filterParam.dateRange.startDate Formatted', moment(filterParam.dateRange.startDate).format("YYYY-MM-DD")) //This is to be used in API call
                                                UpdateFilterParams(filterParam);
                                                setUpdater(!updater);
                                            }}
                                        />
                                    </div>
                                </div>
                                <div className="col-sm-6">
                                    <div>
                                        <DatePicker
                                            clearIcon={null}
                                            format="d-MM-yyyy"
                                            minDate={filterParam.dateRange.startDate}
                                            // minDate={moment(filterParam.dateRange.startDate).add(1)}
                                            value={(filterParam.dateRange.endDate === "" ? new Date(Date.now()) : filterParam.dateRange.endDate)}
                                            onChange={(value) => {
                                                filterParam.dateRange.endDate = value;
                                                console.log('filterParam.dateRange.endDate', filterParam.dateRange.endDate);
                                                console.log('filterParam.dateRange.endDate Formatted', moment(filterParam.dateRange.endDate).format("YYYY-MM-DD")) //This is to be used in API call
                                                UpdateFilterParams(filterParam);
                                                setUpdater(!updater);
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div> :
                        <div className="row">
                            <div className="col-sm-6">
                                <div className="single-date">
                                    <DatePicker
                                        clearIcon={null}
                                        format="d-MM-yyyy"
                                        value={(filterParam.currentDate === "" ? new Date(Date.now()) : filterParam.currentDate)}
                                        onChange={(value) => {
                                            filterParam.currentDate = value
                                            console.log('filterParam.currentDate', filterParam.currentDate)
                                            console.log('filterParam.currentDateFormatted', moment(filterParam.currentDate).format("YYYY-MM-DD")) //This is to be used in API call
                                            UpdateFilterParams(filterParam)
                                            setUpdater(!updater)
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                    }
                </div>
                {/******************************* Date Range End ********************************/}
            </div>
            {/*************************************************************Date Filter End************************************************************  */}
            {/* INLINE */}
            <hr />
            {/********************************************* Applicable For Start ********************************************************************/}
            <div className="applicable-for-filter">
                <div className='row'>
                    <div className="col-md-12">
                        {/* INLINE */}
                        <div className="form-group applicable-for-header">
                            <label className="form-control-placeholder" htmlFor="applicableFor" style={{ position: 'initial' }}>Applicable for<sup style={{ opacity: 1 }}>*</sup></label>
                        </div>
                    </div>
                </div>
                <div className="row">
                    {courseList && courseList.map((option, i) => {
                        return <div className="col-md-6 " key={`courseChk_${option.id}_${i}`} >
                            {columnWiseFormat(option, i, "filterMenu")}
                        </div>
                    })}
                </div>
            </div>
            <hr />
            {/******************************* Applicable For End ********************************/}
            {/******************************* Action Buttons ************************************/}
            <div className="filter-buttons">
                <Button
                    className={statesChecker() === true ? 'closeBtn' : 'closeBtn disabled'}
                    variant="secondary"
                    onClick={() => {
                        filterParam.currentDate = null;
                        filterParam.dateRange.startDate = null;
                        filterParam.dateRange.endDate = null;
                        filterParam.applicableFor = []
                        UpdateFilterParams(filterParam)
                        clearFilters();

                        setUpdater(!updater);
                    }} >Clear Filter</Button>
                <Button
                    className={statesChecker() === true ? 'uploadeBtn' : 'uploadeBtn disabled'}
                    variant="success"
                    onClick={() => {
                        applyFilters();
                        setUpdater(!updater);
                    }}
                >Apply Filters</Button>

            </div>
            {/******************************* Action Buttons End************************************/}
        </div >
    )
}

export default FilterMenu;