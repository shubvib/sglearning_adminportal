
import React, { useState, useEffect } from 'react';

const buttonRef = React.createRef();
const multiSelectaaaaaaaCheckBox = (props) => {

    const { options } = props;

    return (<div>
        {options.map((option, i) => {
            return <div className="form-check form-check-neonWhite">
                <label className="form-check-label">
                    <input type="checkbox" className="form-check-input"
                        checked={option.selected}
                        onChange={() => {
                            options[i].selected = !options[i].selected
                        }}
                    />
                    <i className="input-helper"></i>
                    {option.lable}
                </label>
            </div>
        })
        }
    </div>
    )
}


const multiSelectCheckBox = ({ options }) => {
    console.log(options, 'optionsoptionsoptionsoptionsoptionsoptionsoptionsoptionsoptionsoptionsoptionsoptionsoptionsoptions')
    // File Validation End

    return (
        <div>
            {options.map((option, i) => {
                return <div className="form-check form-check-neonWhite">
                    <label className="form-check-label">
                        <input type="checkbox" className="form-check-input"
                            checked={option.selected}
                            onChange={() => {
                                options[i].selected = !options[i].selected
                            }}
                        />
                        <i className="input-helper"></i>
                        {option.lable}
                    </label>
                </div>
            })
            }
        </div>

    )
}
export default multiSelectCheckBox;