import React, { useState, useEffect, useRef } from 'react';
import { BsChevronDoubleDown, BsPeople, BsCloudUpload } from 'react-icons/bs'
import { GrClose } from 'react-icons/gr';
import { CSVReader } from 'react-papaparse';
import { Tooltip, OverlayTrigger, Button, Modal, Container, InputGroup, FormControl, Spinner } from 'react-bootstrap';
import ExplorerData from '../../../views/enrollStudent/FileExplorerDataUnique';

const FileExplorerComponent = (props) => {

//     const [instituteIndex, setinstituteIndex] = useState(-1);
//   const [branchIndex, setBranchIndex] = useState(-1);
//   const [classIndex, setclassIndex] = useState(-1);
//   const [divisionIndex, setdivisionIndex] = useState(-1);
//   const [studentIndex, setStudentIndex] = useState(-1)
//   const [activeMainIndex, setActiveIndex] = useState(-1);
//   const [studentArray, setStudentArray] = useState([]);
//   const [FileExplorerArray, setFileExplorerArray] = useState(props.explorerData);

    const { isFileExploere, ComponenetArray, onClickMenuItem, selectedTest, showLoader, dataForExtraBatchSchedule } = props;
    // dynamic width
    const targetRef = useRef();
    const [columnWidth, setcolumnWidth] = useState('');

    useEffect(() => {
        var res = ComponenetArray.filter(val => {
            return !val.hide;
        });
        const widthofColum = 100 / res.length + '%';
        setcolumnWidth(widthofColum);
    }, [])

    // ***********************************************For Extra Batch Add Feature*********************************
    useEffect(() => {
        console.log('ComponenetArray', ComponenetArray);
    }, [ComponenetArray])

    // ***********************************************Extra Batch Add Feature End*********************************
    const HeaderComponenet = (data) => {
        console.log(data,"data")
        if (!data) return null;
        const { headerText, showHeaderButtons } = data;
        const data1=ComponenetArray.map(x=>x.data.length)
        console.log(data1,"data1")
        return (
            <div className="explorerColHeaderWrap">
                <div className="explorerColHeaderTitle">
                    <h5>{headerText}</h5>
                    
                </div>
               
                {showHeaderButtons && <div className="explorerColHeaderCreate">
                    <Button className="pluseBtnCommon"><i className="fa fa-plus"></i></Button>
                </div>}
            </div>
        )
    }

    const ColumnComponenet = (columnData) => {
        console.log('columnData', columnData);
        if (!columnData) return null;
        const { itemData, index } = columnData;
        const { name, title, data, mainIndex, currentIndex, onClickMenuItem, showCheckbox, isActive, showComponenet, showRightComponenet, onCheckboxChange, hide, rightComponentKey, showLoader, showHeaderButtons } = itemData;
        if (hide) return null;

        return (
            <div className="explorerColContentListWrap" style={{ width: columnWidth }} key={index}>
                {showComponenet &&
                    <>
                        <HeaderComponenet headerText={title} showHeaderButtons={showHeaderButtons} />
                        <div className="explorerColContentscroll">
                            {showLoader &&
                                <div className="loader">
                                    <Spinner animation="border" role="status">
                                        <span className="sr-only">Loading...</span>
                                    </Spinner>
                                </div>
                            }
                            {((!data || data.length === 0 && !showLoader)) && <div className="no-data-found-explorer">
                                <h3>No data found</h3>
                            </div>}
                            {data.map((e, i) => {
                                return <ul className="commonListContent" key={`${name}_${e.id}`}>
                                    <li>
                                        {showCheckbox && <div className={`form-check form-check-neonWhite ${e.partialChecked ? 'partial-checked-partialcolor' : ''}`}>
                                            <label className="form-check-label text-muted">
                                                <input type="checkbox" className="form-check-input" onChange={() => {
                                                    e.checked = !e.checked
                                                    onClickMenuItem(name, { ...data, index: i });
                                                    if (onCheckboxChange && typeof (onCheckboxChange) === 'function') onCheckboxChange(e.checked, i);
                                                }}
                                                    checked={e.checked} index={`chk_${name}_${e.id}`} />
                                                <i className="input-helper"></i>
                                            </label>
                                        </div>}
                                        <Button onClick={() => {
                                            onClickMenuItem(name, { ...data, index: i })
                                        }} className={currentIndex === i ? (isActive ? "currentSelect" : 'prevSelect') : "commonListNameBtn"}>{e.name}
                                            {(showRightComponenet && rightComponentKey && e[rightComponentKey]) && <span className="dark-count float-right">[{e[rightComponentKey]}]</span>}
                                        </Button>
                                    </li>

                                </ul>
                            })
                            }
                        </div>
                    </>
                }
            </div >)
    }

    return (
        <div>
            <div className="student-file-explorer-view" ref={targetRef} >
                {/* {showLoader && <div className="loader">
                    <Spinner animation="border" role="status">
                        <span className="sr-only">Loading...</span>
                    </Spinner>
                </div>} */}
                <div className="explorerMainWrapper">
                    <div className="explorerInnerWrapper">
                        <div className="explorerMainRowWrapper">
                            <div className="explorerScrollableWrapper">
                                <div className="explorerHorizontalWrapper">
                                    <div className="explorerRowWrapper">
                                        <div className="explorerRowContentListWrap">

                                            {ComponenetArray.map((item, index) => {
                                                console.log(item,"item")
                                               
                                                return <ColumnComponenet itemData={item} index={index} key={index} />
                                            })}
                                        </div>
                                        {/* <br style={{ backgroundColor: 'white' }}></br> */}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>


        </div>
    )
}

export default FileExplorerComponent;