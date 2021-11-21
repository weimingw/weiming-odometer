import { useEffect, useRef, useState } from 'react';
import { easeInOutCubic } from 'js-easing-functions';

import './Odometer.scss';

/**
 * @param {Number} props.value value to display in the odometer
 * @param {Number} props.maxValue max value that can be displayed in the odometer
 * @returns
 */
export default function Odometer(props) {
    const { value = 0, maxValue = 0 } = props;

    const [start, setStart] = useState(1);
    const [target, setTarget] = useState(1);

    useEffect(() => {
        setStart(parseInt(target));
        setTarget(Math.max(0, Math.min(parseInt(value), maxValue)));
    }, [value, maxValue]);

    function getDirection() {
        if (target > start) {
            return 1;
        } else if (start > target) {
            return -1;
        } else {
            return 1;
        }
    }

    function renderNumbers() {
        const direction = getDirection();
        const numString = parseInt(maxValue).toString(); // trims, gets a magnitude of 10
        const targetString = parseInt(target)
            .toString()
            .padStart(numString.length, '0');
        return numString.split('').map((c, i) => { // make a RollingNumber for each significant digit
            const targetDigit = targetString[i] || 0;
            return (
                <RollingNumber
                    key={i}
                    direction={direction}
                    target={parseInt(targetDigit)}
                />
            );
        });
    }

    return <div className="odometer">{renderNumbers()}</div>;
}

const DURATION = 1000;
const NUMS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

/**
 * Component for a number that rolls up and down
 * @param {Number} props.direction 1 if the number is increasing, -1 if the number is decreasing
 * @param {Number} props.target the number that the component should display in the window after it is done animating
 * @returns 
 */
function RollingNumber(props) {
    const { direction, target } = props;
    const [currentPosition, setCurrentPosition] = useState(getNewPosition());
    /* 
        requestAnimationFrame has weird race conditions with useEffect, 
        so if there is an obsolete target (e.g. if `target` was changed quickly while an animation was already going on)
        cancelAnimationFrame might not be able to break the existing animation loop short
        Checking targetRef.current before recursively calling tick is the alternative way to break the loop
    */
    const targetRef = useRef(null);

    function getStartPosition() {
        if (direction < 0) {
            // value is going down, so we need to scroll column upwards
            return currentPosition > -20 // if the column is on the top half,
                ? currentPosition - 20 // shift the column to bottom half for infinite upward scrolling
                : currentPosition; // if already on bottom half, don't need to do anything
        } else {
            // value is going up, so we need to scroll column downwards
            return currentPosition < -20 // if the column is on the bottom half
                ? currentPosition + 20 // shift the column to the top half for infinite upward scrolling
                : currentPosition; // if already on the top half, don't need to do anything
        }
    }

    function getOffset(startPosition) {
        const newPosition = getNewPosition();
        if (direction < 0) {
            // value going down, so the y translate must go to a greater value (shift number column down)
            if (newPosition - 20 >= startPosition) {
                // if the target number in the bottom half is above the current position
                return newPosition - 20 - startPosition; // use the bottom half's number (move to the closer number)
            }
            return newPosition - startPosition; // otherwise move to the top half's number
        } else {
            // value going up, so the y translate must go to a lesser value (shift number column up)
            if (newPosition > startPosition) {
                // if the target location in the top half is above the current position
                return newPosition - 20 - startPosition; // use the bottom half's number instead
            }
            return newPosition - startPosition; // otherwise move to the top half's number
        }
    }

    useEffect(() => {
        targetRef.current = target;
        const startTime = new Date();
        const startPosition = roundNumber(getStartPosition(), 3);
        const offset = getOffset(startPosition);

        function tick() {
            const elapsed = new Date() - startTime;
            const position = easeInOutCubic(
                elapsed,
                startPosition,
                offset,
                DURATION
            );
            setCurrentPosition(roundNumber(position, 3));

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
                    transform: `translateY(${currentPosition}em)`,
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
