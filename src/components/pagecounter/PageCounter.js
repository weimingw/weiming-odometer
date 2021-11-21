import './PageCounter.scss';
import Odometer from '../odometer/Odometer';
export default function PageCounter(props) {
    const { value, maxValue = 0 } = props;

    return (
        <div className="page-counter">
            <Odometer value={value} maxValue={maxValue} />
            <div className='page-counter-denominator'>/ {maxValue}</div>
        </div>
    );
}
