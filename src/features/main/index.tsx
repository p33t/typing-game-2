import {useAppDispatch, useAppSelector} from "../../app/hooks";
import {ChangeEventHandler, useMemo} from "react";
import {backspaced, keyPressed, keySetChanged} from "./slice";
import {KeyCapture, KeySetName, KeySetNames} from "./model";
import KeyDefs from "./component/key-defs";
import CaptureKey from "./component/capture-key";

export default function MainPage() {

    const main = useAppSelector((state) => state.main);
    const dispatch = useAppDispatch();

    const onKeyCapture = (kc: KeyCapture) => {
        if (kc.keyDef.char === 'Backspace') {
            dispatch(backspaced());
        } else {
            dispatch(keyPressed({keyCapture: kc}));
        }
    };

    const onKeySetChange: ChangeEventHandler<HTMLSelectElement> = (evt) => {
        dispatch(keySetChanged(evt.target.value as KeySetName));
    };

    const history = useMemo(() => {
        const historyLength = main.keyHistory.length;
        const start = Math.max(0, historyLength - 6);
        return main.keyHistory.slice(start).map((kc) => kc.keyDef)
    }, [main.keyHistory])

    return (<div>
        <p>Main Page: {main.config.keySetName}</p>
        <select value={main.config.keySetName} onChange={onKeySetChange}>
            {KeySetNames.map((ksc) => <option key={ksc} value={ksc}>{ksc}</option>)}
        </select>
        <table className={'center'}>
            <tbody>
            <tr>
                <td>
                    <KeyDefs keyDefs={history}/>
                </td>
                <td>
                    <KeyDefs keyDefs={main.keyPrompt}/>
                </td>
            </tr>
            <tr>
                <td>
                    <KeyDefs keyDefs={history}/>
                </td>
                <td>
                    <CaptureKey
                        onCapture={onKeyCapture}
                        value={main.buffer}/>
                </td>
            </tr>
            </tbody>
        </table>
    </div>);
}