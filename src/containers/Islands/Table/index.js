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
    message,
} from 'antd';
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
                // getListUser,
                // deleteUser,
                // deactiveMultipleUser,
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
export default class TableEmployee extends PureComponent {
    state = {
        loading: false,
        selectedRowKeys: [],
        searchText: '',
        visible: false,
        editVisible: false,
        editInfo: null,
        editType: null,
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
            islandInfo: null,
        });
    };

    handleSubmit = e => {
        e.preventDefault();
        const { islandInfo } = this.state;

        this.props.form.validateFields(
            async (err, fields) => {
                if (!err) {
                    let createCitiesStatus = [];

                    await fields['cities'].map((city) => {
                        const createCityPayload = {
                            cityName: city,
                            island: '/api/islands/' + islandInfo.id
                        };

                        this.props.action.createTownsRequest(
                            createCityPayload,
                            (res) => {
                                createCitiesStatus.push(res);
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
                if (editType === 'island') {
                    const payload = {
                        id: editInfo.id,
                        islandName: fields['newName'],
                    };

                    this.props.action.updateIslandRequest(
                        payload,
                        (res) => {
                            if (res.title !== 'An error occurred') {
                                message.success('Mise à jour réussie');

                                this.props.getListIslandsCities();
                                this.handleCancel();
                            } else {
                                message.error(res.detail);
                            }
                        },
                        () => {
                            this.setState({
                                loading: false
                            });
                        });
                }
                else {
                    const payload = {
                        id: editInfo.id,
                        cityName: fields['newName'],
                    };

                    this.props.action.updateTownsRequest(
                        payload,
                        (res) => {
                            if (res.title !== 'An error occurred') {
                                message.success('Mise à jour réussie');

                                this.props.getListIslandsCities();
                                this.setState({
                                    editVisible: false,
                                    loading: false
                                });
                            } else {
                                message.error(res.detail);
                            }
                        },
                        () => {
                            this.setState({
                                loading: false
                            });
                        });
                }
            }
        });
    };

    render() {
        const { loading, selectedRows, islandInfo } = this.state;
        const { classes, islandsData, citiesData } = this.props;
        const { getFieldDecorator, getFieldValue } = this.props.form;

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
                {keys.length > 1 ? (
                    <Icon
                        className="dynamic-delete-button"
                        type="minus-circle-o"
                        onClick={() => this.remove(k)}
                    />
                ) : null}
            </Form.Item>
        ));

        const columns = [
            {
                title: 'ID',
                dataIndex: 'id',
                key: 'id'
            },
            {
                title: <FormattedMessage id="settings.islandsCities.table.island"
                                         defaultMessage="Island"/>,
                dataIndex: 'islandName',
                key: 'islandName'
                // ...this.getColumnSearchProps('email')
            },
            {
                title: <FormattedMessage id="settings.islandsCities.table.cities"
                                         defaultMessage="No. Cities"/>,
                dataIndex: 'cities',
                key: 'cities',
                align: 'right',
                render: (cities) => cities.length
                // ...this.getColumnSearchProps('firstName')
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
                align: 'right',
                // render: (restaurants) => restaurants.length
                // ...this.getColumnSearchProps('firstName')
            },
            {
                title: <FormattedMessage id="settings.islandsCities.table.longitude"
                                         defaultMessage="Longitude"/>,
                dataIndex: 'longitude',
                key: 'longitude',
                align: 'right',
                // render: (restaurants) => restaurants.length
                // ...this.getColumnSearchProps('firstName')
            },
            // {
            //     title: 'Action',
            //     key: 'action',
            //     align: 'center',
            //     // fixed: 'right',
            //     render: (info) => (
            //         <Row gutter={5}>
            //             <Button
            //                 type="link"
            //                 icon="edit"
            //                 onClick={() => {
            //                     this.setState({
            //                         editInfo: info,
            //                         editType: 'island'
            //                     });
            //                     this.showEditModal();
            //                 }}/>
            //             <Button
            //                 type="link"
            //                 icon="plus"
            //                 onClick={() => {
            //                     this.setState({
            //                         islandInfo: info
            //                     });
            //                     this.showModal();
            //                 }} />
            //         </Row>
            //     )
            // }
        ];

        // const expandedRowRender = (e) => {
        //     // console.log(e);
        //
        //     const columns = [
        //         {
        //             title: 'ID',
        //             dataIndex: 'id',
        //             key: 'id'
        //         },
        //         {
        //             title: 'City',
        //             dataIndex: 'cityName',
        //             key: 'cityName'
        //         },
        //         {
        //             title: '',
        //             render: ''
        //             // ...this.getColumnSearchProps('firstName')
        //         },
        //         {
        //             title: <FormattedMessage id="settings.islandsCities.tableCities.companies"
        //                                      defaultMessage="No. Companies"/>,
        //             dataIndex: 'companies',
        //             key: 'companies',
        //             align: 'right',
        //             render: (companies) => companies.length
        //             // ...this.getColumnSearchProps('firstName')
        //         },
        //         {
        //             title: <FormattedMessage id="settings.islandsCities.tableCities.restaurants"
        //                                      defaultMessage="No. Restaurants"/>,
        //             dataIndex: 'restaurants',
        //             key: 'restaurants',
        //             align: 'right',
        //             render: (restaurants) => restaurants.length
        //             // ...this.getColumnSearchProps('firstName')
        //         },
        //         {
        //             title: 'Action',
        //             key: 'action',
        //             align: 'center',
        //             // fixed: 'right',
        //             render: (info) => (
        //                 <Row gutter={5}>
        //                     <Button
        //                         type="link"
        //                         icon="edit"
        //                         onClick={() => {
        //                             this.setState({
        //                                 editInfo: info,
        //                                 editType: 'city'
        //                             });
        //                             this.showEditModal();
        //                         }}/>
        //                     {/*<Button type="link" icon="plus"></Button>*/}
        //                 </Row>
        //             )
        //         }
        //     ];
        //     return (
        //         <Table
        //             columns={columns}
        //             dataSource={
        //                 citiesData.filter(
        //                     (each) => {
        //                         // console.log('Show compare', each.island.slice(each.island.lastIndexOf('/') + 1), e.id);
        //                         return each.island.slice(each.island.lastIndexOf('/') + 1) == e.id;
        //                     }
        //                 )}
        //             pagination={false}
        //         />
        //     );
        // };

        return (
            <div className={classes.contentPadding}>
                <Table
                    columns={columns}
                    // pagination={false}
                    pagination={{ pageSize: 50 }}
                    // expandedRowRender={expandedRowRender}
                    dataSource={islandsData}
                    rowKey="id"
                    onRow={e => ({
                        onClick: () => {
                            Router.pushRoute(`/island/${e.id}`);
                        }
                    })}
                />
                {
                    this.state.editType ? (
                        <Form>
                            <Modal
                                title={
                                    <Text>
                                        {
                                            this.state.editType === 'island' ?
                                                <FormattedMessage
                                                    id="setting.islandsCities.EditIslandModal.title"
                                                    defaultMessage="Edit island's name"/>
                                                :
                                                <FormattedMessage
                                                    id="setting.islandsCities.EditCityModal.title"
                                                    defaultMessage="Edit city's name"/>
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
                                    {
                                        this.state.editType === 'island' ?
                                            <Form.Item label={
                                                <FormattedMessage
                                                    id="setting.islandsCities.EditIslandModal.island"
                                                    defaultMessage="Island"/>
                                            }>
                                                {getFieldDecorator('newName', {
                                                    rules: [{ required: true, message: 'Required field' }]
                                                })(
                                                    <Input
                                                        placeholder={ this.state.editInfo ? this.state.editInfo.islandName : '' }
                                                        // size="large"
                                                        autoComplete={false}/>)}
                                            </Form.Item>
                                            :   <Form.Item label={
                                                <FormattedMessage
                                                    id="setting.islandsCities.EditCityModal.city"
                                                    defaultMessage="City"/>
                                            }>
                                                {getFieldDecorator('newName', {
                                                    rules: [{ required: true, message: 'Required field' }]
                                                })(
                                                    <Input
                                                        placeholder={ this.state.editInfo ? this.state.editInfo.cityName : '' }
                                                        // size="large"
                                                        autoComplete={false}/>)}
                                            </Form.Item>
                                    }
                                </div>
                            </Modal>
                        </Form>
                    ) : (
                        <Form>
                            <Modal
                                title={
                                    <Text>
                                        <FormattedMessage
                                            id="setting.islandsCities.CreateCitiesModal.title"
                                            defaultMessage="Create cities"/>
                                        &nbsp;for {islandInfo ? islandInfo.islandName : ''}
                                    </Text>
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
                                    {formItems}
                                    <Form.Item>
                                        <Button type="dashed" onClick={this.add} style={{ width: '60%' }}>
                                            <Icon type="plus"/>
                                            <FormattedMessage
                                                id="setting.islandsCities.CreateIslandModal.addCities"
                                                defaultMessage="Add cities"/>
                                        </Button>
                                    </Form.Item>
                                </div>
                            </Modal>
                        </Form>
                    )
                }
            </div>
        );
    }
}
