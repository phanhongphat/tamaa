import React, { PureComponent } from 'react';
import injectSheet from 'react-jss';
import {
    Table,
    Tag,
    Input,
    Icon,
    Button,
    Row,
    Col,
    Modal,
    Form,
    Typography,
    message
} from 'antd';
import NumericInput from 'src/components/Input/NumericInput';
import Highlighter from 'react-highlight-words';
import { FormattedRelative, FormattedMessage, defineMessages } from 'react-intl';

import { Router } from 'src/routes';

import styles from '../styles';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { createIslandRequest, getListIsland, updateIslandRequest } from 'src/redux/actions/island';
import { createTownsRequest, getListTowns, updateTownsRequest } from 'src/redux/actions/town';

const { Text } = Typography;

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
                getListIsland,
                getListTowns,
                createIslandRequest,
                createTownsRequest,
                updateIslandRequest,
                updateTownsRequest
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
export default class CitiesTable extends PureComponent {
    state = {
        loading: false,
        selectedRowKeys: [],
        searchText: '',
        visible: false,
        editVisible: false,
        editInfo: null,
        editType: null
    };

    showModal = () => {
        this.add();
        this.setState({
            visible: true,
            editVisible: false
        });
    };

    showEditModal = () => {
        this.setState({
            visible: false,
            editVisible: true
        });
    };


    handleCancel = e => {
        const { form } = this.props;
        // can use data-binding to get
        // const keys = form.getFieldValue('keys');
        form.setFieldsValue({ keys: [] });
        // console.log(keys);
        this.setState({
            visible: false,
            editVisible: false,
            editInfo: null,
            editType: null,
            islandInfo: null
        });
    };

    handleSubmit = e => {
        e.preventDefault();
        const { islandInfo } = this.state;

        this.props.form.validateFields(
            async (err, fields) => {
                if (!err) {
                    this.setState({
                        loading: true
                    });
                    // let createCitiesStatus = [];

                    await fields['cities'].map((city) => {
                        const createCityPayload = {
                            cityName: city.trim(),
                            island: islandInfo.id
                        };

                        this.props.action.createTownsRequest(
                            createCityPayload,
                            (res) => {
                                if (res.title !== 'An error occurred') {
                                    message.success('Mise à jour réussie');

                                    this.props.getListIslandsCities();
                                    this.setState({
                                        visible: false
                                    });
                                } else {
                                    message.error(res.detail);
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
                    });

                    this.props.getListIslandsCities();
                    this.handleCancel();
                }
            });
    };

    handleEditSubmit = e => {
        e.preventDefault();
        const { editType, editInfo } = this.state;

        this.props.form.validateFields((err, fields) => {
            if (!err) {
                this.setState({
                    loading: true
                });

                const payload = {
                    id: editInfo.id,
                    cityName: fields['cityName'].trim(),
                    latitude: parseFloat(fields['latitude']),
                    longitude: parseFloat(fields['longitude'])
                };

                this.props.action.updateTownsRequest(
                    payload,
                    (res) => {
                        if (res.title !== 'An error occurred') {
                            message.success('Mise à jour réussie');

                            this.props.getListIslandsCities();
                            this.setState({
                                editVisible: false
                            });
                        } else {
                            message.error(res.detail);
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
        });
    };

    render() {
        const { loading } = this.state;
        const { classes, data } = this.props;
        const { getFieldDecorator, getFieldValue } = this.props.form;

        const columns = [
            {
                title: 'ID',
                dataIndex: 'id',
                key: 'id'
            },
            {
                title: <FormattedMessage id="settings.islandsCities.table.city"
                                         defaultMessage="City"/>,
                dataIndex: 'cityName',
                key: 'cityName'
                // ...this.getColumnSearchProps('email')
            },
            {
                title: <FormattedMessage id="settings.islandsCities.table.companies"
                                         defaultMessage="No. Companies"/>,
                dataIndex: 'companies',
                key: 'companies',
                align: 'right',
                render: (companies) => companies.length
                // ...this.getColumnSearchProps('firstName')
            },
            {
                title: <FormattedMessage id="settings.islandsCities.table.restaurants"
                                         defaultMessage="No. Restaurants"/>,
                dataIndex: 'restaurants',
                key: 'restaurants',
                align: 'right',
                render: (restaurants) => restaurants.length
                // ...this.getColumnSearchProps('firstName')
            },
            {
                title: <FormattedMessage id="settings.islandsCities.table.latitude"
                                         defaultMessage="Latitude"/>,
                dataIndex: 'latitude',
                key: 'latitude',
                align: 'right'
                // render: (restaurants) => restaurants.length
                // ...this.getColumnSearchProps('firstName')
            },
            {
                title: <FormattedMessage id="settings.islandsCities.table.longitude"
                                         defaultMessage="Longitude"/>,
                dataIndex: 'longitude',
                key: 'longitude',
                align: 'right'
                // render: (restaurants) => restaurants.length
                // ...this.getColumnSearchProps('firstName')
            },
            {
                // title: 'Action',
                // key: 'action',
                align: 'center',
                // fixed: 'right',
                render: (info) => (
                    <Button
                        type="link"
                        icon="edit"
                        onClick={() => {
                            this.setState({
                                editInfo: info,
                                editType: 'island'
                            });
                            this.showEditModal();
                        }}/>
                )
            }
        ];

        return (
            <div className={classes.contentPadding}>
                <Table
                    columns={columns}
                    // pagination={false}
                    pagination={{ pageSize: 50 }}
                    // expandedRowRender={expandedRowRender}
                    dataSource={data}
                    rowKey="id"
                    // onRow={e => ({
                    //     onClick: () => {
                    //         Router.pushRoute(`/island/${e.id}`);
                    //     }
                    // })}
                />
                <Form>
                    <Modal
                        title={
                            <Text>
                                {
                                    this.state.editInfo ?
                                        <div>
                                            <FormattedMessage
                                                id="setting.islandsCities.EditCityModal.title"
                                                defaultMessage="Edit infomation of "/>
                                            { ' ' + this.state.editInfo.cityName }
                                        </div>
                                    :   ''
                                }
                            </Text>
                        }
                        visible={this.state.editVisible}
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
                                onClick={this.handleEditSubmit}
                                loading={this.state.loading}
                                style={{
                                    float: 'right'
                                }}>
                                <FormattedMessage
                                    id="setting.islandsCities.EditModal.editButton"
                                    defaultMessage="Edit"/>
                            </Button>
                        ]}
                        onOk={this.handleEditSubmit}
                        onCancel={this.handleCancel}
                        destroyOnClose>
                        <div>
                            <Form.Item label={
                                <FormattedMessage
                                    id="setting.islandDetails.EditModal.cityName"
                                    defaultMessage="City"/>}>
                                {getFieldDecorator('cityName', {
                                    initialValue: this.state.editInfo ? this.state.editInfo.cityName : '',
                                    rules: [{
                                        required: true,
                                        message: 'Required field'
                                    }]
                                })(
                                    <Input
                                        // size="large"
                                        autoComplete={false}/>)}
                            </Form.Item>
                            <Form.Item label={
                                <FormattedMessage
                                    id="setting.islandDetails.EditModal.latitude"
                                    defaultMessage="Latitude"/>}>
                                {getFieldDecorator('latitude', {
                                    initialValue: this.state.editInfo ? this.state.editInfo.latitude : '',
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
                                            message: 'Please input your city latitude!'
                                        }]
                                })(<NumericInput/>)}
                            </Form.Item>
                            <Form.Item label={
                                <FormattedMessage
                                    id="setting.islandDetails.EditModal.longitude"
                                    defaultMessage="Longitude"/>}>
                                {getFieldDecorator('longitude', {
                                    initialValue: this.state.editInfo ? this.state.editInfo.longitude : '',
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
                                            message: 'Please input your city longitude!'
                                        }
                                    ]
                                })(<NumericInput/>)}
                            </Form.Item>
                        </div>
                    </Modal>
                </Form>
            </div>
        );
    }
}
