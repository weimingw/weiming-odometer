import { useState } from 'react';
import PageCounter from './components/PageCounter';

const App = () => {
    const [value, setValue] = useState(0);
    const [counterValue, setCounterValue] = useState(0);

    function applyValue() {
        setCounterValue(value);
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
            <input
                value={value}
                onChange={(e) => setValue(e.target.value)}
                type="number"
            />
            <button onClick={applyValue}>Click to Change</button>
            <PageCounter value={counterValue} />
        </div>
    );
};

export default App;
