import {useAppDispatch, useAppSelector} from "../../app/hooks";
import {ChangeEventHandler, KeyboardEventHandler} from "react";
import {keyPressed, keySetChanged} from "./slice";
import {Timestamper} from "../../common/timing";
import {KeySetName, KeySetNames} from "./model";
import KeyDefs from "./component/key-defs";

export default function MainPage() {

    const main = useAppSelector((state) => state.main);
    const dispatch = useAppDispatch();
    const timestamper = Timestamper;

    const onKeyPress: KeyboardEventHandler = (evt) => {
        dispatch(keyPressed({
            keyCapture: {
                keyDef: {
                    char: evt.key,
                    alt: false,
                    ctrl: false,
                },
                keyedAt: timestamper()
            },
        }));
    };
    
    const onKeySetChange: ChangeEventHandler<HTMLSelectElement> = (evt) => {
        dispatch(keySetChanged(evt.target.value as KeySetName));
    };

    return (<div>
        <p>Main Page: {main.config.keySetName}</p>
        <select value={main.config.keySetName} onChange={onKeySetChange}>
            {KeySetNames.map((ksc) => <option key={ksc} value={ksc}>{ksc}</option>)}
        </select>
        <table>
            <tbody>
            <tr>
                <td>
                    <KeyDefs keyDefs={main.keyHistory.map((kc) => kc.keyDef)}/>
                </td>
                <td>
                    <KeyDefs keyDefs={main.keyPrompt}/>
                </td>
            </tr>
            <tr>
                <td>
                    -
                </td>
                <td>
                    <input type='text' onKeyPress={onKeyPress} value={main.buffer.map((kc) => kc.keyDef.char).join()}/>
                </td>
            </tr>
            </tbody>
        </table>
    </div>);
}