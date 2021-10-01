import {KeyCapture} from "../model";
import {KeyboardEventHandler} from "react";
import {Timestamper} from "../../../common/timing";

interface CaptureKeyProps {
    value: string, // TODO: Change to KeyCapture[]?
    onCapture(keyCapture: KeyCapture): void,
}

export default function CaptureKeyComponent(props: CaptureKeyProps) {
    const timestamper = Timestamper;

    const onKeyDown: KeyboardEventHandler = (evt) => {
        if (evt.key === 'Backspace' || evt.key.trim().length === 1) {
            props.onCapture(
                {
                    keyDef: {
                        char: evt.key,
                        alt: evt.altKey,
                        ctrl: evt.ctrlKey,
                        shift: evt.shiftKey,
                    },
                    keyedAt: timestamper()
                },
            );
        }
        evt.preventDefault();
    };

    return (<input type='text' onKeyDown={onKeyDown} value={props.value}/>);
}