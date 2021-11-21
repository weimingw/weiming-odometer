import { useState } from 'react';
import PageCounter from './components/PageCounter';

const App = () => {
    const [value, setValue] = useState(12);

    function applyValue() {
        setCounterValue(value);
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
            <input
                style={{ zIndex: 1 }}
                value={value}
                onChange={(e) => setValue(e.target.value)}
                type="number"
            />
            <button style={{ zIndex: 1 }} onClick={applyValue}>Click to Change</button>
            <PageCounter value={value} maxValue={99} />
        </div>
    );
};

export default App;
