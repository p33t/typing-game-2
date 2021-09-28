import {useAppDispatch, useAppSelector} from "../../app/hooks";
import {ChangeEventHandler, KeyboardEventHandler} from "react";
import {keyPressed} from "./slice";
import {Timestamper} from "../../common/timing";
import {keySetChanged} from "../config/slice";
import {KeySetName, KeySetNames} from "./model";

export default function MainPage() {

    const config = useAppSelector((state) => state.config);
    const main = useAppSelector((state) => state.main);
    const dispatch = useAppDispatch();
    const timestamper = Timestamper;

    const onKeyPress: KeyboardEventHandler = (evt) => {
        dispatch(keyPressed({
            keyCapture: {
                keyCode: evt.key,
                keyedAt: timestamper()
            },
            keySetName: config.keySetName,
        }));
    };
    
    const onKeySetChange: ChangeEventHandler<HTMLSelectElement> = (evt) => {
        dispatch(keySetChanged(evt.target.value as KeySetName));
    };

    return (<div>
        <p>Main Page: {config.keySetName}</p>
        <select value={config.keySetName} onChange={onKeySetChange}>
            {KeySetNames.map((ksc) => <option key={ksc} value={ksc}>{ksc}</option>)}
        </select>
        <table>
            <tbody>
            <tr>
                <td>
                    {main.keyHistory.map((kc, ix) => <span key={ix}>{kc.keyCode}</span>)}
                </td>
                <td>
                    {main.keyPrompt.map((kp, ix) => <span key={ix}>{kp}</span>)}
                </td>
            </tr>
            <tr>
                <td>
                    -
                </td>
                <td>
                    <input type='text' onKeyPress={onKeyPress} value={main.buffer.map((kc) => kc.keyCode).join()}/>
                </td>
            </tr>
            </tbody>
        </table>
    </div>);
}