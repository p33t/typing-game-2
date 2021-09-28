import {KeyDef} from "../model";

interface KeyProps {
    keyDefs: KeyDef[];
}

export default function KeyDefsComponent(props: KeyProps) {

    function calcClassName(keyDef: KeyDef) {
        let className = '';
        if (keyDef.alt) className += ' key-alt';
        if (keyDef.ctrl) className += ' key-ctrl';
        return className;
    }
    
    return (<p>
        {props.keyDefs.map((kc, index) =>
            <span key={index} className={calcClassName(kc)}>{kc.char}</span>)}
    </p>)
}