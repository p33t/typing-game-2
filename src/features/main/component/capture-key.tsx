import {KeyCapture} from "../model";
import {KeyboardEventHandler, useMemo} from "react";
import {Timestamper} from "../../../common/timing";
import {defaultRawCharFor, defaultShiftCharFor} from "../../../common/key-key";

interface CaptureKeyProps {
    value: KeyCapture[],
    onCapture(keyCapture: KeyCapture): void,
}

export default function CaptureKeyComponent(props: CaptureKeyProps) {
    const timestamper = Timestamper;

    const defaultValue = useMemo(() => {
       return props.value.map((kc) => {
           let char = kc.char;
           if (kc.shift) {
               // FUTURE: Will allow user to customize for non-US keyboards
               char = defaultShiftCharFor(char);
           }
           return char;
       })
           .join('') 
    }, [props.value]);
    
    const onKeyDown: KeyboardEventHandler = (evt) => {
        if (evt.key === 'Backspace' || evt.key === 'BACKSPACE' || evt.key.trim().length === 1) {
            const char = evt.shiftKey ? defaultRawCharFor(evt.key) : evt.key;
            props.onCapture(
                {
                    char,
                    alt: evt.altKey,
                    control: evt.ctrlKey,
                    shift: evt.shiftKey,
                    keyedAt: timestamper(),
                    difficulty: 0, // TODO: This is smelly
                },
            );
        }
        evt.preventDefault();
    };

    return (<input type='text' onKeyDown={onKeyDown} defaultValue={defaultValue}/>);
}