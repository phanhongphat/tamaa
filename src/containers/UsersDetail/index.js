import React, { PureComponent } from 'react';
import injectSheet from 'react-jss';
// import { Router, Link } from 'src/routes';
import { Card, Menu, Row, Col, Input, Typography, Spin, Divider, Modal } from 'antd';
const { Search } = Input;
const { confirm } = Modal;
const { Text } = Typography;

import Breadcrumb from 'src/components/Breadcrumb';
import FormUserDetail from 'src/containers/UsersDetail/Form';

import styles from './styles';

//redux
import { getUserInfo, updateUserInfor } from 'src/redux/actions/user';
import { FormattedRelative, FormattedMessage, defineMessages } from 'react-intl';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

function mapStateToProps(state) {
	return {
		store: {
			users: state.user
		}
	};
}
const mapDispatchToProps = dispatch => {
	return {
		action: bindActionCreators(
			{
				getUserInfo
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
export default class SettingUsersContainer extends PureComponent {
	state = {
		loading: true,
		selectedRowKeys: []
	};

	filter = {
		// email: '',
		// username: '',
		// _page: '1',
		// itemsPerPage: 10,
		pagination: false
	};

	componentDidMount() {
		const { id } = this.props;
		const params = {
			id
		};
		this.getUserInfor(params);
	}

	getUserInfor = filter => {
		this.setState({ loading: true });
		const pramas = filter ? filter : this.filter;
		this.props.action.getUserInfo(
			pramas,
			() => {
				this.setState({ loading: false });
			},
			() => {
				this.setState({ loading: false });
			}
		);
	};

	onSelectChange = selectedRowKeys => {
		console.log('selectedRowKeys', selectedRowKeys);
		this.setState({ selectedRowKeys });
	};

	showConfirmDeleteById = () => {
		const seft = this;
		const { selectedRowKeys } = this.state;
		if (selectedRowKeys.length > 0) {
			confirm({
				title: 'Confirmez-vous la supprimer des éléments sélectionnés?',
				content: 'Lorsque vous cliquez sur le bouton OK, cette boîte de dialogue sera fermée après 1 seconde',
				onOk() {
					seft.handelDeleteById();
				},
				onCancel() {}
			});
		}
	};

	render() {
		const {
			classes,
			store: {
				users: {
					detail: { data = {} }
				}
			}
		} = this.props;

		const { loading } = this.state;

		const routes = [
			{
				path: '/users',
				breadcrumbName: <FormattedMessage id="user.breadcrum.user" defaultMessage="Users" />
			},
			{
				breadcrumbName: data.lastName && data.firstName ? data.firstName + " " + data.lastName : data.email
			}
		];

		return (
			<>
				<Breadcrumb breadcrumb={routes} />
				<Card style={{ minHeight: 360, marginTop: '16px' }} bordered={false}>
					<Spin spinning={loading}>
						<Row type="flex" justify="start">
							<Col>
								<h3>
									<strong>{data.email}</strong>
								</h3>
							</Col>
							<Col className={classes.verticalInfo}>
								<h3>|</h3>
							</Col>
							<Col span={6}>
								<h3>
									<strong># {data.id || ''}</strong>
								</h3>
							</Col>
						</Row>
						<Row>
							<FormUserDetail />
						</Row>
					</Spin>
				</Card>
			</>
		);
	}
}
