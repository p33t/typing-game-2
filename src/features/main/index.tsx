import {useAppDispatch, useAppSelector} from "../../app/hooks";
import {ChangeEventHandler, KeyboardEventHandler, useMemo} from "react";
import {backspaced, keyPressed, keySetChanged} from "./slice";
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
                    alt: evt.altKey,
                    ctrl: evt.ctrlKey,
                },
                keyedAt: timestamper()
            },
        }));
        evt.preventDefault();
    };
    
    const onKeyDown: KeyboardEventHandler = (evt) => {
        if (evt.key === 'Backspace') {
            dispatch(backspaced());
            evt.preventDefault();
        }
    };
    
    const onKeySetChange: ChangeEventHandler<HTMLSelectElement> = (evt) => {
        dispatch(keySetChanged(evt.target.value as KeySetName));
    };

    const history = useMemo(() => {
        const historyLength = main.keyHistory.length;
        const start = Math.max(0, historyLength - 6);
        // let start = 0;
        // if (historyLength > 5) {
        //     start = historyLength - 6;
        // }
        return main.keyHistory.slice(start).map((kc) => kc.keyDef)
    }, [main.keyHistory])
    
    return (<div>
        <p>Main Page: {main.config.keySetName}</p>
        <select value={main.config.keySetName} onChange={onKeySetChange}>
            {KeySetNames.map((ksc) => <option key={ksc} value={ksc}>{ksc}</option>)}
        </select>
        <table>
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
                    {/* TODO: Not capturing ctrl+ key strokes */}
                    <input
                        type='text'
                        readOnly
                        onKeyPress={onKeyPress}
                        onKeyDown={onKeyDown}
                        value={main.buffer.map((kc) => kc.keyDef.char).join('')}
                    />
                </td>
            </tr>
            </tbody>
        </table>
    </div>);
}