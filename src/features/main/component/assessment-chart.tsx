import {Chart} from "react-google-charts";
import {useMemo} from "react";
import {useAppSelector} from "../../../app/hooks";

export default function AssessmentChartComponent() {

    const main = useAppSelector((state) => state.main);

    const chartData = useMemo(() => {
        const arrLength = Math.min(main.keyHistory.length, 100) + 1; // will always include starting '0'       
        const arr: number[][] = Array(arrLength);
        let x = 1 - arrLength;
        let ix = 0;
        let ixHistory: number = main.keyHistory.length - arrLength;
        let accum = 0;
        arr[ix] = [x, accum]
        while ( x < 0) {
            accum += main.keyHistory[++ixHistory].assessment?.overall ?? 0;
            arr[++ix] = [++x, accum];
        }
        if (x !== 0) console.log(`final x expected to be 0 but was ${x}`);
        return arr;
    }, [main.keyHistory]);
    
    return (<Chart
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
                minValue: 0,
            },
        }}
        rootProps={{ 'data-testid': '1' }}
    />);    
}