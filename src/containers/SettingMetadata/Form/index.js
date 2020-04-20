import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import injectSheet from 'react-jss';
import _ from 'lodash';
import { Form, Collapse, Select, Typography, Input, Card, message, Spin } from 'antd';
// import { Router, Link } from 'src/routes';

const { Paragraph } = Typography;

import Editor from 'src/components/Input/Editor';
import FieldEditor from 'src/components/Input/Edit';

import { getListMetadata, updateMetadataRequest } from 'src/redux/actions/metadata';

const { Panel } = Collapse;
const { Option } = Select;
const { TextArea } = Input;

import styles from './styles';

//redux
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

function mapStateToProps(state) {
	return {
		store: {
			metadata: state.settingsMetadata.list
		}
	};
}

const mapDispatchToProps = dispatch => {
	return {
		action: bindActionCreators(
			{
				getListMetadata,
				updateMetadataRequest
			},
			dispatch
		)
	};
};

@connect(
	mapStateToProps,
	mapDispatchToProps
)
@injectSheet(styles)
@Form.create()
export default class MetadataForm extends PureComponent {
	static propTypes = {
		classes: PropTypes.object.isRequired,
		// slug: PropTypes.string.isRequired,
		// store
		store: PropTypes.shape({
			metadata: PropTypes.object.isRequired
		}),
		// action
		action: PropTypes.shape({
			getListMetadata: PropTypes.func.isRequired
		})
	};

	onPositionChange = expandIconPosition => {
		this.setState({ expandIconPosition });
	};

	state = {
		loading: false,
		expandIconPosition: 'left'
	};

	componentDidMount() {
		this.handelGetListMetadata();
	}

	handelGetListMetadata = () => {
		this.props.action.getListMetadata(
			// {},
			() => {
				this.setState({ loading: false });
			},
			() => {
				this.setState({ loading: false });
			}
		);
	};

	handleUpdateMetadata = (alias, content) => {
		const payload = {
			alias,
			params: {
				content
			}
		};
		this.setState({ loading: true });
		// console.log('alias ==>', alias);
		// console.log('content ==>', content);
		// return;
		this.props.action.updateMetadataRequest(
			payload,
			() => {
				// this.getListRestaurant();
				message.success('Update success');
				this.handelGetListMetadata();
				this.setState({ loading: false });
			},
			() => {
				this.setState({ loading: false });
			}
		);
	};

	findHeader = alias => {
		switch (alias) {
			case 'greneral_conditions':
				return 'General conditions';
			case 'contact_us':
				return 'Contact us';
			case 'help':
				return 'Help';
			case 'contact':
				return 'Contact';
			default:
				return '';
		}
	};

	onChange = (str, alias) => {
		console.log('Content change:', str, alias);
		// this.setState({ str });
		this.handleUpdateMetadata(alias, str);
	};

	render() {
		const { loading } = this.state;
		const {
			classes,
			store: {
				metadata: { data = [] }
			}
		} = this.props;
		// const { getFieldDecorator, getFieldValue } = this.props.form;

		return (
			<div>
				{data.map(e => {
					if (e.alias === 'phone' || e.alias === 'email') {
						return (
							<Spin spinning={loading}>
								<Card title={e.name} bordered={false} key={e.key} style={{ marginBottom: '20px' }}>
									<Paragraph editable={{ onChange: str => this.handleUpdateMetadata(e.alias, str) }}>
										{e.content}
									</Paragraph>
								</Card>
							</Spin>
						);
					}
					return (
						<Spin spinning={loading}>
							<Card title={e.name} bordered={false} key={e.key} style={{ marginBottom: '20px' }}>
								<Editor
									alias={e.alias}
									autosize={{ minRows: 4 }}
									defaultValue={e.content}
									handleUpdateMetadata={this.handleUpdateMetadata}
									readOnly={!this.state[`enable_${e.key}`]}
									onChange={e => {
										this.setState({
											[e.key]: e.target.value
										});
									}}
								/>
							</Card>
						</Spin>
					);
				})}
			</div>
		);
	}
}
