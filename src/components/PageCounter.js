import { useEffect, useState } from 'react';
import './PageCounter.scss';
export default function PageCounter(props) {
    const [start, setStart] = useState(1);
    const [target, setTarget] = useState(1);
    const [moving, setMoving] = useState(false);

    useEffect(() => {
        if (!moving) {
            setStart(target);
            setMoving(true);
        }
        setTarget(props.value);
    }, [props.value]);

    function getDirection() {
        if (moving) {
            if (target > start) {
                return 1;
            } else if (start > target) {
                return -1;
            } else {
                return 0;
            }
        }
    }

    return (
        <div className="page-counter">
            <div className="page-counter-numerator">
                <RollingNumber
                    direction={getDirection()}
                    target={Math.floor(target / 10)}
                />
                <RollingNumber
                    direction={getDirection()}
                    target={target % 10}
                />
            </div>
        </div>
    );
}

const NUMS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
function RollingNumber(props) {
    const { direction, target } = props;

    function renderNumbers() {
        return NUMS.map((n, i) => <span key={i}>{n}</span>);
    }

    function getNewPosition() {
        if (direction > 0) {
            return `${target * -2}em`;
        } else {
            return `${target * 2}em`;
        }
    }

    return (
        <div class="rolling-number-window">
            <div class="rolling-number-placeholder"></div>
            <div class="rolling-number" style={{ transform: `translateY(${getNewPosition()})` }}>{renderNumbers()}</div>
            <div style={{ transform: 'translateX(20em)' }}>{target}</div>
        </div>
    );
}
