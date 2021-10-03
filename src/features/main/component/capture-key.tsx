import {KeyCapture} from "../model";
import {KeyboardEventHandler, useMemo} from "react";
import {Timestamper} from "../../../common/timing";
import {defaultShiftCharFor} from "../../../common/key-key";

interface CaptureKeyProps {
    value: KeyCapture[],
    onCapture(keyCapture: KeyCapture): void,
}

export default function CaptureKeyComponent(props: CaptureKeyProps) {
    const timestamper = Timestamper;

    const defaultValue = useMemo(() => {
       return props.value.map((kc) => {
           let char = kc.keyDef.char;
           if (kc.keyDef.shift) {
               // FUTURE: Will allow user to customize for non-US keyboards
               char = defaultShiftCharFor(char);
           }
           return char;
       })
           .join('') 
    }, [props.value]);
    
    const onKeyDown: KeyboardEventHandler = (evt) => {
        if (evt.key === 'Backspace' || evt.key.trim().length === 1) {
            props.onCapture(
                {
                    keyDef: {
                        char: evt.key,
                        alt: evt.altKey,
                        control: evt.ctrlKey,
                        shift: evt.shiftKey,
                    },
                    keyedAt: timestamper()
                },
            );
        }
        evt.preventDefault();
    };

    return (<input type='text' onKeyDown={onKeyDown} defaultValue={defaultValue}/>);
}