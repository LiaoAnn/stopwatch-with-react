import styled from "@emotion/styled";
import { useEffect, useRef, useState } from "react";

const ticksToString = (ticks) => {
    let seconds = Math.floor(ticks / 1000);
    let mins = Math.floor(seconds / 60);
    ticks = Math.floor(ticks / 10) % 100;
    seconds %= 60;
    return `${mins.toString().padStart(2, '0')} : ${seconds.toString().padStart(2, '0')} : ${ticks.toString().padStart(2, '0')}`;
}

const Timer = styled.div`
    border-radius: 1em;
    margin: 2em auto;
    padding: 1em;
    /* background-color: rgba(0, 0, 0, .5); */
`

const Time = styled.h1`
    text-align: center;
    margin: .5em;
    color: #61DAFB;
`

const ButtonGroup = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
    gap: 1em;
`

const Button = styled.button`
    --color: #61DAFB;
    --back: #282C34;

    cursor: pointer;
    font-size: 1em;
    padding: .5em 1em;
    color: var(--color);
    background-color: var(--back);
    transition: .2s;
    border: 2px solid var(--color);
    border-radius: 1em;

    &:hover {
        color: var(--back);
        background-color: var(--color);
    }

`

const StopWatch = () => {
    const [curr, setCurr] = useState(0);
    const [timing, setTiming] = useState(false);
    const last = useRef(new Date().getTime());
    const interval = useRef(0);

    const stopOrStartHandler = () => {
        if (!timing) {
            last.current = new Date().getTime();
        }
        setTiming(prev => !prev);
    }

    const clearTimeHandler = () => {
        setCurr(() => 0);
        setTiming(() => false);
    }

    useEffect(() => {
        if (!timing) {
            clearInterval(interval.current);
            return;
        }
        interval.current = setInterval(() => {
            let now = new Date().getTime();
            let diff = now - last.current;
            last.current = now;
            setCurr(prev => prev + diff);
        }, 16)
    }, [timing])

    return (
        <>
            {timing}
            <Timer>
                <Time>
                    {ticksToString(curr)}
                </Time>
                <ButtonGroup>
                    <Button onClick={stopOrStartHandler}>{timing ? "Stop" : "Start"}</Button>
                    <Button onClick={clearTimeHandler}>Clear</Button>
                </ButtonGroup>
            </Timer>
        </>
    )
}

export default StopWatch;