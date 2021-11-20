import { useEffect, useState } from 'react';
import { easeInOutCubic } from 'js-easing-functions';
import './PageCounter.scss';
export default function PageCounter(props) {
    const [start, setStart] = useState(1);
    const [target, setTarget] = useState(1);

    useEffect(() => {
        setStart(parseInt(target));
        setTarget(parseInt(props.value));
    }, [props.value]);

    function getDirection() {
        if (target > start) {
            return 1;
        } else if (start > target) {
            return -1;
        } else {
            return 1;
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

const DURATION = 1000;
const NUMS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
function RollingNumber(props) {
    const { direction, target } = props;
    const [currentPosition, setCurrentPosition] = useState(getNewPosition());
    // const [easing, setEasing] = useState(null);

    function getStartPosition() {
        if (direction < 0) {
            return currentPosition > -20
                ? currentPosition - 20
                : currentPosition;
        } else {
            return currentPosition < -20
                ? currentPosition + 20
                : currentPosition;
        }
    }

    function getMovement(startPosition) {
        if (direction < 0) { // value going down
            if (-2 * target - 20 > startPosition) {
                return -2 * target - 20 - startPosition;
            }
            return -2 * target - startPosition;
        } else { // value going up
            if (-2 * target > startPosition) {
                return -2 * target - 20 - startPosition;
            }
            return -2 * target - startPosition;
        }
    }

    useEffect(() => {
        const startTime = new Date();
        const startPosition = roundNumber(getStartPosition(), 3);
        const movement = getMovement(startPosition);

        console.log(startPosition, movement + startPosition);

        function tick() {
            const elapsed = new Date() - startTime;
            const position = easeInOutCubic(
                elapsed,
                startPosition,
                movement,
                DURATION
            );
            setCurrentPosition(position);

            if (elapsed < DURATION) {
                requestAnimationFrame(tick);
            }
        }

        tick();
    }, [target]);

    function renderNumbers() {
        return NUMS.map((n, i) => <span key={i}>{n}</span>);
    }

    function getNewPosition() {
        return target * -2;
    }

    return (
        <div class="rolling-number-window">
            <div class="rolling-number-placeholder"></div>
            <div
                class="rolling-number"
                style={{ transform: `translateY(${roundNumber(currentPosition, 3)}em)` }}
            >
                {renderNumbers()}
            </div>
        </div>
    );
}

function roundNumber(num, digits) {
    const decimal = Math.pow(10, digits)
    return Math.round(num * decimal) / decimal;
}