import {useAppDispatch, useAppSelector} from "../../app/hooks";
import {backspaced, keyPressed} from "./slice";
import {KeyCapture} from "./model";
import KeyDefs from "./component/key-defs";
import CaptureKey from "./component/capture-key";
import React, {useCallback, useMemo} from "react";
import {Grid, Popup} from "semantic-ui-react";
import {isKeyDefMatch} from "./assessment";

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

    const history = useMemo(() => {
        const historyLength = main.keyHistory.length;
        const start = Math.max(0, historyLength - 6);
        return main.keyHistory.slice(start)
    }, [main.keyHistory])

    const isCorrect = useCallback((index: number) => {
        const ke = history[index];
        return isKeyDefMatch(ke, ke.prompt);
    }, [main.keyHistory]);

    return (<Grid>
        <Grid.Column width={8} id='main-left-col'>
            <div style={{textAlign: 'right'}}>
                <KeyDefs keyDefs={history.map(ke => ke.prompt)}/>
                <KeyDefs keyDefs={history} isCorrectFn={isCorrect}/>
            </div>
        </Grid.Column>
        <Grid.Column width={6} id='main-right-col'>
            <div className='borders'>
                <KeyDefs keyDefs={main.keyPrompt}/>
            </div>
            <Popup
                inverted
                content='Type the letters above in here'
                position='left center'
                open={main.touched === false}
                trigger={<CaptureKey
                    onCapture={onKeyCapture}
                    value={main.buffer}
                    selectAll={main.config.errorHandlingMode === "Ignore"}/>}/>
        </Grid.Column>
    </Grid>);
}