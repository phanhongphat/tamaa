import React, { PureComponent, Fragment } from 'react';
import injectSheet from 'react-jss';
import { Bar } from 'react-chartjs-2';
import { Card, Spin } from 'antd';
import { FormattedMessage } from 'react-intl';
import numberWithSpaces from 'src/utils';

import styles from './styles';

const data = {
	labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
	datasets: [
		{
			label: 'My First dataset',
			backgroundColor: 'rgba(255,99,132,0.2)',
			borderColor: 'rgba(255,99,132,1)',
			borderWidth: 1,
			hoverBackgroundColor: 'rgba(255,99,132,0.4)',
			hoverBorderColor: 'rgba(255,99,132,1)',
			data: [65, 59, 80, 81, 56, 55, 40]
		}
	]
};

import { getTopAffectCompany } from 'src/redux/actions/dashborad.js';

//redux
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

function mapStateToProps(state) {
	return {
		store: {
			affectCompany: state.dashboard.affectCompany
		}
	};
}

const mapDispatchToProps = dispatch => {
	return {
		action: bindActionCreators(
			{
				// getListCreditDetails
				getTopAffectCompany
			},
			dispatch
		)
	};
};

@injectSheet(styles)
@connect(
	mapStateToProps,
	mapDispatchToProps
)
export default class CharCompany extends PureComponent {
	state = {
		loading: true
	};

	filter = {
		limit: 1,
		month: 8,
		year: 2019
	};

	componentDidMount() {
		const filter = this.filter;
		this.handelGetTopAffectCompany(filter);
	}

	handelGetTopAffectCompany = filter => {
		const payload = {
			pramas: filter
		};
		this.setState({ loading: true });
		this.props.action.getTopAffectCompany(
			payload,
			() => {
				this.setState({ loading: false });
			},
			() => {
				this.setState({ loading: false });
			}
		);
	};

	convertDataForChart = data => {
		let outPut = {
			labels: [],
			datasets: [
				{
					label: 'Company',
					backgroundColor: '#00C68E',
					borderColor: '#00C68E',
					borderWidth: 1,
					hoverBackgroundColor: '#00C68E',
					hoverBorderColor: '#00C68E',
					data: []
				}
			]
		};
		if (data.length > 0) {
			data.map(e => {
				if (typeof e.name === 'string' && e.name.length > 12) {
					outPut.labels.push(`${e.name.slice(0, 15)}...`);
				} else {
					outPut.labels.push(e.name);
				}
				// outPut.labels.push(e.name);
				outPut.datasets[0].label = `${e.month}/${e.year}`;
				outPut.datasets[0].data.push(parseInt(e.sum_amount, 10));
			});
		}

		return outPut;
	};

	render() {
		const {
			classes,
			store: {
				affectCompany: { data = [] }
			}
		} = this.props;

		const { loading } = this.state;

		const dataChart = this.convertDataForChart(data);

		const options = {
			scales: {
				yAxes: [
					{
						ticks: {
							callback(value) {
								// you can add your own method here (just an example)
								// return Number(value).toLocaleString('en-US');
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
			<Spin spinning={loading}>
				<Card
					title={
						<FormattedMessage
							id="dashboard.title.company"
							defaultMessage="Top 5 des transferts de crédit"
						/>
					}
					bordered={false}>
					<Bar
						data={dataChart}
						width={100}
						height={250}
						options={{
							...options,
							maintainAspectRatio: false
						}}
					/>
				</Card>
			</Spin>
		);
	}
}
