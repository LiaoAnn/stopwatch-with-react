import styled from "@emotion/styled/macro";
import { useEffect, useRef, useState } from "react";
import background from "./logo.svg";

const ticksToString = (ticks) => {
    let seconds = Math.floor(ticks / 1000);
    let mins = Math.floor(seconds / 60);
    ticks = Math.floor(ticks / 10) % 100;
    seconds %= 60;
    return `${mins.toString().padStart(2, '0')} : ${seconds.toString().padStart(2, '0')} : ${ticks.toString().padStart(2, '0')}`;
}

const Stopwatch = styled.div`
    height: 75vh;
    width: 75vw;
    position: relative;
    border-radius: 1em;
    overflow: hidden;
    box-shadow: 0 0 .5em #222;
`

const BlurBackground = styled.div`
    background-image: url(${background});
    background-size: cover;
    background-position: center;
    filter: blur(.5em) brightness(.4);
    height: 100%;
    width: 100%;
`

const Container = styled.div`
    position: absolute;
    top: 0;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: .5em;
`

const Timer = styled.div`
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
    background-color: transparent;
    transition: .4s;
    border: 2px solid var(--color);
    border-radius: 1em;

    &:hover:not(:disabled) {
        color: var(--back);
        background-color: var(--color);
    }

    &:disabled {
        border-color: var(--back);
        color: var(--back);
        cursor: auto;
    }
`


const LapsItem = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    text-align: center;
    justify-content: space-around;
    padding: .5em;
    border-radius: 1em;
    transition: .4s;
    user-select: none;
`

const LapsList = styled.div`
    display: flex;
    flex-direction: column-reverse;
    gap: .5em;
    overflow: auto;

    ${LapsItem} {
        background-color: rgba(0, 0, 0, .1);
        grid-template-columns: 1fr 2fr 2fr;
    }

    ${LapsItem}:hover {
        background-color: rgba(0, 0, 0, .3);
    }
`

const StopWatch = () => {
    const [curr, setCurr] = useState(0);
    const [timing, setTiming] = useState(false);
    const [laps, setLaps] = useState([]);
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
        setLaps(() => []);
        setTiming(() => false);
    }

    const recordLap = () => {
        setLaps(prevState => [...prevState, curr]);
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

    useEffect(() => {
        console.log(laps);
    }, [laps])

    return (
        <Stopwatch>
            <BlurBackground />
            <Container>
                <Timer>
                    <Time>
                        {ticksToString(curr)}
                    </Time>
                    <ButtonGroup>
                        <Button onClick={stopOrStartHandler}>{timing ? "Stop" : "Start"}</Button>
                        <Button onClick={clearTimeHandler}>Clear</Button>
                        <Button disabled={!timing} onClick={recordLap}>Lap</Button>
                    </ButtonGroup>
                </Timer>
                <LapsItem>
                    <h4>Lap</h4>
                    <h4>Cost</h4>
                    <h4>Time</h4>
                </LapsItem>
                <LapsList>
                    {laps.map((x, index) => (
                        <LapsItem key={index}>
                            <div>{index + 1}</div>
                            <div>{ticksToString(x - (laps[index - 1] || 0))}</div>
                            <div>{ticksToString(x)}</div>
                        </LapsItem>
                    ))}
                </LapsList>
            </Container>
        </Stopwatch>
    )
}

export default StopWatch;