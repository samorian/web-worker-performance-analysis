import React, {useEffect, useState} from 'react';
import {observer} from "mobx-react";
import {DateTime} from "luxon";

const formateDateTime = (dateTime: DateTime): string => {
    return dateTime.toLocaleString({hour: '2-digit', minute: '2-digit', second: '2-digit', fractionalSecondDigits: 3});
}

export const Timer = observer(() => {
    const [clock, setClock] = useState(DateTime.now());

    useEffect(() => {
        const interval = setInterval(() => {
            setClock(DateTime.now());
        }, 50);
        return () => {
            clearInterval(interval);
        };
    },[]);

    return (
        <>
            <h4>Timer aus dem Main Thread</h4>
            <h2>{formateDateTime(clock)}</h2>
        </>
    );
});
