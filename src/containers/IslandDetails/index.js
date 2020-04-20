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
    Form,
    Typography, Divider
} from 'antd';

import FieldEditor from 'src/components/Input/Edit';
import EditNumeric from 'src/components/Input/EditNumeric';

import { FormattedMessage } from 'react-intl';
import { getListTowns, createTownsRequest } from 'src/redux/actions/town.js';
import {
    getIslandDetails,
    getListIsland,
    createIslandRequest,
    updateIslandRequest
} from 'src/redux/actions/island';

const { Search } = Input;
const { confirm } = Modal;
const { Text, Title } = Typography;

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
import CONSTANTS from '../../constants';

function numberWithSpaces(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
}

function mapStateToProps(state) {
    return {
        store: {
            islandDetails: state.islands.details.data,
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
                getIslandDetails,
                getListTowns,
                createIslandRequest,
                createTownsRequest,
                updateIslandRequest
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
export default class IslandDetailsLayout extends PureComponent {
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
        form.setFieldsValue({ keys: [] });
        // console.log(keys);
        this.setState({
            visible: false
        });
    };

    getListIslandsCities = filter => {
        this.props.action.getIslandDetails(
            this.props.id,
            () => this.setState({ loading: false }),
            () => this.setState({ loading: false })
        );
        this.props.action.getListTowns(
            () => this.setState({ loading: false }),
            () => this.setState({ loading: false }),
            {
                pagination: false,
                island: this.props.id
            }
        );
    };

    handleSearchCities = (name) => {
        // this.props.action.getIslandDetails(
        //     this.props.id,
        //     () => this.setState({ loading: false }),
        //     () => this.setState({ loading: false })
        // );
        this.props.action.getListTowns(
            () => this.setState({ loading: false }),
            () => this.setState({ loading: false }),
            {
                pagination: false,
                island: this.props.id,
                cityName: name
            }
        );
    };

    onSelectChange = selectedRows => {
        // console.log('selectedRows', selectedRows);
        this.setState({ selectedRows });
    };

    add = () => {
        const { form } = this.props;
        // can use data-binding to get
        const keys = form.getFieldValue('keys');
        const nextKeys = keys.concat(id++);
        // can use data-binding to set
        // important! notify form to detect changes
        form.setFieldsValue({
            keys: nextKeys
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
            keys: keys.filter(key => key !== k)
        });
    };

    handleSubmit = e => {
        e.preventDefault();
        // const { setFields } = this.props.form;

        this.props.form.validateFields((err, fields) => {
                if (!err) {
                    this.setState({
                        loading: true
                    });

                    const createCityPayload = {
                        cityName: fields.cityName.trim(),
                        latitude: parseFloat(fields.latitude),
                        longitude: parseFloat(fields.longitude),
                        island: '/api/islands/' + this.props.id
                    };

                    this.props.action.createTownsRequest(
                        createCityPayload,
                        async (res) => {
                            if (res.id) {
                                message.success('Create city success');

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
                        });
                }
            },
            () => {
                this.setState({
                    loading: false
                });
            }
        );
    };

    handleUpdateInformation = (name, value) => {
        const { id } = this.props;
        const payload = {
            id,
            [name]: value.constructor === String ? value.trim() : value
        };
        this.props.action.updateIslandRequest(
            payload,
            next => {
                this.setState({ loading: false });
                if (next.title !== 'An error occurred') {
                    this.props.action.getIslandDetails(
                        id,
                        () => this.setState({ loading: false }),
                        () => this.setState({ loading: false })
                    );
                } else {
                    message.error(next.detail);
                }
            },
            nextErr => this.setState({ loading: false })
        );
    };

    render() {
        const {
            classes,
            store: {
                islandDetails,
                cities
            }
        }
            = this.props;

        // console.log('store', this.props.store);
        const { loading } = this.state;
        const { getFieldDecorator, getFieldValue } = this.props.form;

        const menu = (
            <Menu>
                <Menu.Item key="restaurant-more-import">
                    {/*<Icon type="import" />*/}
                    <Button icon="import" type="link">
                        <FormattedMessage id="islands.option.import" defaultMessage="Import"/>
                    </Button>
                </Menu.Item>
                <Menu.Item key="restaurant-more-download">
                    {/*<Icon type="download" />*/}
                    <Button icon="download" type="link">
                        <FormattedMessage id="islands.option.downloadSampleFile"
                                          defaultMessage="Download sample file"/>
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
                        <FormattedMessage id="islands.option.export" defaultMessage="Export"/>
                    </Button>
                    {/*<BtnExport data={data} textBtn="Exporter" filename="user.csv" />*/}
                </Menu.Item>
            </Menu>
        );

        const routes = [
            {
                breadcrumbName: <FormattedMessage id="settings.breadcumb" defaultMessage="Setting"/>
            },
            {
                breadcrumbName: <FormattedMessage id="setting.islandsCities.breadcumb"
                                                  defaultMessage="Islands & Cities"/>,
                path: '/islands'
            },
            {
                breadcrumbName: islandDetails.islandName
            }
        ];

        getFieldDecorator('keys', { initialValue: [] });
        const keys = getFieldValue('keys');
        const formItems = keys.map((k, index) => (
            <Form.Item
                label={index === 0 ? 'Cities' : ''}
                required={false}
                key={k}
            >
                {getFieldDecorator(`cities[${k}]`, {
                    validateTrigger: ['onChange', 'onBlur'],
                    rules: [
                        {
                            required: true,
                            whitespace: true,
                            message: 'Please input city\'s name or delete this field.'
                        }
                    ]
                })(<Input placeholder="City name" style={{ width: '60%', marginRight: 8 }}/>)}
                {/*{keys.length > 1 ? (*/}
                <Icon
                    className="dynamic-delete-button"
                    type="minus-circle-o"
                    onClick={() => this.remove(k)}
                />
                {/*) : null}*/}
            </Form.Item>
        ));

        return (
            <>
                <Breadcrumb
                    breadcrumb={routes}
                    // title={<FormattedMessage id="user.breadcrum.title.user" defaultMessage="Users" />}
                />
                <Card style={{ minHeight: 360, marginTop: '16px' }} bordered={false}>
                    <Row type="flex" align="middle" justify="space-between">
                        <Col>
                            <Row type="flex" align="middle">
                                {/*<HeaderContent*/}
                                {/*    name={detail.restaurantName}*/}
                                {/*    id={`#${detail.user.customId}`} />*/}
                                <h3>
                                    <strong>
                                        {islandDetails.islandName}
                                        <Divider type="vertical"/>#{islandDetails.id}
                                    </strong>
                                </h3>
                            </Row>
                        </Col>
                    </Row>
                    <Row type="flex" align="top" justify="space-between" gutter={36}
                         style={{ marginTop: '20px', marginBottom: '20px' }}>
                        <Col span={12}>
                            {/*<div style={{ padding: '0 10%' }}>*/}
                            <Row type='flex' justify='space-between' className={classes.row}>
                                <Col span={5}>
                                    <Text strong>
                                        <FormattedMessage
                                            id="setting.islandsDetails.islandName"
                                            defaultMessage="Island's name"/>
                                    </Text>
                                </Col>
                                <Col span={19}>
                                    <FieldEditor
                                        value={islandDetails.islandName || ''}
                                        name="islandName"
                                        rules={[
                                            {
                                                required: true,
                                                message: "Please input your island's name!"
                                            }
                                        ]}
                                        handleSave={this.handleUpdateInformation}
                                    />
                                </Col>
                            </Row>
                            <Row type='flex' justify='space-between' className={classes.row}>
                                <Col span={5}>
                                    <Text strong>
                                        <FormattedMessage
                                            id="setting.islandsDetails.latitude"
                                            defaultMessage="Latitude"/>
                                    </Text>
                                </Col>
                                <Col span={19}>
                                    <EditNumeric
                                        value={islandDetails.latitude || ''}
                                        name="latitude"
                                        negative={true}
                                        float={true}
                                        // addonBefore="+689"
                                        rules={[
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
                                                message: 'Please input your city latitude!'
                                            }]}
                                        output="number"
                                        onChange={this.onChange}
                                        handleSave={this.handleUpdateInformation}/>
                                </Col>
                            </Row>
                            <Row type='flex' justify='space-between' className={classes.row}>
                                <Col span={5}>
                                    <Text strong>
                                        <FormattedMessage
                                            id="setting.islandsDetails.longitude"
                                            defaultMessage="Longitude"/>
                                    </Text>
                                </Col>
                                <Col span={19}>
                                    <EditNumeric
                                        value={islandDetails.longitude || ''}
                                        name="longitude"
                                        negative={true}
                                        float={true}
                                        // addonBefore="+689"
                                        rules={[
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
                                                message: 'Please input your city longitude!'
                                            }
                                        ]}
                                        output="number"
                                        onChange={this.onChange}
                                        handleSave={this.handleUpdateInformation}/>
                                </Col>
                            </Row>
                        </Col>
                        {/*</div>*/}
                        <Col span={12}>
                            <Row gutter={10} style={{ paddingLeft: '30px' }}>
                                <Col span={8}>
                                    <Card className={[classes.cardInfo]}>
                                        <Row type="flex" align="middle" justify="space-between">
                                            {/*<h5>*/}
                                            <strong style={{ whiteSpace: 'nowrap' }}>
                                                <FormattedMessage
                                                    id="settings.islandsCities.table.cities"
                                                    defaultMessage="No. Cities"/>
                                            </strong>
                                            {/*</h5>*/}
                                            <div style={{ width: '100%', textAlign: 'right' }}>
                                                <Text>
                                                    {islandDetails.cities ? numberWithSpaces(islandDetails.cities.length) : 0}
                                                </Text>
                                            </div>
                                        </Row>
                                    </Card>
                                </Col>
                                <Col span={8}>
                                    <Card className={[classes.cardInfo]}>
                                        <Row type="flex" align="middle" justify="space-between">
                                            {/*<h5>*/}
                                            <strong style={{ whiteSpace: 'nowrap' }}>
                                                <FormattedMessage
                                                    id="settings.islandsCities.table.companies"
                                                    defaultMessage="No. Companies"/>
                                            </strong>
                                            {/*</h5>*/}
                                            <div style={{ width: '100%', textAlign: 'right' }}>
                                                <Text>
                                                    {islandDetails.companies ? numberWithSpaces(islandDetails.companies.length) : 0}
                                                </Text>
                                            </div>
                                        </Row>
                                    </Card>
                                </Col>
                                <Col span={8}>
                                    <Card className={[classes.cardInfo]}>
                                        <Row type="flex" align="middle" justify="space-between">
                                            {/*<h5>*/}
                                            <strong style={{ whiteSpace: 'nowrap' }}>
                                                <FormattedMessage
                                                    id="settings.islandsCities.table.restaurants"
                                                    defaultMessage="No. Restaurants"/>
                                            </strong>
                                            {/*</h5>*/}
                                            <div style={{ width: '100%', textAlign: 'right' }}>
                                                <Text>
                                                    {islandDetails.restaurants ? numberWithSpaces(islandDetails.restaurants.length) : 0}
                                                </Text>
                                            </div>
                                        </Row>
                                    </Card>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                    <Row type="flex" align="middle" justify="space-between">
                        <Col span={10}>
                            <strong>
                                <FormattedMessage id="setting.islandsCities.citiesList"
                                                  defaultMessage="List of cities"/>
                            </strong>
                        </Col>
                        <Col span={14}>
                            <Row type="flex" justify="end" align="middle">
                                <Col>
                                    <Search
                                        placeholder="Search cities"
                                        className={classes.btnSearch}
                                        onSearch={value => this.handleSearchCities(value)}
                                    />
                                </Col>
                                <Col>
                                    <Button type="link" icon="plus" onClick={this.showModal}>
                                        <FormattedMessage
                                            id="setting.islandsDetails.createButton"
                                            defaultMessage="Create city"/>
                                    </Button>
                                </Col>
                                {/*<Col>*/}
                                {/*    <Dropdown overlay={menu} trigger="click ">*/}
                                {/*        <Button type="link" icon="more"/>*/}
                                {/*    </Dropdown>*/}
                                {/*</Col>*/}
                            </Row>
                        </Col>
                    </Row>
                    <Row>
                        <Spin spinning={loading}>
                            <Table
                                data={cities.data}
                                // citiesData={cities.data}
                                onSelectChange={this.onSelectChange}
                                getListIslandsCities={this.getListIslandsCities}/>
                        </Spin>
                    </Row>
                    <Form>
                        <Modal
                            title={
                                <FormattedMessage
                                    id="setting.islandsCities.CreateCityModal.title"
                                    defaultMessage="Create city"/>
                            }
                            visible={this.state.visible}
                            footer={[
                                <Button
                                    // size="large"
                                    onClick={() => {
                                        this.handleCancel();
                                    }}>
                                    <FormattedMessage
                                        id="setting.islandsCities.CreateCityModal.cancelButton"
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
                                        id="setting.islandsCities.CreateCityModal.createButton"
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
                                        id="setting.islandsCities.CreateCityModal.cityName"
                                        defaultMessage="City"/>}>
                                    {getFieldDecorator('cityName', {
                                        rules: [{ required: true, message: 'Required field' }]
                                    })(
                                        <Input
                                            placeholder="City name"
                                            // size="large"
                                            autoComplete={false}/>)}
                                </Form.Item>
                                <Form.Item label={
                                    <FormattedMessage
                                        id="setting.islandsCities.CreateCityModal.latitude"
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
                                        id="setting.islandsCities.CreateCityModal.longitude"
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
                                {/*{formItems}*/}
                                {/*<Form.Item>*/}
                                {/*    <Button type="dashed" onClick={this.add} style={{ width: '60%' }}>*/}
                                {/*        <Icon type="plus" />*/}
                                {/*        <FormattedMessage*/}
                                {/*            id="setting.islandsCities.CreateIslandModal.addCities"*/}
                                {/*            defaultMessage="Add cities"/>*/}
                                {/*    </Button>*/}
                                {/*</Form.Item>*/}
                            </div>
                        </Modal>
                    </Form>
                </Card>
            </>
        );
    }
}
