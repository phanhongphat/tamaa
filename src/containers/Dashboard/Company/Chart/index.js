import React, { PureComponent, Fragment } from 'react';
import injectSheet from 'react-jss';
import { Line } from 'react-chartjs-2';
import { Card, Typography } from 'antd';
const { Title } = Typography;
import numberWithSpaces from 'src/utils';

import styles from './styles';

@injectSheet(styles)
export default class CharCompany extends PureComponent {
	convertDataForChart = data => {
		let outPut = {
			labels: [],
			datasets: [
				{
					label: 'Credits',
					fill: false,
					lineTension: 0.1,
					backgroundColor: '#534582',
					borderColor: '#534582',
					borderCapStyle: 'butt',
					borderDash: [],
					borderDashOffset: 0.0,
					borderJoinStyle: 'miter',
					pointBorderColor: 'rgba(75,192,192,1)',
					pointBackgroundColor: '#fff',
					pointBorderWidth: 1,
					pointHoverRadius: 5,
					pointHoverBackgroundColor: 'rgba(75,192,192,1)',
					pointHoverBorderColor: 'rgba(220,220,220,1)',
					pointHoverBorderWidth: 2,
					pointRadius: 1,
					pointHitRadius: 10,
					data: []
				}
			]
		};

		// if (data.length > 0) {
		Object.keys(data)
			.reverse()
			.map((key, index) => {
				outPut.labels.push(key);

				if (data[key][0]) {
					outPut.datasets[0].data.push(parseInt(data[key][0].transaction_amount, 10));
				} else {
					outPut.datasets[0].data.push(parseInt(0, 10));
				}
			});
		// }

		return outPut;
	};

	render() {
		const { classes, data } = this.props;
		const dataChart = this.convertDataForChart(data);

		const options = {
			scales: {
				yAxes: [
					{
						ticks: {
							callback(value) {
								// you can add your own method here (just an example)
								// return Number(value).toLocaleString('en');
								return numberWithSpaces(value);
							}
						}
					}
				]
			},
			tooltips: {
				callbacks: {
					label: function(tooltipItem, data) {
						var label = data.datasets[tooltipItem.datasetIndex].label || '';
						if (label) {
							label += ': ';
						}
						// label += Number(tooltipItem.yLabel).toLocaleString('en');
						label += numberWithSpaces(tooltipItem.yLabel);
						return label;
					}
				}
			}
		};

		return (
			<Card bordered={false}>
				<Title type="secondary" level={4}>
					Credits
				</Title>
				<Line data={dataChart} options={options} />
			</Card>
		);
	}
}
