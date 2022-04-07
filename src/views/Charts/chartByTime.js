import {useEffect, useRef, useState} from "react";
import styled from "styled-components";
import {Chart} from "react-chartjs-2";
import {Layout} from "antd";

const { Content } = Layout;

const options = {
    responsive: true,
    plugins: {
        legend: {
            position: 'bottom',
        },
    },
    scales: {
        x: {
            title: {
                display: true,
                text: 'Fecha'
            }
        },
        y: {
            title: {
                display: true,
                text: 'Concentración [µg/mˆ3]'
            }
        }
    }
};

// const data = {
//     labels: ['2022-03-24', '2022-03-25', '2022-03-26', '2022-03-27', '2022-03-28', '2022-03-29', '2022-03-30'],
//     datasets: [
//         {
//             label: 'Quintero - MP10',
//             data: [1.1, 11.5, 3.1, 4.1, 5.1, 6.1, 7.1],
//             borderColor: "#3F7CAC"
//         },
//         {
//             label: 'Quintero - MP25',
//             data: [7, 6, 5, 4, 3, 2, 1],
//             borderColor: "#95AFBA"
//         },
//         {
//             label: 'Puchuncaví - MP10',
//             data: [1, 3, 5, 7, 9, 11, 13],
//             borderColor: "#BDC4A7"
//         },
//         {
//             label: 'Puchuncaví - MP25',
//             data: [13, 11, 9, 7, 5, 3, 1],
//             borderColor: "#D5E1A3"
//         },
//     ],
// }

export const ChartByTime = ({stations, pollutants, principalTitle, secondaryTitle, daysQueryBy}) => {

    const [ data, setData ] = useState(null);
    const chartRef = useRef(null);

    useEffect(() => {
        console.log('xd')
    })

    return <>
        <StyledContent>
            <h1>{principalTitle}</h1>
            <h2>{secondaryTitle}</h2>
            {/*<StyledChart ref={chartRef} type='line' data={data} options={options}/>*/}
        </StyledContent>
    </>
}

const StyledChart = styled(Chart)`
  align-self: center;
  max-width: 90%;
  padding-left: 5%;
`

const StyledContent = styled(Content)`
  padding-top: 3vh;
  text-align: center;

  h1 {
    font-size: 36px;
  }
`
