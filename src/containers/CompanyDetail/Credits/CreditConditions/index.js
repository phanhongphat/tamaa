import React, { PureComponent } from 'react';

import { Row, Col, Form } from 'antd';

import ConditionEdit from './NormalDay/edit';

import injectSheet from 'react-jss';
import styles from './styles';

import InputEdit from 'src/containers/CompanyDetail/_Details/InputEdit';
import { Ruler } from 'src/containers/CompanyDetail/_Details';

let normal = {};
let exceptions = {};

@injectSheet(styles)
@Form.create()
export default class CreditConditions extends PureComponent {
	render() {
		const { restriction } = this.props;
		const noException = ({ exceptions, ...rest }) => rest;
		normal = noException(this.props.conditions);
		exceptions = this.props.conditions['exceptions'];
		// console.log(restriction);
		return (
			<>
				<ConditionEdit
					normal={normal !== undefined ? normal : []}
					exceptions={exceptions !== undefined ? exceptions : []}
					id={this.props.id}
					stateName="companyConditions"
					restriction={restriction}
				/>
				<Ruler span={24} />
				<InputEdit
					id={this.props.id}
					form={this.props.form}
					name="Montant journalier"
					value={this.props.dailyAmount}
					stateName="dailyAmount"
					// reload={this.handleUpdateInformation}
					type="number"
					size={[5, 5, 14, 0]}
					edit={true}
					isNull={false}
				/>
			</>
		);
	}
}
// @connect(
// 	null,
// 	mapDispatchToProps
// )
// const mapDispatchToProps = dispatch => ({
// 	action: bindActionCreators(
// 		{
// 			updateCompanieInfo,
// 			getCompanieInfo
// 		},
// 		dispatch
// 	)
// });

// import { connect } from 'react-redux';
// import { bindActionCreators } from 'redux';
// import { updateCompanieInfo, getCompanieInfo } from 'src/redux/actions/companies';
// handleUpdateInformation = (name, value) => {
// 	const { id } = this.props;
// 	const payload = {
// 		id
// 	};
// 	this.props.action.updateCompanieInfo(
// 		payload,
// 		next => {
// 			this.setState({ loading: false });
// 			if (next.title !== 'An error occurred') {
// 				this.props.handleGetCompanyDetail(id);
// 			} else {
// 				message.error(next.detail);
// 			}
// 		},
// 		nextErr => this.setState({ loading: false })
// 	);
// };
