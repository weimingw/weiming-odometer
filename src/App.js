import { useState } from 'react';
import PageCounter from './components/pagecounter/PageCounter';
import Odometer from './components/odometer/Odometer';
import ExposedOdometer from './components/exposedodometer/ExposedOdometer';

import './App.scss';

const NUMS = new Array(100).fill(true).map((c, i) => i);
const App = () => {
    const [value, setValue] = useState(0);

    function renderSections() {
        return NUMS.map((n) => <div className="section">{n}</div>);
    }

    function onScroll(e) {
        setValue(Math.floor(e.target.scrollTop / NUMS.length));
    }

    return (
        <div className="app" onScroll={onScroll}>
            <div className="foreground">
                <h3>Scroll this page!</h3>
                <div className="odometers">
                    <div className="odometer-item">
                        <h4>Base Odometer</h4>
                        <Odometer value={value} maxValue={99} />
                    </div>
                    <div className="odometer-item">
                        <h4>Under The Hood</h4>
                        <ExposedOdometer value={value} maxValue={99} />
                    </div>
                    <div className="odometer-item">
                        <h4>Sample Usage</h4>
                        <PageCounter value={value} maxValue={99} />
                    </div>
                </div>
            </div>
            <div className="sections">{renderSections()}</div>
        </div>
    );
};

export default App;
