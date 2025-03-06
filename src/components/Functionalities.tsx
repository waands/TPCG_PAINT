import React from 'react';

interface FunctionalitiesProps {
    onDrawLine: () => void;
}

const Functionalities: React.FC<FunctionalitiesProps> = ({ onDrawLine }) => {
    return (
        <div>
            <button className="btn btn-soft btn-primary" onClick={onDrawLine}>Reta</button>
        </div>
    );
};

export default Functionalities;