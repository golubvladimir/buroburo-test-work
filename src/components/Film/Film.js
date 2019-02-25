import React from 'react';

const Film = (props) => {

    let actors = props.filmInfo.actors.map((actor, index) => <li key={index}>{actor}</li>);

    return (
        <div>
            <h1>{ props.filmInfo.name }</h1>
            <ul>
                { actors }
            </ul>
        </div>
    )
};

export default Film;