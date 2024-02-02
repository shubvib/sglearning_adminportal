

import React from 'react';
const CommonTblComponent = ({ tableList, headerList }) => {
    console.log(tableList, headerList)
    return (
        <div>
            <div className="table-responsive">
                <table className="table table-dark">
                    <thead>
                        <tr>
                            {headerList.map((h, i) => {
                                return <th> {h} </th>
                            })}
                        </tr>
                    </thead>
                    <tbody>
                        {
                            tableList.map((e, i) => {
                                return <tr>
                                    <td>{e.id}</td>
                                    <td> {e.name} </td>
                                    <td>{e.date} </td>
                                    <td> {e.status} </td>
                                    <td> {e.action} </td>

                                </tr>
                            })
                        }

                    </tbody>
                </table>
            </div>
        </div>

    )
}

export default CommonTblComponent;