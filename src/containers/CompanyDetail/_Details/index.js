import React, { PureComponent } from 'react';

import { getCompanieInfo } from 'src/redux/actions/companies';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { Form, Divider, Row, Col, Spin } from 'antd';

import InputEdit from './InputEdit';
import SelectEdit from './SelectEdit';

const mapStateToProps = state => ({
	details: state.companies.detail.data
});

const mapDispatchToProps = dispatch => ({
	action: bindActionCreators(
		{
			getCompanieInfo
		},
		dispatch
	)
});

export const Ruler = props => (
	<Row>
		<Col span={props.span}>
			<Divider />
		</Col>
	</Row>
);

@Form.create()
@connect(
	mapStateToProps,
	mapDispatchToProps
)
export default class _Detail extends PureComponent {
	state = {
		loading: true
	};
	getDetails = id => {
		this.props.action.getCompanieInfo(
			{ id },
			() => this.setState({ loading: false }),
			() => this.setState({ loading: false })
		);
	};

	componentDidMount() {
		this.getDetails(this.props.id);
	}
	render() {
		const user = this.props.details && this.props.details.user;
		const { loading } = this.state;
		return (
			<Spin spinning={loading}>
				<Form style={{ padding: '10px 10%' }}>
					<InputEdit
						id={this.props.id}
						form={this.props.form}
						name="Société"
						value={this.props.details && this.props.details.name}
						stateName="name"
						// reload={this.getDetails}
						customId={user && user.customId}
						type="input"
						size={[6, 8, 10, 4]}
						edit={false}
						// isNull={false}
					/>

					<Ruler span={20} />

					<InputEdit
						id={this.props.id}
						form={this.props.form}
						name="Info"
						value={this.props.details && this.props.details.description}
						stateName="description"
						// reload={this.getDetails}
						type="area"
						size={[6, 8, 10, 4]}
						edit={true}
						isNull={true}
					/>

					<Ruler span={20} />

					<InputEdit
						id={this.props.id}
						form={this.props.form}
						name="Numéro de téléphone"
						value={this.props.details && this.props.details.phoneNumber1}
						stateName="phoneNumber1"
						// reload={this.getDetails}
						type="phone"
						size={[6, 8, 10, 4]}
						edit={true}
						isNull={false}
					/>
					<InputEdit
						id={this.props.id}
						form={this.props.form}
						name=""
						value={this.props.details && this.props.details.phoneNumber2}
						stateName="phoneNumber2"
						// reload={this.getDetails}
						type="phone"
						size={[6, 8, 10, 4]}
						edit={true}
						isNull={true}
					/>

					<Ruler span={20} />

					<InputEdit
						id={this.props.id}
						form={this.props.form}
						name="Adresse"
						value={this.props.details && this.props.details.address}
						stateName="address"
						// reload={this.getDetails}
						type="input"
						size={[6, 8, 10, 4]}
						edit={true}
						isNull={true}
					/>

					<Ruler span={20} />

					<SelectEdit
						id={this.props.id}
						form={this.props.form}
						name="Île"
						value={this.props.details && this.props.details.island && this.props.details.island.islandName}
						islandCode={this.props.details && this.props.details.island && this.props.details.island.id}
						value2={this.props.details && this.props.details.city && this.props.details.city.cityName}
						stateName="address"
						// reload={this.getDetails}
					/>
				</Form>
			</Spin>
		);
	}
}
