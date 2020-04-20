import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import injectSheet from 'react-jss';
import { Card, Row, Col, Typography, Divider } from 'antd';
import { FormattedRelative, FormattedMessage, defineMessages } from 'react-intl';
import Breadcrumb from 'src/components/Breadcrumb';

import HeaderContent from 'src/components/HeaderContent';
import Forms from 'src/containers/RestaurantDetail/Form/index.js';

import styles from './styles';

//redux
import { getDetailRestaurant } from 'src/redux/actions/restaurant.js';

const { Text } = Typography;

function mapStateToProps(state) {
	return {
		store: {
			// restaurant: state.restaurant.list,
			detail: state.restaurant.details.data
		}
	};
}

const mapDispatchToProps = dispatch => {
	return {
		action: bindActionCreators(
			{
				getDetailRestaurant
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
export default class RestaurantContainer extends PureComponent {
	static propTypes = {
		classes: PropTypes.object.isRequired,
		// slug: PropTypes.string.isRequired,
		// store
		store: PropTypes.shape({
			detail: PropTypes.object.isRequired
		}),
		// action
		action: PropTypes.shape({
			getDetailRestaurant: PropTypes.func.isRequired
		})
	};

	static defaultProps = {};

	state = {
		loading: true
	};

	componentDidMount() {
		const { id } = this.props;
		this.handleGetRestaurantDetail(id);
	}

	handleGetRestaurantDetail = id => {
		const payload = { id };
		this.props.action.getDetailRestaurant(
			payload,
			() => this.setState({ loading: false }),
			() => this.setState({ loading: false })
		);
	};

	onChange(e) {
		const target = e.target;
		const value = target.type === 'checkbox' ? target.checked : target.value;
		this.setState({ [name]: value });
	}

	render() {
		const {
			classes,
			id,
			store: { detail }
		} = this.props;
		const { restaurantName } = detail;

		const routes = [
			{
				path: '/restaurants',
				breadcrumbName: <FormattedMessage id="restaurants.details.breadcrumb" defaultMessage="Restaurants" />
			},
			{
				// path: `/restaurants-detail/${id}`,
				breadcrumbName: <span>{restaurantName ? restaurantName : ''}</span>
			}
		];

		if (detail.id) {
			return (
				<div>
					<Breadcrumb
						breadcrumb={routes}
						//  title="ss"
					/>
					<Card style={{ minHeight: 360, marginTop: '16px' }} bordered={false}>
						<Row className={classes.headerBar} type="flex" align="middle" justify="space-between">
							<Col>
								<Row type="flex" align="middle">
									<h3>
										<strong>
											{detail.restaurantName}
											<Divider type="vertical" />#{detail.user.customId}
										</strong>
									</h3>
								</Row>
							</Col>
						</Row>
						<div className={classes.main}>
							{detail && (
								<Forms
									handleGetRestaurantDetail={this.handleGetRestaurantDetail}
									details={detail}
									restaurantId={id}
								/>
							)}
						</div>
					</Card>
				</div>
			);
		} else {
			return (
				<div>
					<Breadcrumb
						breadcrumb={routes}
						//  title="ss"
					/>
					<Card style={{ minHeight: 360, marginTop: '16px' }} bordered={false} />
				</div>
			);
		}
	}
}
