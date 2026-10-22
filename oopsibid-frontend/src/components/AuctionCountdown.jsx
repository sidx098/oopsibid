import { useEffect, useState } from "react";

function AuctionCountdown({ endTime }) {

    const calculateTime = () => {

        if (!endTime) {
            return 0;
        }

        const difference =
            new Date(endTime).getTime()
            - new Date().getTime();

        return Math.max(0, difference);
    };


    const [remaining, setRemaining] =
        useState(calculateTime());


    useEffect(() => {

        const timer =
            setInterval(() => {

                setRemaining(
                    calculateTime()
                );

            }, 1000);


        return () => {
            clearInterval(timer);
        };

    }, [endTime]);


    if (remaining <= 0) {

        return (
            <strong>
                AUCTION ENDED
            </strong>
        );
    }


    const totalSeconds =
        Math.floor(remaining / 1000);

    const days =
        Math.floor(
            totalSeconds / 86400
        );

    const hours =
        Math.floor(
            (totalSeconds % 86400) / 3600
        );

    const minutes =
        Math.floor(
            (totalSeconds % 3600) / 60
        );

    const seconds =
        totalSeconds % 60;


    return (
        <strong>

            {days > 0 &&
                `${days}d `
            }

            {String(hours).padStart(2, "0")}:

            {String(minutes).padStart(2, "0")}:

            {String(seconds).padStart(2, "0")}

        </strong>
    );
}

export default AuctionCountdown;