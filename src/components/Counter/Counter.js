import React from 'react';

const Counter = (props) => {

    return (
        <div>
            <div>
                <p>Мужчины</p>
                <p>{ props.male }</p>
            </div>
            <div>
                <p>Женщины</p>
                <p>{ props.female }</p>
            </div>
            <div>
                <p>Нет пола</p>
                <p>{ props.middle }</p>
            </div>
        </div>
    );
};

export default Counter;