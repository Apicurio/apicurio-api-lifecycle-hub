import { FunctionComponent, useEffect, useState } from "react";
import { DateTime } from "luxon";


export type FromNowProps = {
    date: string | Date | undefined;
};


export const FromNow: FunctionComponent<FromNowProps> = (props: FromNowProps) => {
    const [formattedDate, setFormattedDate] = useState<string | null>(null);

    useEffect(() => {
        if (props.date) {
            if (typeof props.date === "string") {
                const luxonDT: DateTime = DateTime.fromISO(props.date as string);
                setFormattedDate(luxonDT.toRelative());
            }
            if (props.date instanceof Date) {
                const luxonDT: DateTime = DateTime.fromJSDate(props.date as Date);
                setFormattedDate(luxonDT.toRelative());
            }
        } else {
            setFormattedDate(null);
        }
    }, [props.date]);

    return (
        <span>{ formattedDate || "" }</span>
    );
};
