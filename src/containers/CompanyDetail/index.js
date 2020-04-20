import React, { PureComponent } from 'react';
import injectSheet from 'react-jss';

import CDHeader from './Header';
import TabPanel from './Panel';
import Breadcrumb from 'src/components/Breadcrumb';
import { Card, Row, Col, Typography, Divider } from 'antd';

//redux
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { getCompanieInfo } from 'src/redux/actions/companies';
import { FormattedRelative, FormattedMessage, defineMessages } from 'react-intl';

import styles from './styles';

const { Text, Title } = Typography;

function mapStateToProps(state) {
	return {
		store: {
			detail: state.companies.detail.data,
			loading: state.companies.detail.loading
		}
	};
}

const mapDispatchToProps = dispatch => {
	return {
		action: bindActionCreators(
			{
				getCompanieInfo
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
export default class CompanyDetail extends PureComponent {
	state = {
		loading: false
	};

	componentDidMount() {
		const { id } = this.props;
		this.handleGetCompanyDetail(id);
	}

	handleGetCompanyDetail = id => {
		const payload = { id };

		this.props.action.getCompanieInfo(
			payload,
			() => {
				this.setState({ loading: false });
			},
			() => {
				this.setState({ loading: false });
			}
		);
	};

	render() {
		const { classes, store } = this.props;
		const { detail } = store;
		const { id, name } = detail;
		const routes = [
			{
				path: '/companies',
				breadcrumbName: <FormattedMessage id="nav.companise" defaultMessage="Companies" />
			},
			{
				breadcrumbName: name
			}
		];
		return (
			<>
				<Breadcrumb breadcrumb={routes} />
				<Card style={{ minHeight: 360, marginTop: '16px' }} bordered={false}>
                    <Row className={classes.headerBar} type="flex" align="middle" justify="space-between">
                        <Col>
                            <Row type="flex" align="middle">
                                <h3>
                                    <strong>
                                        {detail.name ? detail.name : ''}
                                        <Divider type="vertical" />#{detail.user && detail.user.customId}
                                    </strong>
                                </h3>
                            </Row>
                        </Col>
                    </Row>
                    <TabPanel
                        id={this.props.id}
                        detail={detail}
                        handleGetCompanyDetail={this.handleGetCompanyDetail}
                        tab={this.props.tab}
                    />
				</Card>
			</>
		);
	}
}
