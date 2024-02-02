import React, { useState, useEffect, useRef } from 'react';
import { BsChevronDoubleDown, BsPeople, BsCloudUpload } from 'react-icons/bs'
import { GrClose } from 'react-icons/gr';
import { CSVReader } from 'react-papaparse';
import { Tooltip, OverlayTrigger, Button, Modal, Container, InputGroup, FormControl } from 'react-bootstrap';
import ExplorerData from '../../views/enrollStudent/FileExplorerDataUnique';
import PagesHeader from '../../components/shared/Pageheader'

let widthofColum = 257;
const FileExplorerComponent = ({ isFileExploere }) => {

    const [instituteIndex, setinstituteIndex] = useState(-1);
    const [branchIndex, setBranchIndex] = useState(-1);
    const [classIndex, setclassIndex] = useState(-1);
    const [divisionIndex, setdivisionIndex] = useState(-1);
    const [branch, setbranch] = useState(false);
    const [activeMainIndex, setActiveIndex] = useState(-1);
    const [branchArray, setBranchArray] = useState([]);
    const [classArray, setClassArray] = useState([]);
    const [batchArray, setBatchArray] = useState([]);
    const [studentArray, setStudentArray] = useState([]);
    const [FileExplorerArray, setFileExplorerArray] = useState(ExplorerData)


    // dynamic width
    const targetRef = useRef();
    const [column, setcolumnWidth] = useState(256);

    useEffect(() => {
        setcolumnWidth(targetRef.current.offsetWidth / 5);
        console.log(column, 'columncolumncolumncolumncolumncolumn');
        if (widthofColum === 257) { widthofColum = targetRef.current.offsetWidth / 5; }
        console.log(widthofColum, '');

    }, [isFileExploere]);



    const HeaderComponenet = (data) => {
        if (!data) return null;
        const { headerText } = data;
        return (
            <div className="explorerColHeaderWrap">
                <div className="explorerColHeaderTitle">
                    <h5>{headerText}</h5>
                </div>
                <div className="explorerColHeaderCreate">
                    <Button className="pluseBtnCommon"><i className="fa fa-plus"></i></Button>
                </div>
            </div>
        )
    }


    const onClickMenuItem = (name, data) => {
        switch (name) {
            case 'institute':
                console.log(data, 'data')
                setinstituteIndex(data.index);
                setBranchArray(FileExplorerArray[data.index].branches);
                setBranchIndex(-1);
                setActiveIndex(0);
                break;
            case 'branch':
                setBranchIndex(data.index);
                // setBranchArray(FileExplorerArray[data.index].branches);
                setClassArray(FileExplorerArray[instituteIndex].branches[data.index].classes);
                setclassIndex(-1);
                setActiveIndex(1);
                break;
            case 'class':
                setclassIndex(data.index);
                setBatchArray(FileExplorerArray[instituteIndex].branches[branchIndex].classes[data.index].batches);
                setdivisionIndex(-1);
                setActiveIndex(2);
                break;
            case 'batch':
                setdivisionIndex(data.index);
                setStudentArray(FileExplorerArray[instituteIndex].branches[branchIndex].classes[classIndex].batches[data.index].students);
                setActiveIndex(3);
                break;
            case 'student':
                // setdivisionIndex(data.index);

                // setActiveIndex(3);
                break;
        }
    }

    const ComponenetArray = [
        {
            name: 'institute',
            title: 'Institute',
            data: FileExplorerArray,
            mainIndex: activeMainIndex,
            currentIndex: instituteIndex,
            onClickMenuItem: (name, data) => onClickMenuItem(name, data),
            showCheckbox: false,
            showComponenet: true,
            isActive: activeMainIndex == 0
        },
        {
            name: 'branch',
            title: 'Branch',
            data: branchArray,
            mainIndex: activeMainIndex,
            currentIndex: branchIndex,
            onClickMenuItem: (name, data) => onClickMenuItem(name, data),
            showCheckbox: false,
            showComponenet: instituteIndex != -1,
            isActive: activeMainIndex == 1,
        },
        {
            name: 'class',
            title: 'Class',
            data: classArray,
            mainIndex: activeMainIndex,
            currentIndex: classIndex,
            onClickMenuItem: (name, data) => onClickMenuItem(name, data),
            showCheckbox: true,
            showComponenet: instituteIndex != -1 && branchIndex != -1,
            isActive: activeMainIndex == 2,
            onCheckboxChange: (isSelected, i) => {
                // const newClassArray = FileExplorerArray[instituteIndex].branches[branchIndex].classes;
                // setClassArray(newClassArray);
                if (i >= 0) {
                    if (isSelected) {
                        const newBatchArray = FileExplorerArray[instituteIndex].branches[branchIndex].classes[i].batches.map(batch => ({ ...batch, checked: true }));
                        FileExplorerArray[instituteIndex].branches[branchIndex].classes[i].batches = newBatchArray;
                        setBatchArray(newBatchArray);
                    } else {
                        const newBatchArray1 = FileExplorerArray[instituteIndex].branches[branchIndex].classes[i].batches.map(batch => ({ ...batch, checked: false }));
                        FileExplorerArray[instituteIndex].branches[branchIndex].classes[i].batches = newBatchArray1;
                        setBatchArray(newBatchArray1);
                    }
                }

            }
        },
        {
            name: 'batch',
            title: 'Batch',
            data: batchArray,
            mainIndex: activeMainIndex,
            currentIndex: divisionIndex,
            onClickMenuItem: (name, data) => onClickMenuItem(name, data),
            showCheckbox: true,
            showComponenet: instituteIndex != -1 && branchIndex != -1 && classIndex != -1,
            isActive: activeMainIndex == 3,
            showRightComponenet: true,
            onCheckboxChange: (isSelected, i) => {
                const newBatchArray = FileExplorerArray[instituteIndex].branches[branchIndex].classes[classIndex].batches;
                var res = batchArray.filter(val => {
                    return val.checked;
                });
                setBatchArray(newBatchArray);
                // res = res + 1;
                console.log('res len', res.length);
                if (res.length === 0) {
                    let selectedClsObj = FileExplorerArray[instituteIndex].branches[branchIndex].classes.map((cls, i) => i === classIndex ? ({ ...cls, checked: false }) : ({ ...cls }));
                    FileExplorerArray[instituteIndex].branches[branchIndex].classes = selectedClsObj;
                    setClassArray(selectedClsObj);
                    return;
                }
                if (batchArray.length === res.length) {
                    let selectedClsObj = FileExplorerArray[instituteIndex].branches[branchIndex].classes.map((cls, i) => i === classIndex ? ({ ...cls, checked: true }) : ({ ...cls }));
                    FileExplorerArray[instituteIndex].branches[branchIndex].classes = selectedClsObj;
                    setClassArray(selectedClsObj);
                    return;
                }
                if (res.length > 0 && res.length < batchArray.length) {
                    let selectedClsObj = FileExplorerArray[instituteIndex].branches[branchIndex].classes.map((cls, i) => i === classIndex ? ({ ...cls, checked: false }) : ({ ...cls }));
                    FileExplorerArray[instituteIndex].branches[branchIndex].classes = selectedClsObj;
                    setClassArray(selectedClsObj);
                    return;
                }
            }
        },
        {
            name: 'student',
            title: 'Students',
            data: studentArray,
            mainIndex: activeMainIndex,
            currentIndex: -1,
            onClickMenuItem: (name, data) => onClickMenuItem(name, data),
            showCheckbox: false,
            showComponenet: instituteIndex != -1 && branchIndex != -1 && classIndex != -1 && divisionIndex != -1,
            isActive: activeMainIndex == 4,
            showRightComponenet: true,
            onCheckboxChange: () => { }
        }

    ]

    const ColumnComponenet = (columnData) => {
        if (!columnData) return null;
        const { itemData, index } = columnData;
        const { name, title, data, mainIndex, currentIndex, onClickMenuItem, showCheckbox, isActive, showComponenet, showRightComponenet, onCheckboxChange } = itemData;
        return (
            <div className="explorerColContentListWrap" style={{ width: widthofColum }} key={index}>
                {showComponenet &&
                    <>
                        <HeaderComponenet headerText={title} />
                        <div className="explorerColContentscroll">
                            {data.map((e, i) => {
                                return <ul className="commonListContent" key={`${name}_${e.id}`}>
                                    <li>
                                        {showCheckbox && <div className="form-check form-check-neonWhite">
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
                                            {(showRightComponenet && e.code) && <a className="float float-right">[{e.code}]</a>}
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


    const InstituteComponent = () => {
        return (
            <div className="explorerColContentListWrap" style={{ width: widthofColum }}>
                <HeaderComponenet headerText='Institiute' />
                <div className="explorerColContentscroll">
                    {FileExplorerArray.map((e, i) => {
                        return <ul className="commonListContent">
                            <li>
                                <div className="form-check form-check-neonWhite">
                                    <label className="form-check-label text-muted">
                                        <input type="checkbox" className="form-check-input" />
                                        <i className="input-helper"></i>
                                    </label>
                                </div>
                                <Button onClick={() => {
                                    setinstituteIndex(i);
                                    setBranchIndex(-1);
                                    setActiveIndex(0);
                                }} className={instituteIndex === i ? (activeMainIndex == 0 ? "currentSelect" : 'prevSelect') : "commonListNameBtn"}>{e.name}</Button>
                            </li>

                        </ul>
                    })
                    }
                </div>
            </div>
        )
    }

    const BranchComponenet = () => {
        return (
            <div className="explorerColContentListWrap" style={{ width: widthofColum }}>
                <HeaderComponenet headerText='Branch' />
                <div className="explorerColContentscroll">
                    <ul className="commonListContent">
                        {FileExplorerArray[instituteIndex].branches.map((branch, bi) => {
                            return <li>
                                <div className="form-check form-check-neonWhite">
                                    <label className="form-check-label text-muted">
                                        <input type="checkbox" className="form-check-input" />
                                        <i className="input-helper"></i>
                                    </label>
                                </div>
                                <Button onClick={() => {
                                    setBranchIndex(bi);
                                    setclassIndex(-1);
                                    setActiveIndex(1);
                                }} className={branchIndex === bi ? (activeMainIndex == 1 ? "currentSelect " : 'prevSelect') : "commonListNameBtn"}>{branch.name}</Button></li>
                        })}

                    </ul>
                </div>
            </div>
        )
    }

    const ClassComponenet = () => {
        return (
            <div className="explorerColContentListWrap" style={{ width: widthofColum }}>
                <HeaderComponenet headerText='Class' />
                <div className="explorerColContentscroll">
                    <ul className="commonListContent">
                        {FileExplorerArray[instituteIndex].branches[branchIndex].classes.map((c, ci) => {
                            return <li>
                                <div className="form-check form-check-neonWhite">
                                    <label className="form-check-label text-muted">
                                        <input type="checkbox" className="form-check-input" />
                                        <i className="input-helper"></i>
                                    </label>
                                </div>
                                <Button onClick={() => {
                                    setclassIndex(ci);
                                    setdivisionIndex(-1);
                                    setActiveIndex(2);
                                }} className={classIndex === ci ? (activeMainIndex == 2 ? "currentSelect " : 'prevSelect') : "commonListNameBtn"}>{c.name}</Button></li>
                        })
                        }
                    </ul>
                </div>
            </div>
        )
    }

    const BatchComponenet = () => {
        return (
            <div className="explorerColContentListWrap" style={{ width: widthofColum }}>
                <HeaderComponenet headerText='Batch' />
                <div className="explorerColContentscroll">
                    <ul className="commonListContent">
                        {instituteIndex != -1 && branchIndex != -1 && classIndex != -1 && FileExplorerArray[instituteIndex].branches[branchIndex].classes[classIndex].batches.map((d, di) => {
                            return <li>
                                <div className="form-check form-check-neonWhite">
                                    <label className="form-check-label text-muted">
                                        <input type="checkbox" className="form-check-input" />
                                        <i className="input-helper"></i>
                                    </label>
                                </div>
                                <Button onClick={() => {
                                    setdivisionIndex(di);
                                    setActiveIndex(3);
                                }} className={divisionIndex == di ? (activeMainIndex == 3 ? "currentSelect " : 'prevSelect') : "commonListNameBtn"}>{d.name}</Button></li>
                        })
                        }
                    </ul>
                </div>
            </div>
        )
    }

    const StudentComponeent = () => {
        return (
            <div className="explorerColContentListWrap" style={{ width: widthofColum }}>
                <HeaderComponenet headerText='Students' />
                <div className="explorerColContentscroll">
                    <ul className="commonListContent">
                        {instituteIndex != -1 && branchIndex != -1 && classIndex != -1 && divisionIndex != -1 &&
                            FileExplorerArray[instituteIndex].branches[branchIndex].classes[classIndex].batches[divisionIndex].students.map((d, di) => {
                                console.log(d,"student")
                                return <li>
                                    <div className="form-check form-check-neonWhite">
                                        <label className="form-check-label text-muted">
                                            {/* <input type="checkbox" className="form-check-input" /> */}
                                            <i className="input-helper"></i>
                                        </label>
                                    </div>
                                    <Button onClick={() => {

                                    }} className="commonListNameBtn">{d.name}</Button></li>
                            })
                        }
                    </ul>
                </div>
            </div>
        )
    }


    return (
        <div>
            <div className="student-file-explorer-view" ref={targetRef} >
                <div className="explorerMainWrapper">
                    <div className="explorerInnerWrapper">
                        <div className="explorerMainRowWrapper">
                            <div className="explorerScrollableWrapper">
                                <div className="explorerHorizontalWrapper">
                                    <div className="explorerRowWrapper">
                                        <div className="explorerRowContentListWrap">
                                            {ComponenetArray.map((item, index) => {
                                                return <ColumnComponenet itemData={item} index={index} key={index} />
                                            })}


                                            {/* <InstituteComponent />
                                            {instituteIndex != -1 && <BranchComponenet />}
                                            {(instituteIndex != -1 && branchIndex != -1) && <ClassComponenet />}

                                            {(instituteIndex != -1 && branchIndex != -1 && classIndex != -1) && <BatchComponenet />}
                                            {(instituteIndex != -1 && branchIndex != -1 && classIndex != -1 && divisionIndex != -1) && <StudentComponeent />} */}
                                        </div>
                                        <br style={{ backgroundColor: 'white' }}></br>
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