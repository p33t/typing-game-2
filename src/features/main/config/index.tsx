import {useAppDispatch, useAppSelector} from "../../../app/hooks";
import {ChangeEventHandler, useCallback} from "react";
import {AppConfig} from "../model";
import {configChanged} from "../slice";
import {KeySetName, KEY_SET_NAMES} from "../../../common/key-model";
import {PERFECT} from "../assessment";

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
    
    const onDifficultyChange: ChangeEventHandler<HTMLInputElement> = useCallback((evt) => {
        const newConfig = {
            ...config,
            difficultyTarget: Number(evt.target.value),
        } as AppConfig;
        dispatch(configChanged(newConfig));
    }, [config]);
    
    const onAutoDifficultyChange: ChangeEventHandler<HTMLInputElement> = useCallback((evt) => {
        const newConfig = {
            ...config,
            difficultyAutoAdjust: evt.target.checked,
        } as AppConfig;
        dispatch(configChanged(newConfig));
    }, [config]);
    
    return (<>
        <label>Key Set: </label>
        <select value={config.keySetName} onChange={onKeySetChange}>
            {KEY_SET_NAMES.map((ksc) => <option key={ksc} value={ksc}>{ksc}</option>)}
        </select>
        <br/>
        {/* NOTE: Control modifier is too dangerous ATM.  Ctrl-Q closes browser, Ctrl-N opens new window etc. */}
        <label>Modifier Keys: </label>
        <input type="checkbox" value="shiftEnabled" onChange={onToggleModifier} checked={config.shiftEnabled}/> 
        <label>Shift</label>
        &nbsp;&nbsp;&nbsp;
        <input type="checkbox" value="altEnabled" onChange={onToggleModifier} checked={config.altEnabled}/> 
        <label>Alt</label>
        <br/>
        <label>Target Difficulty: </label>
        <input type='range'
               value={config.difficultyTarget}
               min='0'
               max={PERFECT.toString()}
               onChange={onDifficultyChange}/>
        <input type="checkbox" onChange={onAutoDifficultyChange} checked={config.difficultyAutoAdjust}/>
        <label>Auto</label>
    </>);
}