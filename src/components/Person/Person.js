import React from 'react';

const Person = (props) => {

    return (
        <div>
            { props.personInfo.name }
        </div>
    )
};

export default Person;