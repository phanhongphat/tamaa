import React, { PureComponent } from 'react';
import injectSheet from 'react-jss';
// import { Router, Link } from 'src/routes';
import {
    Button,
    Menu,
    Row,
    Col,
    Input,
    Icon,
    Dropdown,
    Spin,
    Modal,
    Card,
    message,
    Form
} from 'antd';
import { FormattedMessage } from 'react-intl';
import { getListTowns, createTownsRequest } from 'src/redux/actions/town.js';
import { getListIsland, createIslandRequest, updateIslandRequest } from 'src/redux/actions/island';
const { Search } = Input;
const { confirm } = Modal;

import styles from './styles';

// import Title from './UsersComponent/Title';
import BtnExport from 'src/components/Button/BtnExport';
import Breadcrumb from 'src/components/Breadcrumb';
import BtnCreateUser from 'src/components/Button/CreateUser';
import Table from './Table';

//redux
// import { getListUser, deleteUser, deactiveMultipleUser } from 'src/redux/actions/user';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import NumericInput from '../../components/Input/NumericInput';

function mapStateToProps(state) {
	return {
		store: {
			islands: state.islands.list,
            cities: state.towns.list
		}
	};
}
const mapDispatchToProps = dispatch => {
	return {
		action: bindActionCreators(
			{
				// getListUser,
				// deleteUser,
				// deactiveMultipleUser,
                getListIsland,
                getListTowns,
                createIslandRequest,
                createTownsRequest,
			},
			dispatch
		)
	};
};

let id = 0;

@injectSheet(styles)
@connect(
	mapStateToProps,
	mapDispatchToProps
)
@Form.create()
export default class SettingUsersContainer extends PureComponent {
	state = {
		loading: true,
        visible: false,
		selectedRows: []
	};

	componentDidMount() {
		this.getListIslandsCities();
	}

    showModal = () => {
        this.setState({
            visible: true
        });
    };

    handleCancel = e => {
        const { form } = this.props;
        // can use data-binding to get
        // const keys = form.getFieldValue('keys');
        form.setFieldsValue({keys: []});
        // console.log(keys);
        this.setState({
            visible: false
        });
    };

    getListIslandsCities = filter => {
        this.props.action.getListIsland(
            () => this.setState({ loading: false }),
            () => this.setState({ loading: false }),
            {
                pagination: false
            }
        );
        // this.props.action.getListTowns(
        //     () => this.setState({ loading: false }),
        //     () => this.setState({ loading: false }),
        //     {
        //         pagination: false
        //     }
        // );
	};

	onSelectChange = selectedRows => {
		// console.log('selectedRows', selectedRows);
		this.setState({ selectedRows });
	};

	// handleActivate() {
	// 	const rows = this.state.selectedRows;
	// 	// console.log('rows selectedRows', rows);
	// 	const payload = rows.map(each => {
	// 		console.log(each);
	// 		return {
	// 			id: each.id,
	// 			activated: true,
	// 			creditActivated: true
	// 		};
	// 	});
	// 	this.props.action.deactiveMultipleUser(
	// 		payload,
	// 		() => {
	// 			this.setState({ loading: false });
	// 			message.success(`Activated ${rows.length} users`);
	// 		},
	// 		() => this.setState({ loading: false })
	// 	);
	// 	setTimeout(() => {
	// 		this.getListUser();
	// 		// this.setState({ companyData: this.props.store.companies.list.data });
	// 	}, 2500);
	// }

	// handleDeactivate() {
	// 	const rows = this.state.selectedRows;
	// 	// console.log('rows selectedRows', rows);
	// 	const payload = rows.map(each => {
	// 		console.log(each);
	// 		return {
	// 			id: each.id,
	// 			activated: false,
	// 			creditActivated: false
	// 		};
	// 	});
	// 	this.props.action.deactiveMultipleUser(
	// 		payload,
	// 		() => {
	// 			this.setState({ loading: false });
	// 			message.success(`Deactivated ${rows.length} users`);
	// 		},
	// 		() => this.setState({ loading: false })
	// 	);
	// 	setTimeout(() => {
	// 		this.getListUser();
	// 	}, 2500);
	// }

    add = () => {
        const { form } = this.props;
        // can use data-binding to get
        const keys = form.getFieldValue('keys');
        const nextKeys = keys.concat(id++);
        // can use data-binding to set
        // important! notify form to detect changes
        form.setFieldsValue({
            keys: nextKeys,
        });
    };

    remove = k => {
        const { form } = this.props;
        // can use data-binding to get
        const keys = form.getFieldValue('keys');
        // We need at least one passenger
        // if (keys.length === 1) {
        //     return;
        // }

        // can use data-binding to set
        form.setFieldsValue({
            keys: keys.filter(key => key !== k),
        });
    };

    handleSearchIdlands = (name) => {
        this.props.action.getListIsland(
            () => this.setState({ loading: false }),
            () => this.setState({ loading: false }),
            {
                pagination: false,
                islandName: name
            }
        );
    };

    handleSubmit = e => {
        e.preventDefault();
        // const { setFields } = this.props.form;

        this.props.form.validateFields((err, fields) => {
            if (!err) {
                this.setState({
                    loading: true,
                });

                const createIslandPayload = {
                    islandName: fields["island"],
                    latitude: parseFloat(fields["latitude"]),
                    longitude: parseFloat(fields["longitude"])
                };
                // console.log(createIslandPayload);

                this.props.action.createIslandRequest(
                    createIslandPayload,
                    async (res) => {
                        if (res.id) {
                            message.success('Create island success');

                            this.getListIslandsCities();
                            this.handleCancel();
                        } else {
                            if (res.violations) {
                                // message.error(res.violations[0].message);
                                message.error(res.detail);
                            }
                            else {
                                message.error(res.detail);
                            }
                        }

                        this.setState({
                            loading: false
                        });
                    },
                    () => {
                        this.setState({
                            loading: false
                        });
                    }
                );
            }
        });

    };

	render() {
		const {
			classes,
			store: {
				islands,
                cities
			}
		} = this.props;

		// console.log('store', this.props.store);
		const { loading } = this.state;
        const { getFieldDecorator, getFieldValue } = this.props.form;

		const menu = (
			<Menu>
				<Menu.Item key="restaurant-more-import">
					{/*<Icon type="import" />*/}
					<Button icon="import" type="link">
        				<FormattedMessage id="islands.option.import" defaultMessage="Import" />
        			</Button>
        		</Menu.Item>
        		<Menu.Item key="restaurant-more-download">
        			{/*<Icon type="download" />*/}
                    <Button icon="download" type="link">
                        <FormattedMessage id="islands.option.downloadSampleFile" defaultMessage="Download sample file" />
                    </Button>
        			{/*<BtnExport*/}
        			{/*	data={dataSample}*/}
        			{/*	textBtn="Télécharger une exemple de fichier"*/}
        			{/*	filename="user_sample.csv"*/}
        			{/*/>*/}
        		</Menu.Item>
        		<Menu.Item key="restaurant-more-export">
        			{/*<Icon type="export" />*/}
                    <Button icon="export" type="link">
                        <FormattedMessage id="islands.option.export" defaultMessage="Export" />
                    </Button>
        			{/*<BtnExport data={data} textBtn="Exporter" filename="user.csv" />*/}
        		</Menu.Item>
        	</Menu>
        );

		const routes = [
			{
				breadcrumbName: <FormattedMessage id="settings.breadcumb" defaultMessage="Setting" />
			},
			{
				breadcrumbName: <FormattedMessage id="setting.islandsCities.breadcumb" defaultMessage="Islands & Cities" />
			}
		];

		return (
			<>
				<Breadcrumb
					breadcrumb={routes}
					// title={<FormattedMessage id="user.breadcrum.title.user" defaultMessage="Users" />}
				/>
				<Card style={{ minHeight: 360, marginTop: '16px' }} bordered={false}>
					<Row type="flex" align="middle" justify="space-between">
						<Col md={6}>
							<h3>
								<strong>
									<FormattedMessage id="setting.islandsCities.title" defaultMessage="Islands & Cities" />
								</strong>
							</h3>
						</Col>
						<Col md={18}>
							<Row type="flex" justify="end" align="middle">
								<Col>
									<Search
										placeholder="Search islands"
										className={classes.btnSearch}
										onSearch={value => this.handleSearchIdlands(value)}
									/>
								</Col>
								<Col>
									<Button type="link" icon="plus" onClick={this.showModal}>
                                        <FormattedMessage
                                            id="setting.islandsCities.createButton"
                                            defaultMessage="Create island"/>
                                    </Button>
								</Col>
								{/*<Col>*/}
								{/*	<Dropdown overlay={menu} trigger="click ">*/}
								{/*		<Button type="link" icon="more" />*/}
								{/*	</Dropdown>*/}
								{/*</Col>*/}
							</Row>
						</Col>
					</Row>
					<Row>
						<Spin spinning={loading}>
							<Table
                                islandsData={islands.data}
                                citiesData={cities.data}
                                onSelectChange={this.onSelectChange}
                                getListIslandsCities={this.getListIslandsCities} />
						</Spin>
					</Row>
                    <Form>
                        <Modal
                            title={
                                <FormattedMessage
                                    id="setting.islandsCities.CreateIslandModal.title"
                                    defaultMessage="Create island"/>
                            }
                            visible={this.state.visible}
                            footer={[
                                <Button
                                    // size="large"
                                    onClick={() => {
                                        this.handleCancel();
                                    }}>
                                    <FormattedMessage
                                        id="setting.islandsCities.CreateIslandModal.cancelButton"
                                        defaultMessage="Cancel"/>
                                </Button>,
                                <Button
                                    type="primary"
                                    // size="large"
                                    htmlType="submit"
                                    onClick={this.handleSubmit}
                                    loading={this.state.loading}
                                    style={{
                                        float: 'right'
                                    }}>
                                    <FormattedMessage
                                        id="setting.islandsCities.CreateIslandModal.createButton"
                                        defaultMessage="Create"/>
                                </Button>
                            ]}
                            onOk={this.handleSubmit}
                            onCancel={this.handleCancel}
                            destroyOnClose>
                            <div>
                                {/*<CreateUser handleCancel={this.handleCancel} getListUser={this.props.getListUser} />*/}
                                <Form.Item label={
                                    <FormattedMessage
                                        id="setting.islandsCities.CreateIslandModal.islandName"
                                        defaultMessage="Island"/>}>
                                    {getFieldDecorator('island', {
                                        rules: [{ required: true, message: 'Required field' }]
                                    })(
                                        <Input
                                            placeholder="Island name"
                                            // size="large"
                                            autoComplete={false}/>)}
                                </Form.Item>
                                <Form.Item label={
                                    <FormattedMessage
                                        id="setting.islandsCities.CreateIslandModal.latitude"
                                        defaultMessage="Latitude"/>}>
                                    {getFieldDecorator('latitude', {
                                        rules: [
                                            {
                                                validator: (rule, value, callback) => {
                                                    if (value && (parseInt(value) === parseFloat(value))) {
                                                        callback('The latitude must be a float');
                                                    }
                                                    callback();
                                                }
                                            },
                                            {
                                                pattern: /^[-]?(([0-8]?[0-9])\.(\d+))|(90(\.0+)?)$/,
                                                message: 'The latitude must be a fraction between -90 and 90!'
                                            },
                                            {
                                                required: true,
                                                message: 'Please input your restaurant latitude!'
                                            }
                                        ]
                                    })(<NumericInput/>)}
                                </Form.Item>
                                <Form.Item label={
                                    <FormattedMessage
                                        id="setting.islandsCities.CreateIslandModal.longitude"
                                        defaultMessage="Longitude"/>}>
                                    {getFieldDecorator('longitude', {
                                        rules: [
                                            {
                                                validator: (rule, value, callback) => {
                                                    if (value && (parseInt(value) === parseFloat(value))) {
                                                        callback('The longitude must be a float');
                                                    }
                                                    callback();
                                                }
                                            },
                                            {
                                                pattern: /^[-]?((((1[0-7][0-9])|([0-9]?[0-9]))\.(\d+))|180(\.0+)?)$/,
                                                message: 'The longitude must be a fraction between -180 and 180!'
                                            },
                                            {
                                                required: true,
                                                message: 'Please input your restaurant longitude!'
                                            }
                                        ]
                                    })(<NumericInput/>)}
                                </Form.Item>
                            </div>
                        </Modal>
                    </Form>
				</Card>
			</>
		);
	}
}
