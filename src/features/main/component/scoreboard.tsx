import {Chart} from "react-google-charts";
import {useAppSelector} from "../../../app/hooks";
import {useMemo} from "react";

export default function ScoreboardComponent() {

    const assessment = useAppSelector((state) => state.main.assessment);

    const roundOverall = useMemo(() => Math.round(assessment?.overall ?? 0), [assessment]);
    
    return (<table>
        <tbody>
        <tr>
            <td>
                <Chart
                    height={120}
                    chartType="Gauge"
                    loader={<div>Loading Chart</div>}
                    data={[
                        ['Label', 'Value'],
                        ['Overall', roundOverall],
                    ]}
                    options={{
                        redFrom: 90,
                        redTo: 100,
                        yellowFrom: 75,
                        yellowTo: 90,
                        minorTicks: 5,
                    }}
                />
            </td>
            <td style={{textAlign: 'right'}}>
                <p>
                    Speed:<br/>
                    Difficulty:<br/>
                    Accuracy:<br/>
                    <hr/>
                    Overall:<br/>
                </p>
            </td>
            <td>
                <p style={{textAlign: 'right'}}>
                    {Math.round(assessment?.speed ?? 0)}<br/>
                    {Math.round(assessment?.difficulty ?? 0)}<br/>
                    {Math.round(assessment?.accuracy ?? 0)}<br/>
                    <br/>
                    <strong>{roundOverall}</strong>
                </p>
            </td>
        </tr>
        </tbody>
    </table>);
}