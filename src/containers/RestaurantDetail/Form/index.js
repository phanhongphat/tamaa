import React, { PureComponent } from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import injectSheet from 'react-jss';
import { Form, Tabs } from 'antd';
import { Router, Link } from 'src/routes';

import { loginRequest } from 'src/redux/actions/auth';
import AuthStorage from 'src/utils/AuthStorage';
import Loading from 'src/components/Loading/index.js';
import RestaurantDetails from './Details/index';
import RestaurantCredits from './Credits/index';
import RestaurantTransactions from './Transactions/index';
import RestaurantAccount from './Account/index';
import RestaurantNotification from './Notification';

import styles from './styles';

const { TabPane } = Tabs;

@injectSheet(styles)
@Form.create()
export default class RestaurantFrom extends PureComponent {
	static propTypes = {
		store: PropTypes.shape({
			auth: PropTypes.object.isRequired
		}).isRequired,
		action: PropTypes.shape({
			loginRequest: PropTypes.func.isRequired
		}).isRequired
	};

	static defaultProps = {};

	state = {
		loading: true
	};

	render() {
		const { loading } = this.state;
		const { classes, details, handleGetRestaurantDetail, restaurantId } = this.props;
		const { isTama } = AuthStorage;

		return (
			<Tabs defaultActiveKey="details">
				<TabPane tab={<FormattedMessage id="restaurants.details" defaultMessage="Details" />} key="details">
					<RestaurantDetails handleGetRestaurantDetail={handleGetRestaurantDetail} details={details} />
				</TabPane>
				<TabPane tab={<FormattedMessage id="restaurants.credits" defaultMessage="Credits" />} key="credits">
					<RestaurantCredits handleGetRestaurantDetail={handleGetRestaurantDetail} details={details} />
				</TabPane>
                <TabPane tab={<FormattedMessage id="restaurants.transactions" defaultMessage="Transactions" />} key="transactions">
                    <RestaurantTransactions handleGetRestaurantDetail={handleGetRestaurantDetail} details={details} />
                </TabPane>
				<TabPane tab={<FormattedMessage id="restaurants.account" defaultMessage="Account" />} key="account">
					<RestaurantAccount handleGetRestaurantDetail={handleGetRestaurantDetail} details={details} />
				</TabPane>
				{isTama && (
					<TabPane
						tab={<FormattedMessage id="restaurants.notfication" defaultMessage="Notfication" />}
						key="notfication">
						<RestaurantNotification restaurantId={restaurantId} />
					</TabPane>
				)}
			</Tabs>
		);
	}
}
