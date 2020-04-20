import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import injectSheet from 'react-jss';
import { Divider, Row, Col, Card, Form } from 'antd';
import styles from '../styles';
import InputEdit from 'src/containers/CompanyDetail/_Details/InputEdit';

const domain = process.env.API_URL.slice(0, process.env.API_URL.lastIndexOf('/'));

@injectSheet(styles)
@Form.create()
export default class Detail extends PureComponent {
	static propTypes = {
		classes: PropTypes.object.isRequired,

		store: PropTypes.shape({
			user: PropTypes.object.isRequired
		}),

		action: PropTypes.shape({
			getListEmployee: PropTypes.func.isRequired
		})
	};

	static defaultProps = {};

	render() {
		const { classes } = this.props;
		const { user } = this.props;
		const { data } = user;

		const linkQRCode = domain + user.data.qrcode;
		const { id, phoneNumber, company, email, lastName, firstName } = data;
		const Ruler = props => (
			<Row>
				<Col span={props.span}>
					<Divider />
				</Col>
			</Row>
		);
		// console.log(user);
		return (
			<Card bordered={false}>
				<Col offset={2}>
					<Row type="flex" align="middle" justify="space-between">
						<Col span={6}>{data.qrcode && <img width="156" src={linkQRCode} />}</Col>
						<Col span={24} className={classes.item__editor} style={{ position: 'absolute' }}>
							<InputEdit
								id={id}
								form={this.props.form}
								name=""
								value={firstName}
								stateName="firstName"
								type="input"
								size={[6, 6, 8, 0]}
								role="employee"
								edit={true}
							/>

							<InputEdit
								id={id}
								form={this.props.form}
								name=""
								value={lastName}
								stateName="lastName"
								type="input"
								size={[6, 6, 8, 0]}
								role="employee"
								edit={true}
							/>
						</Col>
					</Row>
					<Ruler span={24} />

					<InputEdit
						// id={id}
						form={this.props.form}
						name="Email"
						value={email}
						stateName="phoneNumber"
						type="input"
						size={[6, 6, 8, 0]}
						// role="employee"
						edit={false}
					/>
					<InputEdit
						// id={id}
						form={this.props.form}
						name="Société"
						value={company.name}
						stateName="phoneNumber"
						type="input"
						size={[6, 6, 8, 0]}
						// role="employee"
						edit={false}
					/>
					<InputEdit
						id={id}
						form={this.props.form}
						name="Numéro de téléphone"
						value={phoneNumber}
						stateName="phoneNumber"
						type="phone"
						size={[6, 6, 8, 0]}
						role="employee"
						edit={true}
					/>
				</Col>
			</Card>
		);
	}
}
// import { connect } from 'react-redux';
// import { bindActionCreators } from 'redux';
// import { getEmployeeDetails, editEmployeeRequest } from 'src/redux/actions/employee';
// import { updateUserInfor, getUserInfo } from 'src/redux/actions/user.js';
// import { getListTransactions } from 'src/redux/actions/transactions.js';
// success = () => {
// 	const status = this.state.isSwitcherOn ? 'Employee is active now' : 'Employee is disactive now';
// 	message.success(status);
// };
// @connect(
// 	mapStateToProps,
// 	mapDispatchToProps
// )
// function mapStateToProps(state) {
// 	return {
// 		store: {
// 			transactions: state.transactions.list,
// 			userAccount: state.user.detail,
// 			loadingUserAccount: state.user.detail.loading
// 		}
// 	};
// }

// const mapDispatchToProps = dispatch => {
// 	return {
// 		action: bindActionCreators(
// 			{
// 				getListTransactions,
// 				editEmployeeRequest,
// 				getUserInfo
// 			},
// 			dispatch
// 		)
// 	};
// };
// state = {
// loading: true,
// isClickedFilter: false,
// visible: false,
// isSwitcherOn: false,
// isClickEdit: false,
// isSave: false
// };
// import { FormattedRelative, FormattedMessage, defineMessages } from 'react-intl';
// import FieldEditor from 'src/components/Input/Edit';
// import EditNumeric from 'src/components/Input/EditNumeric';
// const width1 = '65%';
// const width2 = '100%';
// const width = !this.state.isClickEdit ? width1 : width2;
// import HeaderContent from 'src/components/HeaderContent';
// import Loading from 'src/components/Loading/index.js';
// import { getListEmployeeTransactions } from 'src/redux/actions/EmployeeTransactions.js';
// import DateSelected from 'src/containers/CreateEmployee/DateSelected';
// import Table from 'src/containers/EmployeeDetails/Credits/Table';
{
	/* <Row className={classes.item} type="flex" align="middle">
						<Col span={8}>
							<FormattedMessage id="company" defaultMessage="Company" />
						</Col>
						<Col span={16} className={classes.item__editor}>
							{data.company && data.company.name}
						</Col>
					</Row> */
}
{
	/* {console.log(company)} */
}
{
	/* <Row className={classes.item} type="flex" align="middle">
						<Col span={8}>Email</Col>
						<Col span={16} className={classes.item__editor}>
							{data.email}
						</Col>
					</Row> */
}
{
	/* <FieldEditor
								name="lastName"
								value={data.lastName}
								handleSave={this.handleUpdateInformation}
							/> */
}
{
	/* <FieldEditor
								name="firstName"
								value={data.firstName}
								handleSave={this.handleUpdateInformation}
							/> */
}
// handleUpdateInformation = (name, value) => {
// 	const { id } = this.props.user.data;
// 	const payload = {
// 		id,
// 		[name]: value
// 	};

// 	this.props.action.editEmployeeRequest(
// 		payload,
// 		() => {
// 			this.setState({
// 				loading: false,
// 				isClickEdit: false,
// 				isSave: false
// 			});
// 		},
// 		() => {
// 			this.setState({
// 				loading: false,
// 				isSave: false
// 			});
// 		}
// 	);
// };

// handleEdit = () => {
// 	this.setState({
// 		isClickEdit: true
// 	});
// };

// handleSave = () => {
// 	this.setState({
// 		isClickEdit: false
// 	});
// };
