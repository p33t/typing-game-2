import {KeyDef} from "../../../common/key-model";
import {defaultShiftCharFor} from "../../../common/key-key";

interface KeyProps {
    keyDefs: KeyDef[];
}

export default function KeyDefsComponent(props: KeyProps) {

    function calcClassName(keyDef: KeyDef) {
        let className = '';
        if (keyDef.alt) className += ' key-alt';
        if (keyDef.control) className += ' key-ctrl';
        return className;
    }
    
    return (<p>
        {props.keyDefs.map((kd, index) => {
            const char = kd.shift ? defaultShiftCharFor(kd.char) : kd.char;
            return <span key={index} className={calcClassName(kd)}>{char}</span>;
        })}
    </p>)
}