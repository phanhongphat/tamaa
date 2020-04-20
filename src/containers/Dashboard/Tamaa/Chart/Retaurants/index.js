import React, { PureComponent } from 'react';
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

import { getTopIncomeRestaurant } from 'src/redux/actions/dashborad';

//redux
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

function mapStateToProps(state) {
	return {
		store: {
			incomeRestaurant: state.dashboard.incomeRestaurant
		}
	};
}

const mapDispatchToProps = dispatch => {
	return {
		action: bindActionCreators(
			{
				// getListCreditDetails
				getTopIncomeRestaurant
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
export default class CharRetaurant extends PureComponent {
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
		this.props.action.getTopIncomeRestaurant(
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
					label: 'Restaurant',
					backgroundColor: '#FF9E0D',
					borderColor: '#FF9E0D',
					borderWidth: 1,
					hoverBackgroundColor: '#FF9E0D',
					hoverBorderColor: '#FF9E0D',
					data: []
				}
			]
		};
		if (data.length > 0) {
			data.map(e => {
				if (typeof e.restaurantName === 'string' && e.restaurantName.length > 12) {
					outPut.labels.push(`${e.restaurantName.slice(0, 25)}...`);
				} else {
					outPut.labels.push(e.restaurantName);
				}
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
				incomeRestaurant: { data = [] }
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
			<Spin spinning={loading}>
				<Card
					title={
						<FormattedMessage
							id="dashboard.title.tamaa.restaurant"
							defaultMessage="Top 5 des remboursements"
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
