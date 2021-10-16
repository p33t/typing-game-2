import {KeyDef} from "../../../common/key-model";
import {defaultShiftCharFor} from "../../../common/key-key";

interface KeyProps {
    keyDefs: KeyDef[];
    isCorrectFn?: (index: number) => boolean;
}

export default function KeyDefsComponent(props: KeyProps) {

    function isCorrect(index: number) {
        if (props.isCorrectFn === undefined) return true;
        return props.isCorrectFn(index);
    }
    
    function calcClassName(keyDef: KeyDef, index: number) {
        let className = '';
        if (keyDef.alt) className += ' key-alt';
        if (keyDef.control) className += ' key-ctrl';
        if (!isCorrect(index)) className += ' key-error';
        return className;
    }
    
    return (<p className="main-table">
        {props.keyDefs.map((kd, index) => {
            const char = kd.shift ? defaultShiftCharFor(kd.char) : kd.char;
            return <span key={index} className={calcClassName(kd, index)}>{char}</span>;
        })}
    </p>)
}