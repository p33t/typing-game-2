import {useAppDispatch, useAppSelector} from "../../../app/hooks";
import {ChangeEventHandler, useCallback} from "react";
import {AppConfig} from "../model";
import {configChanged} from "../slice";
import {KeySetName, KEY_SET_NAMES} from "../../../common/key-model";

export default function MainConfigComponent() {
    const config = useAppSelector((state) => state.main.config);
    const dispatch = useAppDispatch();

    const onKeySetChange: ChangeEventHandler<HTMLSelectElement> = useCallback((evt) => {
        const keySetName = evt.target.value as KeySetName;
        const newConfig = {
            ...config,
            keySetName,
        } as AppConfig;
        dispatch(configChanged(newConfig));
    }, [config]);
    
    const onToggleModifier: ChangeEventHandler<HTMLInputElement> = useCallback((evt) => {
        const enabled = evt.target.checked;
        const propName = evt.target.value;
        const newConfig = {
            ...config,
            [propName]: enabled,
        } as AppConfig;
        dispatch(configChanged(newConfig));
    }, [config]);
    
    return (<>
        <label>Key Set: </label>
        <select value={config.keySetName} onChange={onKeySetChange}>
            {KEY_SET_NAMES.map((ksc) => <option key={ksc} value={ksc}>{ksc}</option>)}
        </select>
        &nbsp;
        {/* NOTE: Control modifier is too dangerous ATM.  Ctrl-Q closes browser, Ctrl-N opens new window etc. */}
        <label>Modifier Keys: </label>
        <input type="checkbox" value="shiftEnabled" onChange={onToggleModifier} checked={config.shiftEnabled}/> 
        <label>Shift</label>
        &nbsp;
        <input type="checkbox" value="altEnabled" onChange={onToggleModifier} checked={config.altEnabled}/> 
        <label>Alt</label>
    </>);
}