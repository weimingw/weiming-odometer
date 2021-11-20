import { useEffect, useRef, useState } from 'react';
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
    const targetRef = useRef(null);

    function getStartPosition() {
        if (direction < 0) { // value is going down, so we need to scroll column upwards
            return currentPosition > -20 // if the column is on the top half, 
                ? currentPosition - 20 // shift the column to bottom half for infinite upward scrolling
                : currentPosition;  // if already on bottom half, don't need to do anything
        } else { // value is going up, so we need to scroll column downwards
            return currentPosition < -20 // if the column is on the bottom half
                ? currentPosition + 20 // shift the column to the top half for infinite upward scrolling
                : currentPosition;  // if already on the top half, don't need to do anything
        }
    }

    function getMovement(startPosition) {
        if (direction < 0) { // value going down, so the y translate must go to a greater value (shift number column down)
            if (-2 * target - 20 > startPosition) {  // if the target number in the bottom half is above the current position 
                return -2 * target - 20 - startPosition; // use the bottom half's number (move to the closer number)
            }
            return -2 * target - startPosition; // otherwise move to the top half's number
        } else { // value going up, so the y translate must go to a lesser value (shift number column up)
            if (-2 * target > startPosition) { // if the target location in the top half is above the current position
                return -2 * target - 20 - startPosition; // use the bottom half's number instead
            }
            return -2 * target - startPosition; // otherwise move to the top half's number
        }
    }

    useEffect(() => {
        targetRef.current = target;
        const startTime = new Date();
        const startPosition = roundNumber(getStartPosition(), 3);
        const movement = getMovement(startPosition);

        function tick() {
            const elapsed = new Date() - startTime;
            const position = easeInOutCubic(
                elapsed,
                startPosition,
                movement,
                DURATION
            );
            setCurrentPosition(position);

            if (elapsed < DURATION && targetRef.current == target) {
                requestAnimationFrame(tick);
            }
        }

        tick();
    }, [direction, target]);

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
                style={{
                    transform: `translateY(${roundNumber(
                        currentPosition,
                        3
                    )}em)`,
                }}
            >
                {renderNumbers()}
            </div>
        </div>
    );
}

function roundNumber(num, digits) {
    const decimal = Math.pow(10, digits);
    return Math.round(num * decimal) / decimal;
}
