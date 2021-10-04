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
    }, []);
    return (<select value={config.keySetName} onChange={onKeySetChange}>
        {KEY_SET_NAMES.map((ksc) => <option key={ksc} value={ksc}>{ksc}</option>)}
    </select>);
}