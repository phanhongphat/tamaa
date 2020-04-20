import React, { PureComponent, Fragment } from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import NormalDay from 'src/components/Conditions/NormalDay';
import ExceptionDay from 'src/components/Conditions/ExceptionDay';
import OpenHouse from 'src/components/OpenHouse';


import injectSheet from 'react-jss';
import {
    Button,
    Col,
    Divider,
    Dropdown,
    Icon,
    Switch,
    Layout,
    Row,
    Typography,
    Menu,
    Form,
    Input,
    Select,
    DatePicker,
    Checkbox,
    TimePicker,
    message,
    Card,
    Modal
} from 'antd';

import { Router } from 'src/routes';
import {
    // getListRestaurant,
    createRestaurant
} from 'src/redux/actions/restaurant.js';
import { uploadRestaurantImages } from 'src/redux/actions/restaurantUploadImages';
import { uploadRestaurantImages1 } from 'src/redux/actions/restaurantImages';
import { getListTowns } from 'src/redux/actions/town.js';
import { getListIsland } from 'src/redux/actions/island.js';

import Breadcrumb from 'src/components/Breadcrumb';
import HeaderContent from 'src/components/HeaderContent';
import UploadImages from 'src/components/Upload/Images';
import NumericInput from 'src/components/Input/NumericInput';

import styles from './styles';
import { FormattedMessage } from 'react-intl';

const { Option } = Select;
const { Text, Title, Paragraph } = Typography;

const timeFormat = 'HH:mm';

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
                // getListRestaurant,
                createRestaurant,
                getListTowns,
                getListIsland,
                uploadRestaurantImages
            },
            dispatch
        )
    };
};

function hasErrors(fieldsError) {
    return Object.keys(fieldsError).some(field => fieldsError[field]);
}

@injectSheet(styles)
@connect(
    mapStateToProps,
    mapDispatchToProps
)
@Form.create()
export default class RestaurantContainer extends PureComponent {
    static propTypes = {
        classes: PropTypes.object.isRequired,
        // slug: PropTypes.string.isRequired,
        // store
        store: PropTypes.shape({
            // restaurant: PropTypes.object.isRequired,
            islands: PropTypes.object.isRequired,
            cities: PropTypes.object.isRequired
        }),
        // action
        action: PropTypes.shape({
            createRestaurant: PropTypes.func.isRequired
        })
    };

    static defaultProps = {};

    state = {
        loading: false,
        loadingSubmit: false,
        previewVisible: false,
        previewImage: '',
        fileAvatar: [],
        fileList: [],
        firstCity: null,
        photos: {},
        islandSelected: null,
        openingHour: {
            monday: ['00:00-00:00'],
			tuesday: ['00:00-00:00'],
			wednesday: ['00:00-00:00'],
			thursday: ['00:00-00:00'],
			friday: ['00:00-00:00'],
			saturday: ['00:00-00:00'],
			sunday: ['00:00-00:00']
        }
    };

    getOpeningHours = e => {
        return {
            ...this.state.normalDay,
            exceptions: { ...this.state.exceptionDay }
        };
    };

    getNormalDay = days => {
        this.setState({ normalDay: { ...days } });

    };

    getExceptionDay = days => {
        this.setState({ exceptionDay: { ...days } });
    };

    // onGetStateChange = (name, value) => {
    //     this.setState({ [name]: value });
    // };

    handleSubmit = e => {
        this.setState({ loadingSubmit: true });
        e.preventDefault();
        const { setFields } = this.props.form;

        // console.log(this.state.normalDay, this.state.exceptionDay);

        this.props.form.validateFieldsAndScroll((err, fieldsValue) => {
            if (!err) {
                const payload = {
                    // required
                    restaurantName: fieldsValue['restaurantName'],
                    email: fieldsValue['email'],
                    longitude: parseFloat(fieldsValue['longitude']),
                    latitude: parseFloat(fieldsValue['latitude']),
                    phoneNumber1: '+689' + fieldsValue['phoneNumber1'],
                    managerFirstName: fieldsValue['managerFirstName'],
                    managerLastName: fieldsValue['managerLastName'],
                    managerPhoneNumber: '+689' + fieldsValue['managerPhoneNumber'],
                    address: fieldsValue['address'],
                    joinDate: fieldsValue['joinDate'].format('YYYY-MM-DD'),
                    refundDate: fieldsValue['refundDate'],
                    cardAccepted: fieldsValue['cardAccepted'] ? fieldsValue['cardAccepted'] : false,
                    companyRegistration: fieldsValue['companyRegistration'],
                    bankName: fieldsValue['bankName'],
                    bankAccountNumber: fieldsValue['bankAccountNumber'],
                    // avatar: fieldsValue['avatar'] ? fieldsValue['avatar'] : 'https://picsum.photos/id/352/300/300',
                    salesCommissionPolicy: fieldsValue['salesCommissionPolicy'],
                    openingHours: {
                        ...this.state.openingHour
                    },
                    city: '/api/cities/' + fieldsValue['cityId'],
                    island: '/api/islands/' + fieldsValue['islandId'],
                    cardAccepted: fieldsValue['cardAccepted'] ? fieldsValue['cardAccepted'] : false,
                    // nullable
                    description: fieldsValue['description'] ? fieldsValue['description'] : null,
                    phoneNumber2: fieldsValue['phoneNumber2'] ? '+689' + fieldsValue['phoneNumber2'] : null,
                    facebook: fieldsValue['facebook'] ? fieldsValue['facebook'] : null,
                    instagram: fieldsValue['instagram'] ? fieldsValue['instagram'] : null,
                    website: fieldsValue['website'] ? fieldsValue['website'] : null,
                    managerFirstName: fieldsValue['managerFirstName'] ? fieldsValue['managerFirstName'] : null,
                    managerLastName: fieldsValue['managerLastName'] ? fieldsValue['managerLastName'] : null,
                    managerPhoneNumber: fieldsValue['managerPhoneNumber'] ? '+689' + fieldsValue['managerPhoneNumber'] : null,
                    address: fieldsValue['address']  ? fieldsValue['address'] : null,
                    joinDate: fieldsValue['joinDate'].format('YYYY-MM-DD') ? fieldsValue['joinDate'].format('YYYY-MM-DD') : null,
                    refundDate:  fieldsValue['refundDate'] ? fieldsValue['refundDate'] : null,
                    corporateName: fieldsValue['corporateName'] ? fieldsValue['corporateName'] : null,
                    salesCommissionPolicy: fieldsValue['salesCommissionPolicy'] ? fieldsValue['salesCommissionPolicy'] : null,
                    companyRegistration: fieldsValue['companyRegistration'] ? fieldsValue['companyRegistration'] : null,
                    bankName: fieldsValue['bankName'] ? fieldsValue['bankName'] : null,
                    bankAccountNumber: fieldsValue['bankAccountNumber'] ? fieldsValue['bankAccountNumber'] : null,
                    // openingHours: {
                    //     ...this.state.normalDay,
                    //     exceptions: { ...this.state.exceptionDay }
                    // },
                };
                // console.log('Received values of form: ', payload);
                // return
                this.setState({ loading: true });
                this.props.action.createRestaurant(
                    payload,
                    next => {
                        const { id, user } = next;
                        if (next.title === 'An error occurred') {
                            message.error(next.detail.toString());
                            this.setState({ loadingSubmit: false });
                        }
                        else {
                            if (this.state.fileList.length > 0) {
                                const photoPayload = {
                                    id: user.id,
                                    files: this.state.fileList.map((each, index) => {
                                        return {
                                            field: `photo[${index}]`,
                                            file: each.originFileObj
                                        };
                                    })
                                };

                                if (this.state.fileAvatar.length) {
                                    photoPayload.files.push({
                                        field: 'avatar',
                                        file: this.state.fileAvatar[0].originFileObj
                                    });
                                }

                                this.props.action.uploadRestaurantImages(
                                    photoPayload,
                                    nextPhoto => {
                                        let failedList = nextPhoto.filter((each) => each.status === 'fail').map((each) => each.file_name);
                                        if (failedList.length) {
                                            message.error("List images upload failed" + failedList.toString(),
                                                2
                                            );
                                        }
                                        Router.pushRoute(
                                            user.id ?
                                                `/restaurants-detail/${id}`
                                                : '/restaurants');
                                    },
                                    () => {
                                        this.setState({
                                            loading: false,
                                            loadingSubmit: false
                                        });
                                    }
                                );
                            }
                            else {
                                Router.pushRoute(
                                    user.id ?
                                        `/restaurants-detail/${id}`
                                        : '/restaurants');
                            }
                        }
                        this.setState({
                            loading: false,
                            loadingSubmit: false
                        });
                    },
                    nextErr => this.setState({ loading: false, loadingSubmit: false })
                );
            } else {
                // window.scrollTo();
                this.setState({ loadingSubmit: false });
                message.error(err);
            }
        });
    };

    handleReset = () => {
        this.props.form.resetFields();
    };

    handleChange = (info) => {
        const { status, name } = info.file;

        if (status === 'done') {
            message.success(`${name} file uploaded successfully.`);
        } else if (status === 'error') {
            message.error(`${name} file upload failed.`);
        }

        let fileList = [...info.fileList];

        fileList = fileList.filter((eachFile) => {
                return ((eachFile.type === 'image/jpeg' || eachFile.type === 'image/png') && eachFile.size / 1024 / 1024 < 2);
            }
        );

        if (fileList.length > 10) {
            fileList = fileList.slice(0, 10);
        }

        this.setState({ fileList });
    };

    handleChangeAvatar = (info) => {
        const { status, name } = info.file;

        if (status === 'done') {
            message.success(`${name} file uploaded successfully.`);
        } else if (status === 'error') {
            message.error(`${name} file upload failed.`);
        }

        let fileList = [...info.fileList];

        fileList = fileList.filter((eachFile) => {
                return ((eachFile.type === 'image/jpeg' || eachFile.type === 'image/png') && eachFile.size / 1024 / 1024 < 2);
            }
        );

        if (fileList.length > 1) {
            fileList = fileList.slice(-1);
        }

        this.setState({ fileAvatar: fileList });
    };

    componentDidMount() {
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
        //         islands: 'api/islands/' + islandSelected,
        //         pagination: false
        //     }
        // );
    }

    getListTowns(islandSelected) {
        this.props.action.getListTowns(
            () => {
                this.setState({ loading: false });
            },
            () => {
                this.setState({ loading: false });
            },
            {
                island: islandSelected,
                pagination: false
            }
        );
    }

    setDataOutput = data => {
        const noException = ({ monday, tuesday, wednesday, thursday, friday, saturday, sunday, ...rest }) => rest;
        const exceptions = noException(data);

        const normal = {
            monday: data.monday,
            tuesday: data.tuesday,
            wednesday: data.wednesday,
            thursday: data.thursday,
            friday: data.friday,
            saturday: data.saturday,
            sunday: data.sunday
        };
        this.setState({ openingHour: { ...normal, exceptions } });
    };

    render() {
        const { getFieldDecorator, getFieldsError, getFieldValue } = this.props.form;

        const { fileAvatar, fileList, firstCity, loadingSubmit } = this.state;

        // getFieldDecorator('keys', { initialValue: [] });
        // const keys = getFieldValue('keys');
        // console.log(() => this.openingHours())
        const {
            classes,
            store: {
                restaurant = {},
                islands = {},
                cities = {}
            }
        } = this.props;

        const menu = (
            <Menu>
                <Menu.Item key="restaurant-create-reset" onClick={this.handleReset}>
                    <Icon type="undo"/>
                    <FormattedMessage id="restaurants.create.reset" defaultMessage="Reset"/>
                </Menu.Item>
            </Menu>
        );

        const routes = [
            {
                breadcrumbName:
                    <FormattedMessage
                        id="restaurants.create.breadcrumb"
                        defaultMessage="Restaurants"/>
            }
        ];

        const formItemLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 24 },
                md: { span: 8 }
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 24 },
                md: { span: 16 }
            }
        };

        const formItemLayoutWithOutLabel = {
            wrapperCol: {
                xs: { span: 24, offset: 0 },
                sm: { span: 24, offset: 0 },
                md: { span: 16, offset: 8 }
            }
        };

        return (
            <div>
                <Breadcrumb
                    breadcrumb={routes}
                    //  title="ss"
                />
                <Card style={{ minHeight: 360, marginTop: '16px' }} bordered={false}>
                    <Form {...formItemLayout} onSubmit={this.handleSubmit}>
                        <Col xl={24} lg={24} md={24}>
                            {/* <Col span={16} offset={2}> */}
                            <Row type="flex" justify="space-between" align="middle">
                                {/*<HeaderContent name="Create Restaurant"/>*/}
                                <h3>
                                    <strong>
                                        <FormattedMessage
                                            id="restaurants.create.createRestaurant"
                                            defaultMessage="Create restaurant"/>
                                    </strong>
                                </h3>
                                <Dropdown overlay={menu} trigger="click">
                                    <Icon type="more"/>
                                </Dropdown>
                            </Row>
                            <Divider/>
                            <Row type="flex" justify="space-between">
                                <Col md={6} sm={24}/>
                                <Col md={18} sm={24}>
                                    <Form.Item
                                        labelAlign="left"
                                        label={
                                            <FormattedMessage
                                                id="restaurants.create.email"
                                                defaultMessage="Email"/>
                                        }>
                                        {getFieldDecorator('email', {
                                            rules: [
                                                {
                                                    type: 'email',
                                                    message: 'The input is not valid E-mail!'
                                                },
                                                {
                                                    required: true,
                                                    message: 'Please input your E-mail!'
                                                }
                                            ]
                                        })(<Input type="email"/>)}
                                    </Form.Item>

                                    <Form.Item {...formItemLayoutWithOutLabel}>
                                        <Paragraph style={{lineHeight: 'normal'}}>
                                            <FormattedMessage
                                                id="restaurants.create.notificationUnderEmail"
                                                defaultMessage="Email password will be automatically generated and
                                                    sent to the company's email when the account is created"/>
                                        </Paragraph>
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row type="flex" justify="space-between">
                                <Col span={6}>
                                    <FormattedMessage
                                        id="restaurants.create.avatar"
                                        defaultMessage="Avatar"/>
                                </Col>
                                <Col span={18}>
                                    <UploadImages
                                        max={1}
                                        fileList={fileAvatar}
                                        handleChange={this.handleChangeAvatar}/>
                                </Col>
                            </Row>
                            <Divider/>

                            <Row type="flex" justify="space-between">
                                <Col lg={6} md={24} sm={24}>
                                    <FormattedMessage
                                        id="restaurants.create.information"
                                        defaultMessage="Information"/>
                                </Col>
                                <Col lg={18} md={24} sm={24}>
                                    <Form.Item
                                        label={
                                            <FormattedMessage
                                                id="restaurants.create.restaurantName"
                                                defaultMessage="Name"/>}
                                        labelAlign="left">
                                        {getFieldDecorator('restaurantName', {
                                            rules: [
                                                {
                                                    required: true,
                                                    message: 'Please input your restaurant name!'
                                                }
                                            ]
                                        })(<Input/>)}
                                    </Form.Item>
                                    <Form.Item
                                        label={
                                            <FormattedMessage
                                                id="restaurants.create.description"
                                                defaultMessage="Description"/>}
                                        labelAlign="left">
                                        {getFieldDecorator('description', {
                                            rules: [
                                                {
                                                    max: 80,
                                                    min: 17,
                                                    message: 'Description must contains 17 - 80 characters'
                                                },
                                                // {
                                                //     required: true,
                                                //     message: 'Please input your restaurant description!'
                                                // }
                                            ]
                                        })(<Input.TextArea/>)}
                                    </Form.Item>
                                    <Form.Item
                                        label={
                                            <FormattedMessage
                                                id="restaurants.create.phoneNumber"
                                                defaultMessage="Phone number"/>}
                                        labelAlign="left">
                                        {getFieldDecorator('phoneNumber1', {
                                            rules: [{
                                                required: true,
                                                message: 'Please input your phone number!'
                                            }, {
                                                min: 7,
                                                max: 9,
                                                message: 'Le numéro de téléphone doit comporter entre 7 et 9 caractères (ne pas inclure +689)'
                                            }]
                                        })(
                                            <NumericInput
                                                negative={false}
                                                float={false}
                                                addonBefore="+689"
                                                className={classes.inputGroup}
                                                placeholder="Phone number 1"/>
                                        )}
                                    </Form.Item>
                                    <Form.Item
                                        {...formItemLayoutWithOutLabel}
                                        label=""
                                        labelAlign="left">
                                        {getFieldDecorator('phoneNumber2', {
                                            rules: [{
                                                min: 7,
                                                max: 9,
                                                message: 'Le numéro de téléphone doit comporter entre 7 et 9 caractères (ne pas inclure +689)'
                                            }]
                                        })(
                                            <NumericInput
                                                negative={false}
                                                float={false}
                                                addonBefore="+689"
                                                className={classes.inputGroup}
                                                placeholder="Phone number 2"/>
                                        )}
                                    </Form.Item>
                                    <Form.Item
                                        label={
                                            <FormattedMessage
                                                id="restaurants.create.address"
                                                defaultMessage="Address"/>}
                                        labelAlign="left">
                                        {getFieldDecorator('address', {
                                            rules: [
                                                {
                                                    required: true,
                                                    message: 'Please input your restaurant address!'
                                                }
                                            ]
                                        })(<Input/>)}
                                    </Form.Item>
                                    <Form.Item
                                        label={
                                            <FormattedMessage
                                                id="restaurants.create.island"
                                                defaultMessage="Island"/>}
                                        labelAlign="left">
                                        {getFieldDecorator('islandId', {
                                            rules: [
                                                {
                                                    required: true,
                                                    message: 'Please input your restaurant place!'
                                                }
                                            ]
                                        })(
                                            <Select
                                                placeholder="Please select a island"
                                                onChange={(islandSelected) => {
                                                    this.setState({ islandSelected });
                                                    this.getListTowns(islandSelected);
                                                }}>
                                                {
                                                    islands.data.map((island) =>
                                                        <Option value={island.id}>
                                                            {island.islandName}
                                                        </Option>
                                                    )
                                                }
                                            </Select>
                                        )}
                                    </Form.Item>
                                    <Form.Item
                                        label={
                                            <FormattedMessage
                                                id="restaurants.create.city"
                                                defaultMessage="City"/>}
                                        labelAlign="left">
                                        {getFieldDecorator('cityId', {
                                            rules: [
                                                {
                                                    required: true,
                                                    message: 'Please input your restaurant place!'
                                                }
                                            ]
                                        })(
                                            <Select
                                                placeholder="Please select a city"
                                                // value={cities.data[0]}
                                                disabled={this.state.islandSelected === null}>
                                                {
                                                    cities.data.map((city) =>
                                                        <Option value={city.id}>
                                                            {city.cityName}
                                                        </Option>
                                                    )
                                                }
                                            </Select>
                                        )}
                                    </Form.Item>
                                    <Form.Item
                                        label={
                                            <FormattedMessage
                                                id="restaurants.create.latitude"
                                                defaultMessage="Latitude"/>}
                                        labelAlign="left">
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
                                    <Form.Item
                                        label={
                                            <FormattedMessage
                                                id="restaurants.create.longitude"
                                                defaultMessage="Longitude"/>}
                                        labelAlign="left">
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
                                    <Form.Item
                                        label={
                                            <FormattedMessage
                                                id="restaurants.create.managerFirstName"
                                                defaultMessage="Manager's first name"/>}
                                        labelAlign="left">
                                        {getFieldDecorator('managerFirstName', {
                                            rules: [
                                                // {
                                                //     required: true,
                                                //     message: 'Please input your manager\'s first name!'
                                                // },
                                                {
                                                    max: 20,
                                                    message: 'First name is too long. It should have 20 characters or less'
                                                }
                                            ]
                                        })(<Input
                                            className={classes.inputGroup}
                                            placeholder="First name"/>)}
                                    </Form.Item>
                                    <Form.Item
                                        label={
                                            <FormattedMessage
                                                id="restaurants.create.managerLastName"
                                                defaultMessage="Manager's last name"/>}
                                        labelAlign="left">
                                        {getFieldDecorator('managerLastName', {
                                            rules: [
                                                // {
                                                //     required: true,
                                                //     message: 'Please input your manager\'s last name!'
                                                // },
                                                {
                                                    max: 20,
                                                    message:
                                                        'Last name is too long. It should have 20 characters or less'
                                                }
                                            ]
                                        })(<Input
                                            className={classes.inputGroup}
                                            placeholder="Last name"/>)}
                                    </Form.Item>
                                    <Form.Item
                                        label={
                                            <FormattedMessage
                                                id="restaurants.create.managerPhoneNumber"
                                                defaultMessage="Manager's phone number"/>}
                                        labelAlign="left">
                                        {getFieldDecorator('managerPhoneNumber', {
                                            rules: [
                                                {
                                                //     required: true,
                                                //     message: 'Please input your manager\'s phone number!'
                                                // }, {
                                                    min: 7,
                                                    max: 9,
                                                    message: 'Le numéro de téléphone doit comporter entre 7 et 9 caractères (ne pas inclure +689)'
                                                }
                                            ]
                                        })(<NumericInput
                                            negative={false}
                                            float={false}
                                            addonBefore="+689"
                                            style={{ width: '100%' }}/>)}
                                    </Form.Item>
                                    <Form.Item
                                        label={
                                            <FormattedMessage
                                                id="restaurants.create.corporateName"
                                                defaultMessage="Corporate name"/>}
                                        labelAlign="left">
                                        {getFieldDecorator('corporateName', {
                                            rules: [
                                                // {
                                                //     required: true,
                                                //     message: 'Please input your corporate name!'
                                                // }
                                            ]
                                        })(<Input/>)}
                                    </Form.Item>
                                    <Form.Item
                                        label={
                                            <FormattedMessage
                                                id="restaurants.create.companyRegistration"
                                                defaultMessage="Company registration"/>}
                                        labelAlign="left">
                                        {getFieldDecorator('companyRegistration', {
                                            rules: [
                                                // {
                                                //     required: true,
                                                //     message: 'Please input your company registration!'
                                                // }
                                            ]
                                        })(<Input/>)}
                                    </Form.Item>
                                    <Form.Item
                                        label={
                                            <FormattedMessage
                                                id="restaurants.create.cardAccepted"
                                                defaultMessage="Card accepted"/>}
                                        labelAlign="left">
                                        {getFieldDecorator('cardAccepted', {
                                            initialValue: false,
                                            rules: []
                                        })(<Switch
                                            checkedChildren={
                                                <FormattedMessage
                                                    id="restaurants.create.cardAccepted.accept"
                                                    defaultMessage="Accept"/>}
                                            unCheckedChildren={
                                                <FormattedMessage
                                                    id="restaurants.create.cardAccepted.decline"
                                                    defaultMessage="Decline"/>}
                                        />)}
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Divider/>

                            <Row>
                                <Col span={6}>
                                    <FormattedMessage
                                        id="restaurants.create.bankInformation"
                                        defaultMessage="Banking information"/>
                                </Col>
                                <Col span={18}>
                                    <Form.Item
                                        label={
                                            <FormattedMessage
                                                id="restaurants.create.bankName"
                                                defaultMessage="Bank name"/>}
                                        labelAlign="left">
                                        {getFieldDecorator('bankName', {
                                            rules: [
                                                // {
                                                //     required: true,
                                                //     message: 'Please input your bank name!'
                                                // }
                                            ]
                                        })(<Input/>)}
                                    </Form.Item>
                                    <Form.Item
                                        label={
                                            <FormattedMessage
                                                id="restaurants.create.bankAccountNumber"
                                                defaultMessage="Account number"/>}
                                        labelAlign="left">
                                        {getFieldDecorator('bankAccountNumber', {
                                            rules: [
                                                // {
                                                //     required: true,
                                                //     message: 'Please input your bank\'s account number!'
                                                // }
                                            ]
                                        })(<NumericInput
                                            negative={false}
                                            float={false}/>)}
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Divider/>

                            <Row>
                                <Col span={6}>
                                    <FormattedMessage
                                        id="restaurants.create.openingHours"
                                        defaultMessage="Opening hours"/>
                                </Col>
                                <Col span={18}>
                                    <Row>
                                        <Col md={24} lg={24} xl={24}
                                             style={{ paddingBottom: '15px' }}>
                                            <Text strong>
                                                <FormattedMessage
                                                    id="empoloyee.dayAccept"
                                                    defaultMessage="DAY ACCEPTED"/>
                                            </Text>
                                            <div style={{ 
                                                padding: '7px', 
                                                width: '140%' }}>
                                            </div>
                                            <OpenHouse setDataOutput={this.setDataOutput} />
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>
                            <Divider/>

                            <Row type="flex" justify="space-between">
                                <Col span={6}>
                                    <FormattedMessage
                                        id="restaurants.create.restaurantOperation"
                                        defaultMessage="Operation"/>
                                </Col>
                                <Col span={18}>
                                    <Form.Item
                                        label={
                                            <FormattedMessage
                                                id="restaurants.create.saleCommissionPolicy"
                                                defaultMessage="Sales Commission Policy"/>}
                                        labelAlign="left">
                                        {getFieldDecorator('salesCommissionPolicy', {
                                            rules: [
                                                {
                                                    max: 120,
                                                    message: 'Sales commission policy just 120 characters or less!'
                                                },
                                                // {
                                                //     required: true,
                                                //     message: 'Please input your sales commission policy!'
                                                // }
                                            ]
                                        })(<Input.TextArea/>)}
                                    </Form.Item>
                                    <Form.Item
                                        label={
                                            <FormattedMessage
                                                id="restaurants.create.joinDate"
                                                defaultMessage="Join date"/>}
                                        labelAlign="left">
                                        {getFieldDecorator('joinDate', {
                                            initialValue: moment(),
                                            rules: [
                                                // {
                                                //     required: true,
                                                //     message: 'Please select join date!'
                                                // }
                                            ]
                                        })(<DatePicker/>)}
                                    </Form.Item>
                                    <Form.Item
                                        label={
                                            <FormattedMessage
                                                id="restaurants.create.refundDate"
                                                defaultMessage="Refund date"/>}
                                        labelAlign="left">
                                        {getFieldDecorator('refundDate', {
                                            rules: [
                                                // {
                                                //     required: true,
                                                //     message: 'Please select refund date!'
                                                // }
                                            ]
                                        })(<Input/>)}
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Divider/>

                            <Row type="flex" justify="space-between">
                                <Col span={6}>
                                    <FormattedMessage
                                        id="restaurants.create.social"
                                        defaultMessage="Social"/>
                                </Col>
                                <Col span={18}>
                                    <Form.Item
                                        label={
                                            <FormattedMessage
                                                id="restaurants.create.facebook"
                                                defaultMessage="Facebook"/>}
                                        labelAlign="left">
                                        {getFieldDecorator('facebook', {
                                            rules: [
                                                {
                                                    type: 'url',
                                                    message: 'Please input a link'
                                                },
                                                {
                                                    validator: (rule, value, callback) => {
                                                        if (value &&
                                                            !value
                                                                .toLowerCase()
                                                                .match(/(?:(?:http|https):\/\/)?(www\.)?facebook\.com\//)) {
                                                            callback('Please input link to Facebook page');
                                                        }
                                                        else {
                                                            callback()
                                                        }
                                                    }
                                                }
                                            ]
                                        })(<Input/>)}
                                    </Form.Item>
                                    <Form.Item
                                        label={
                                            <FormattedMessage
                                                id="restaurants.create.instagram"
                                                defaultMessage="Instagram"/>}
                                        labelAlign="left">
                                        {getFieldDecorator('instagram', {
                                            rules: [
                                                {
                                                    type: 'url',
                                                    message: 'Please input a link'
                                                },
                                                {
                                                    validator: (rule, value, callback) => {
                                                        if (value &&
                                                            !value
                                                                .toLowerCase()
                                                                .match(/(?:(?:http|https):\/\/)?(www\.)?instagram\.com\//)) {
                                                            callback('Please input link to Instagram page');
                                                        }
                                                        else {
                                                            callback()
                                                        }
                                                    }
                                                }
                                            ]
                                        })(<Input/>)}
                                    </Form.Item>
                                    <Form.Item
                                        label={
                                            <FormattedMessage
                                                id="restaurants.create.website"
                                                defaultMessage="Website"/>}
                                        labelAlign="left">
                                        {getFieldDecorator('website', {
                                            rules: [
                                                {
                                                    type: 'url',
                                                    message: 'Please input link to Website'
                                                }
                                            ]
                                        })(<Input/>)}
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Divider/>

                            <Row type="flex" justify="space-between">
                                <Col span={6}>
                                    <FormattedMessage id="restaurants.create.gallery"
                                                      defaultMessage="Gallery"/>
                                </Col>
                                <Col span={18}>
                                    <UploadImages
                                        multiple={true}
                                        max={10}
                                        fileList={fileList}
                                        handleChange={this.handleChange}/>
                                </Col>
                            </Row>
                            <Divider/>

                            <Row type="flex" justify="end" gutter={10}>
                                <Col>
                                    <Button
                                        type="deafult"
                                        onClick={() => Router.pushRoute(`/restaurants`)}>
                                        <FormattedMessage
                                            id="restaurants.create.buttonCancel"
                                            defaultMessage="Cancel"/>
                                    </Button>
                                </Col>
                                <Col>
                                    <Button
                                        type="primary"
                                        htmlType="submit"
                                        disabled={hasErrors(getFieldsError())}
                                        loading={this.state.loadingSubmit}>
                                        <FormattedMessage
                                            id="restaurants.create.buttonCreateRestaurant"
                                            defaultMessage="Create new restaurant"/>
                                    </Button>
                                </Col>
                            </Row>
                        </Col>
                    </Form>
                </Card>
            </div>
        );
    }
}
