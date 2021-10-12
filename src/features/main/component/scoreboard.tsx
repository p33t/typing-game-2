import {Chart} from "react-google-charts";
import {useAppSelector} from "../../../app/hooks";

export default function ScoreboardComponent() {

    const assessment = useAppSelector((state) => state.main.assessment);

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
                        ['Overall', assessment?.overall ?? 0],
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
            <td>
                <p>
                    Speed: {assessment?.speed}<br/>
                    Difficulty: {assessment?.difficulty}<br/>
                    Accuracy: {assessment?.accuracy}<br/>
                    Overall: {assessment?.overall}<br/>
                </p>
            </td>
        </tr>
        </tbody>
    </table>);
}