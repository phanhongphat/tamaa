import React, { PureComponent } from 'react';
import isArray from 'lodash/isArray';
import injectSheet from 'react-jss';
import styles from './styles';

import { updateCompanieInfo } from 'src/redux/actions/companies';
import { getListIsland } from 'src/redux/actions/island';
import { getListTowns } from 'src/redux/actions/town';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { Form, Select, Row, Col, Button, Typography, Icon } from 'antd';
import SampleButton from 'src/containers/CompanyDetail/Credits/CreditConditions/NormalDay/button';
import { sortByAlphabet } from 'src/constants';

const { Option } = Select;
const { Text } = Typography;

let type = undefined;

const mapStateToProps = state => ({
	cityList: state
});

const mapDispatchToProps = dispatch => ({
	action: bindActionCreators(
		{
			updateCompanieInfo,
			getListIsland,
			getListTowns
		},
		dispatch
	)
});

@injectSheet(styles)
@connect(
	mapStateToProps,
	mapDispatchToProps
)
export default class InputEdit extends PureComponent {
	state = {
		isEdit: false,
		islands: [],
		city: [],
		status: '',
		cityCode: '',
		islandCode: ''
	};

	save = () => {
		const { id } = this.props;
		const { islandCode, cityCode } = this.state;
		if (islandCode === '' || cityCode === '') this.setState({ isEdit: false });
		else {
			const payload = {
				id,
				island: `/api/islands/${islandCode}`,
				city: `/api/cities/${cityCode}`
			};
			// console.log(payload);
			this.props.action.updateCompanieInfo(
				payload,
				res => {
					console.log(res);
					this.setState({ loading: false, isEdit: false });
					// this.props.reload(id);
				},
				() => this.setState({ loading: false })
			);
		}
	};

	componentDidMount() {
		this.props.action.getListIsland(
			res => {
				if (res && isArray(res)) {
					this.setState({ loading: false, islands: res });
				}
			},
			() => this.setState({ loading: false }),
			{ pagination: false }
		);
		this.props.action.getListTowns(
			res => {
				if (res && isArray(res)) {
					this.setState({ loading: false, city: res });
				}
			},
			() => this.setState({ loading: false }),
			{
				island: this.state.islandCode || 1,
				pagination: false
			}
		);
	}

	onSelectChange(e, name) {
		this.setState({ islandCode: e });
		if (name === 'island') {
			this.props.action.getListTowns(
				res => {
					this.setState({ loading: false, city: res });
				},
				() => this.setState({ loading: false }),
				{
					island: e,
					pagination: false
				}
			);
		}
	}

	render() {
		const { getFieldDecorator } = this.props.form;
		const { isEdit, islands } = this.state;
		const { value, value2, name, stateName, classes } = this.props;
		type = (
			<>
				<Select placeholder={value} style={{ width: '90%' }} onChange={e => this.onSelectChange(e, 'island')}>
					{this.state.islands &&
						sortByAlphabet(this.state.islands, 'islandName').map(island => (
							<Option key={island.id} value={island.id}>
								{island.islandName}
							</Option>
						))}
				</Select>
				{/* {console.log(this.state.islandCode)} */}
				<Select placeholder={value2} style={{ width: '90%' }} onChange={e => this.setState({ cityCode: e })}>
					{this.state.city &&
						sortByAlphabet(this.state.city, 'cityName').map(c => (
							<Option key={c.id} value={c.id}>
								{c.cityName}
							</Option>
						))}
				</Select>
			</>
		);

		return (
			<Form.Item>
				<Row>
					<Col span={6}>
						<Text strong>{name}</Text>
						<br /> <Text strong>Commune: </Text>
					</Col>
					<Col span={8}>
						{getFieldDecorator(name || stateName, {
							rules: [
								{
									required: true,
									message: 'Please input your' + name
								}
							]
						})(
							!isEdit ? (
								<>
									<Text>{value ? value : 'Néant'}</Text>
									<br />
									<Text>{value2 ? value2 : 'Néant'}</Text>
								</>
							) : (
								type
							)
						)}
					</Col>
					<Col span={10} push={4}>
						{!isEdit ? (
							<SampleButton
								type="link"
								action={() => this.setState({ isEdit: true })}
								icon="form"
								name="Modifier"
							/>
						) : (
							<Button.Group>
								<SampleButton name="Annuler" action={() => this.setState({ isEdit: false })} />{' '}
								<SampleButton name="Sauvegarder" action={this.save} type="primary" />
							</Button.Group>
						)}
					</Col>
				</Row>
			</Form.Item>
		);
	}
}
