import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Router } from 'src/routes';
import { FormattedMessage } from 'react-intl';

import AuthStorage from 'src/utils/AuthStorage';
import Breadcrumb from 'src/components/Breadcrumb';
import TamaLayout from 'src/containers/Dashboard/Tamaa';
import RestaurantLayout from 'src/containers/Dashboard/Restaurant';
import CompanyLayout from 'src/containers/Dashboard/Company';

function mapStateToProps(state) {
	return {
		store: {
			auth: state.auth
		}
	};
}

const mapDispatchToProps = dispatch => {
	return {
		action: bindActionCreators({}, dispatch)
	};
};

@connect(
	mapStateToProps,
	mapDispatchToProps
)
export default class Dashboard extends PureComponent {
	render() {
		const { isTama, isCompany, isRestaurant, isEmployee } = AuthStorage;
		const routes = [
			{
				breadcrumbName: <FormattedMessage id="dashboard.breadcrumb.title" defaultMessage="Tableau de bord" />
			}
		];

		if (isTama) {
			return (
				<>
					<Breadcrumb breadcrumb={routes} />
					<div style={{ marginTop: '16px' }}>
						<TamaLayout />
					</div>
				</>
			);
		}

		if (isCompany) {
			return (
				<>
					<Breadcrumb breadcrumb={routes} />
					<div style={{ marginTop: '16px' }}>
						<CompanyLayout />
					</div>
				</>
			);
		}

		if (isRestaurant) {
			return (
				<>
					<Breadcrumb breadcrumb={routes} />
					<div style={{ marginTop: '16px' }}>
						<RestaurantLayout />
					</div>
				</>
			);
		}

		return <div />;
	}
}
