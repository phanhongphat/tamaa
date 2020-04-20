import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Breadcrumb from 'src/components/Breadcrumb';
import injectSheet from 'react-jss';
import {
	Input,
	Icon,
	Menu,
	Dropdown,
	message,
	Tabs,
	DatePicker,
	Divider,
	Row,
	Typography,
	Popover,
	Button,
	Col,
	Card
} from 'antd';
// import { getListCreditDetails } from 'src/redux/actions/creditsDetails.js';
import HeaderContent from 'src/components/HeaderContent';
import TableList from './Table/index';
import styles from './styles';
import CONSTANTS from 'src/constants';

const { RangePicker } = DatePicker;
const { Text } = Typography;
const { TabPane } = Tabs;
const { Search } = Input;

function mapStateToProps(state) {
	return {
		store: {
			//credit: state.creditsDetails.list
		}
	};
}

const mapDispatchToProps = dispatch => {
	return {
		action: bindActionCreators(
			{
				// getListCreditDetails
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
export default class CreditsDetailsContainer extends PureComponent {
	static propTypes = {
		classes: PropTypes.object.isRequired,
		// slug: PropTypes.string.isRequired,
		// store
		store: PropTypes.shape({
			credit: PropTypes.object.isRequired
		}),
		// action
		action: PropTypes.shape({
			getListEmployee: PropTypes.func.isRequired
		})
	};

	static defaultProps = {};

	state = {
		loading: true,
		isClickedFilter: false,
		visible: false,
		currentBalances: 100000,
		currentDate: Date.now()
	};

	componentDidMount() {
		// this.props.action.getListCreditDetails(
		// 	// {},
		// 	() => {
		// 		this.setState({ loading: false });
		// 	},
		// 	() => {
		// 		this.setState({ loading: false });
		// 	}
		// );
	}
	render() {
		const {
			classes,
			store: { credit = {} }
		} = this.props;

		const routes = [
			{
				breadcrumbName: 'Credits details'
			}
		];

		return (
			<>
				<Breadcrumb
					breadcrumb={routes}
					//  title="ss"
				/>
				<Card style={{ minHeight: 360, marginTop: '16px' }} bordered={false}>
					<div style={{ marginBottom: '48px' }}>
						<Row className={classes.headerBar} type="flex" align="middle" justify="space-between">
							<Col>
								<HeaderContent name={'Company 23'} id={`# 508521`} />
							</Col>
							<Col>
								<Search
									placeholder="Search in all fields"
									className={classes.btnSearch}
									onSearch={value => console.log(value)}
								/>
							</Col>
							<Button icon="export">Export</Button>
						</Row>
					</div>
					<Row className={classes.headerBar} type="flex" align="middle" justify="space-between">
						<Text>
							<Text className={classes.textBalances}>Total:</Text>
							<Text className={classes.currentBalances}>
								{this.state.currentBalances}
								<sup className={classes.currency}>{CONSTANTS.CURRENCY}</sup>
							</Text>
						</Text>
						<Text>
							Date:
							<Text className={classes.dateTime}>30/05/2019 01:12:33</Text>
						</Text>
						<div />
						<div />
					</Row>
					<Row>
						<div className={classes.main}>
							{/*{*/}
							{/*    credit.data &&*/}
							<TableList data={credit.data} />
							{/*}*/}
						</div>
					</Row>
					{credit.data ? (
						<Row>
							<TableList data={credit.data} />
						</Row>
					) : (
						''
					)}
				</Card>
			</>
		);
	}
}
