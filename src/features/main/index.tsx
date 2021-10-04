import {useAppDispatch, useAppSelector} from "../../app/hooks";
import {ChangeEventHandler, useMemo} from "react";
import {backspaced, keyPressed, keySetChanged} from "./slice";
import {KeyCapture} from "./model";
import KeyDefs from "./component/key-defs";
import CaptureKey from "./component/capture-key";
import {KeySetName, KEY_SET_NAMES} from "../../common/key-model";

export default function MainPage() {

    const main = useAppSelector((state) => state.main);
    const dispatch = useAppDispatch();

    const onKeyCapture = (kc: KeyCapture) => {
        if (kc.char.toLowerCase() === 'backspace') { // TODO: toLowerCase() shouldn't be necessary. 'Backspace' instead
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
        return main.keyHistory.slice(start)
    }, [main.keyHistory])

    return (<div>
        <p>Main Page: {main.config.keySetName}</p>
        <select value={main.config.keySetName} onChange={onKeySetChange}>
            {KEY_SET_NAMES.map((ksc) => <option key={ksc} value={ksc}>{ksc}</option>)}
        </select>
        <table className={'center'}>
            <tbody>
            <tr>
                <td>
                    <KeyDefs keyDefs={history.map(ke => ke.prompt)}/>
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