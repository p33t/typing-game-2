import {Chart} from "react-google-charts";
import {useMemo} from "react";
import {useAppDispatch, useAppSelector} from "../../../app/hooks";
import {Button, Grid, Popup} from "semantic-ui-react";
import {resetChallenge} from "../slice";

export default function AssessmentChartComponent() {
    const dispatch = useAppDispatch();

    const keyHistory = useAppSelector((state) => state.main.keyHistory);

    const chartData = useMemo(() => {
        const arrLength = Math.min(keyHistory.length, 100) + 1; // will always include starting '0'       
        const arr: number[][] = Array(arrLength);
        let x = 1 - arrLength;
        let ix = 0;
        let ixHistory: number = keyHistory.length - arrLength;
        let accum = 0;
        arr[ix] = [x, accum]
        while (x < 0) {
            accum += keyHistory[++ixHistory].assessment?.overall ?? 0;
            arr[++ix] = [++x, accum];
        }
        if (x !== 0) console.log(`final x expected to be 0 but was ${x}`);
        return arr;
    }, [keyHistory]);

    function reset() {
        dispatch(resetChallenge());
    }

    const resetButton = <Button onClick={reset}>Reset</Button>;
    return (<Grid>
        <Grid.Column width={12}>
            <Chart
                height={'400px'}
                chartType="LineChart"
                loader={<div>Loading Chart</div>}
                data={[
                    ['x', 'You'],
                    ...chartData,
                ]}
                options={{
                    hAxis: {
                        title: 'Latest Keystrokes',
                        minValue: -100,
                        maxValue: 0,
                    },
                    vAxis: {
                        title: 'Cumulative Score',
                        maxValue: 10000,
                        minValue: 0,
                    },
                    legend: 'none',
                }}
            />
        </Grid.Column>
        <Grid.Column width={4}>
            <table width='100%'>
                <tr style={{textAlign: 'right'}}>
                    <td>
                        <p>
                            Count:<br/>
                            Total:<br/>
                        </p>
                    </td>
                    <td>
                        <p>
                            {chartData.length - 1}<br/>
                            {Math.round(chartData[chartData.length - 1][1])}<br/>
                        </p>
                    </td>
                    <td>
                        <Popup
                            inverted
                            content='Start a new challenge'
                            position='bottom center'
                            open={chartData.length > 100}
                            trigger={resetButton}/>
                    </td>
                </tr>
            </table>
        </Grid.Column>
    </Grid>);
}