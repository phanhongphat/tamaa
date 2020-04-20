import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';

import {
    Button,
    Menu,
    Row,
    Col,
    Input,
    Icon,
    Dropdown,
    Divider,
    Typography,
    Card,
    Modal,
    Form,
    Alert,
    Spin,
    Upload,
    message,
    Progress
    // Breadcrumb
} from 'antd';

import RestaurantsTable from 'src/containers/Restaurant/Table';
import ImportResultModal from 'src/components/Import/ImportResultModal';
import HeaderContent from '../../components/HeaderContent';
import Breadcrumb from 'src/components/Breadcrumb';
import ExportButton from 'src/components/Button/BtnUrlExport';

const { Search } = Input;

import {
    getListRestaurant,
    // deleteRestaurant,
    getSearchListRestaurant,
    exportRestaurantsQRCode
} from 'src/redux/actions/restaurant.js';
import { importByCSV } from 'src/redux/actions/importByCSV';
import { refundRestaurant } from 'src/redux/actions/creditRefund.js';
import { deactiveMultipleUser } from 'src/redux/actions/user.js';

import injectSheet from 'react-jss';
import styles from './styles';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { FormattedMessage } from 'react-intl';
import CONSTANTS from 'src/constants';
import NumericInput from 'src/components/Input/NumericInput';
import { Router } from 'src/routes';

const { Text, Title } = Typography;
const { confirm } = Modal;
const { Dragger } = Upload;

const domain = process.env.API_URL.slice(0, process.env.API_URL.lastIndexOf('/'));

function mapStateToProps(state) {
    return {
        store: {
            restaurant: state.restaurant.list,
            restaurantSearchList: state.restaurant.searchList,
            refund: state.refund.message
        }
    };
}

function numberWithSpaces(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
}

const mapDispatchToProps = dispatch => {
    return {
        action: bindActionCreators(
            {
                getListRestaurant,
                // deleteRestaurant,
                refundRestaurant,
                deactiveMultipleUser,
                getSearchListRestaurant,
                exportRestaurantsQRCode,
                importByCSV
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
export default class RestaurantContainer extends PureComponent {
    state = {
        loading: true,
        selectedRowKeys: [],
        listId: [],
        activatedSelector: [],
        refundButtonEnabled: false,
        // warningDeactivated: [],
        totalBalance: 0,
        maximumBalance: 0,
        currency: 'FCP',
        visible: false,
        importVisible: false,
        totalBalances: 0,
        selectedRows: [],
        amountRefund: 0,
        restaurants: [],
        uriExport:'/get-restaurant-csv'
    };

    static defaultProps = {};

    static propTypes = {
        classes: PropTypes.object.isRequired,
        // slug: PropTypes.string.isRequired,
        // store
        store: PropTypes.shape({
            restaurant: PropTypes.object.isRequired
        }),
        // action
        action: PropTypes.shape({
            getListRestaurant: PropTypes.func.isRequired,
            getSearchListRestaurant: PropTypes.func.isRequired
        })
    };

    start = () => {
        this.setState({ loading: true });
        // ajax request after empty completing
        setTimeout(() => {
            this.setState({
                selectedRowKeys: [],
                loading: false
            });
        }, 1000);
    };

    handleOk = () => {
        this.setState({ confirmLoading: true });
        if (this.state.refundButtonEnabled) {
            const { listID, activatedSelector } = this.state;
            if (activatedSelector && activatedSelector.length > 0) {
                this.handleActionRefund(
                    activatedSelector.map(each => {
                        return each.user.id;
                    }),
                    this.state.amountRefund,
                    this.state.noteMain ? this.state.noteMain : null,
                    this.state.noteSub ? this.state.noteSub : null
                );
                this.setState({
                    confirmLoading: true
                });
            }
        } else {
            message.error('Please check your amounts, a restaurant not enough balance to refund');
        }
    };

    handleImport = () => {
        const { fileList } = this.state;

        this.setState({
            loading: true
        });

        if (fileList.length) {
            const payload = {
                entity: 'restaurant',
                files: fileList.map((each, index) => {
                    return {
                        field: 'file',
                        file: each.originFileObj
                    };
                })
            };
            // console.log('payload', payload);
            this.props.action.importByCSV(
                payload,
                next => {
                    // console.log('next', next);
                    this.handleCancel();
                    this.setState({
                        importResultVisible: true,
                        importResult: next,
                        loading: false
                    });
                    this.getListRestaurant();
                },
                nextErr => {
                    this.setState({
                        loading: false
                    });
                }
            );
        } else {
            message.error('Do not have any file to import');
        }
    };

    handleActionRefund = (listID, amount, noteMain, noteSub) => {
        const payload = {
            listID,
            amount,
            noteMain,
            noteSub
        };
        if (amount !== 0) {
            this.props.action.refundRestaurant(
                payload,
                () => {
                    const { refund } = this.props.store;
                    switch (refund.statusCode) {
                        case 611: {
                            message.error(refund.message);
                            break;
                        }
                        case 617: {
                            message.error(refund.message);
                            break;
                        }
                        default: {
                            if (this.state.searchText && this.state.searchText !== '') {
                                this.handleSearch(this.state.searchText);
                            }
                            else {
                                this.getListRestaurant();
                            }
                            message.success('Refund is successful !');
                            this.setState({
                                loading: false,
                                visible: false,
                                confirmLoading: false
                            });
                            break;
                        }
                    }
                    this.setState({ confirmLoading: false });
                },
                () => {
                    this.setState({ loading: false, confirmLoading: false });
                }
            );
        } else {
            message.error('Refund amount must be greater than zero');
        }
    };

    downloadPDF = (pdf) => {
        const linkSource = `data:application/pdf;base64,${pdf}`;
        const downloadLink = document.createElement('a');
        const fileName = 'restaurants.pdf';

        downloadLink.href = linkSource;
        downloadLink.download = fileName;
        downloadLink.click();
    };

    handleExportQRCode = () => {
        const { selectedRows } = this.state;
        this.setState({ loading: true });
        const payload = {
            listID: [...selectedRows.map(each => each.user.id)]
        };

        this.props.action.exportRestaurantsQRCode(
            payload,
            (res) => {
                if (res.statusCode === 200) {
                    this.downloadPDF(res.content);
                }
                this.setState({ loading: false });
            },
            () => {
                this.setState({ loading: false });
            }
        );
    };

    handleDownloadSampleFile = () => {
        const linkSource = domain + '/sample/import/restaurant_sample_data.csv';
        const downloadLink = document.createElement('a');
        // const fileName = 'restaurants.pdf';

        downloadLink.href = linkSource;
        // downloadLink.download = fileName;
        downloadLink.click();
    };

    handleCancel = () => {
        this.setState({
            refundButtonEnabled: false,
            totalBalance: 0,
            visible: false,
            importResultVisible: false,
            importVisible: false,
            fileList: []
        });
    };

    validateWithCurrentBalances = (rule, value, callback) => {
        if (value && value !== '0') {
            let totalBalance = value * this.state.activatedSelector.length;
            this.setState({ totalBalance });

            if (value > this.state.maximumBalance) {
                callback(`A restaurant selected do not enough balance`);
                this.setState({ refundButtonEnabled: false });
            } else {
                this.setState({ refundButtonEnabled: true });
            }
        } else {
            this.setState({ refundButtonEnabled: false });
        }
    };

    onSelectChange = selectedRowKeys => {
        // console.log('selectedRowKeys changed: ', selectedRowKeys);
        this.setState({ selectedRowKeys });
    };

    getListRestaurant = () => {
        this.props.action.getListRestaurant(
            {
                pagination: false
            },
            () => {
                const restaurants = this.props.store.restaurant.data;
                this.setState({ loading: false, restaurants });
            },
            () => {
                this.setState({ loading: false });
            }
        );
    };

    showModal = () => {
        let activatedSelector = this.state.selectedRows.filter(each => each.user.creditActivated);

        let maximumBalance =
            activatedSelector.length ?
                Math.min(...activatedSelector.map(each => each.balance ? each.balance : 0))
                : 0;
        // console.log(activatedSelector);
        this.setState({
            visible: true,
            totalBalance: 0,
            activatedSelector,
            maximumBalance
            // warningDeactivated: this.state.selectedRows.filter(each => !each.user.creditActivated)
        });
    };

    componentDidMount() {
        this.getListRestaurant();
    }

    setListId = listID => {
        this.setState(
            {
                listID
            },
            () => {
                // console.log(this.state.listID);
            }
        );
    };

    setSelected = selectedRows => {
        this.setState({ selectedRows });
    };

    handleSearch = (query) => {
        const payload = {
            pagination: false
        };

        if (query !== '') {
            payload['query'] = query;
        }

        // console.log(payload);
        this.props.action.getSearchListRestaurant(
            payload,
            () => {
                //
                const restaurants = this.props.store.restaurantSearchList.data;
                this.setState({ loading: false, restaurants });
            },
            () => {
                this.setState({ loading: false });
            },
            true
        );
    };

    render() {
        const {
            classes
            // store: { restaurant = {} }
        } = this.props;
        const { getFieldDecorator, getFieldValue } = this.props.form;
        const { loading, selectedRowKeys, listID, fileList, restaurants } = this.state;

        const handleDeleteRestaurant = () => {
            if (listID && listID.length > 0) {
                listID.forEach((item, index) => {
                    this.handleDeleteRestaurant(item.id);
                });
            }
        };

        const openModalImportCSV = () => {
            this.setState({ importVisible: true });
        };

        const rowSelection = {
            selectedRowKeys,
            onChange: this.onSelectChange
        };
        const hasSelected = selectedRowKeys.length > 0;
        const menu = (
            <Menu>
                {/*<Menu.Item*/}
                {/*    key="refund-restaurant-more-refund"*/}
                {/*    onClick={this.showModal}*/}
                {/*    disabled={this.state.selectedRows.length === 0}>*/}
                {/*    <Icon type="carry-out"/>*/}
                {/*    Refund*/}
                {/*</Menu.Item>*/}
                <Menu.Item
                    key="restaurant-more-import"
                    onClick={() => openModalImportCSV()}>
                    <Icon type="import"/>
                    <Button type='link'>
                        <FormattedMessage id="restaurants.import" defaultMessage="Import"/>
                    </Button>
                </Menu.Item>
                <Menu.Item key="restaurant-more-download" onClick={() => this.handleDownloadSampleFile()}>
                    <Icon type="download"/>
                    <Button type='link'>
                        <FormattedMessage
                        id="restaurants.downloadSampleFile"
                        defaultMessage="Download sample file"/>
                    </Button>
                </Menu.Item>
                <Menu.Item
                    key="restaurant-more-export"
                    // onClick={this.handleExportQRCode}
                    >
			        <Icon type="export" />
                    <ExportButton uri={this.state.uriExport} selectedRows={this.state.selectedRows}/>
                    {/* <FormattedMessage id="export" defaultMessage="Export"/> */}
                </Menu.Item>
                <Menu.Item
                    key="restaurant-more-export-qr"
                    onClick={this.handleExportQRCode}
                    >
			          <Icon type="export" />
                    <Button type='link'>
                        <FormattedMessage id="export" defaultMessage="Export QR code"/>
                    </Button>
                </Menu.Item>
            </Menu>
        );

        const routes = [
            {
                breadcrumbName:
                    <FormattedMessage
                        id="restaurants.breadcrumb"
                        defaultMessage="Restaurants"/>
            }
        ];

        return (
            <div>
                <Breadcrumb
                    breadcrumb={routes}
                    //  title="ss"
                />
                <Card style={{ minHeight: 360, marginTop: '16px' }} bordered={false}>
                    <Row type="flex" justify="space-between">
                        <h3>
                            <strong>
                                <FormattedMessage
                                    id="restaurants.allRestaurants"
                                    defaultMessage="All restaurants"/>
                            </strong>
                        </h3>
                        <Row type="flex" justify="end" align="middle">
                            <Col>
                                <Row type="flex" justify="end">
                                    <Search
                                        placeholder="Search in all fields"
                                        // placeholder={
                                        //     <FormattedMessage
                                        //         id="searchAllFields"
                                        //         defaultMessage="Search in all fields"/>
                                        // }
                                        className={classes.btnSearch}
                                        onChange={(e) => {this.setState({searchText: e.target.value})}}
                                        onSearch={value => this.handleSearch(value)}
                                    />
                                </Row>
                            </Col>
                            <Col className={classes.wrapperCreateNew}>
                                <Row type="flex" justify="center">
                                    <Col>
                                        <Button
                                            type="link"
                                            icon="plus"
                                            onClick={() => Router.pushRoute('/restaurants-create')}>
                                            <FormattedMessage
                                                id="restaurants.createRestaurant"
                                                defaultMessage="Create restaurant"/>
                                        </Button>
                                    </Col>
                                    <Col>
                                        <Button className="ant-btn ant-btn-link"
                                                onClick={this.showModal}
                                                disabled={this.state.selectedRows.length === 0}>
                                            <Icon type="carry-out"/>
                                            <FormattedMessage id="restaurants.refund"
                                                              defaultMessage="Refund"/>
                                        </Button>
                                    </Col>
                                </Row>
                            </Col>
                            <Col>
                                <Row type="flex" justify="end">
                                    <Dropdown
                                        overlay={menu}
                                        trigger={['click']}
                                        placement="bottomRight">
                                        <Icon type="more"/>
                                    </Dropdown>
                                </Row>
                            </Col>
                        </Row>
                        {/*</Col>*/}
                    </Row>

                    <Modal
                        title={
                            <FormattedMessage
                                id="restaurants.popupRefund.refundRestaurants"
                                defaultMessage="Refund restaurants"/>}
                        visible={this.state.visible}
                        confirmLoading={this.state.confirmLoading}
                        onCancel={this.handleCancel}
                        destroyOnClose
                        footer={[
                            <Button type="default" onClick={this.handleCancel}>
                                <FormattedMessage
                                    id="restaurants.popupRefund.cancel"
                                    defaultMessage="Cancel"/>
                            </Button>,
                            <Button
                                loading={this.state.confirmLoading}
                                disabled={!this.state.refundButtonEnabled}
                                onClick={this.handleOk}
                                type="primary">
                                <FormattedMessage
                                    id="restaurants.popupRefund.refund"
                                    defaultMessage="Refund"/>
                            </Button>
                        ]}>
                        <Card>
                            <Row gutter={24} type="flex" align="top">
                                <Col span={12}>
                                    <FormattedMessage
                                        id="restaurants.refund.maximumBalance"
                                        defaultMessage="Maximum balance"/>
                                    <Row type="flex" justify="end">
                                        <Title level={3} className={[classes.balanceColor]}>
                                            {numberWithSpaces(this.state.maximumBalance) + ' '}
                                        </Title>
                                        <small className={[classes.balanceColor]}>
                                            {CONSTANTS.CURRENCY}
                                        </small>
                                    </Row>
                                </Col>
                                <Col span={12}>
                                    <FormattedMessage
                                        id="restaurants.popupRefund.totalBalance"
                                        defaultMessage="Total balance"/>
                                    <Row type="flex" justify="end">
                                        <Title level={3} className={[classes.balanceColor]}>
                                            {numberWithSpaces(this.state.totalBalance) + ' '}
                                        </Title>
                                        <small className={[classes.balanceColor]}>
                                            {CONSTANTS.CURRENCY}
                                        </small>
                                    </Row>
                                </Col>
                            </Row>
                            <Row type="flex" align="middle">
                                {/*<Form formLayout='vertical'>*/}
                                <Form.Item
                                    style={{ margin: 0 }}
                                    labelCol={{ span: 24 }}
                                    wrapperCol={{ span: 24 }}
                                    label={
                                        <FormattedMessage
                                            id="restaurants.popupRefund.amountEachRestaurant"
                                            defaultMessage="Amount of each restaurant"/>}>
                                    {getFieldDecorator('refund', {
                                        // initialValue: 0,
                                        rules: [
                                            {
                                                validator: this.validateWithCurrentBalances
                                            }
                                        ]
                                    })(
                                        <NumericInput
                                            style={{ textAlign: 'right' }}
                                            negative={false}
                                            float={false}
                                            onChange={value => {
                                                this.setState({ amountRefund: value });
                                            }}
                                        />
                                    )}
                                </Form.Item>
                                {/*</Form>*/}
                            </Row>
                        </Card>
                        <Input
                            className={classes.inputNote}
                            placeholder="Note 1"
                            onChange={value => {
                                this.setState({ noteMain: value.target.value });
                            }}
                        />
                        <Input
                            className={classes.inputNote}
                            placeholder="Note 2"
                            onChange={value => {
                                this.setState({ noteSub: value.target.value });
                            }}
                        />
                    </Modal>
                    <Modal
                        title="Import restaurants"
                        visible={this.state.importVisible}
                        onOk={this.handleImport}
                        okText="Import"
                        confirmLoading={this.state.loading}
                        onCancel={this.handleCancel}
                        cancelText="Cancel">
                        <Dragger
                            name='file'
                            // multiple={true}
                            fileList={fileList}
                            action='https://www.mocky.io/v2/5cc8019d300000980a055e76'
                            beforeUpload={(file, FileList) => {
                                const isCSV = !!file.name.match(/\.csv$/); // && file.type === 'text/csv';
                                if (!isCSV) {
                                    message.error('You can only upload CSV file!');
                                }
                                const isLt2M = file.size / 1024 / 1024 < 10;
                                if (!isLt2M) {
                                    message.error('File must smaller than 10MB!');
                                }
                                return isCSV && isLt2M;
                            }}
                            onChange={(info) => {
                                const { status } = info.file;

                                if (status === 'done') {
                                    message.success(`${info.file.name} file uploaded successfully.`);
                                } else if (status === 'error') {
                                    message.error(`${info.file.name} file upload failed.`);
                                }

                                let fileList = [...info.fileList];

                                fileList = fileList.filter(
                                    file => !!file.name.match(/\.csv$/) && file.size / 1024 / 1024 < 10
                                );

                                if (fileList.length > 1) {
                                    fileList = fileList.slice(-1);
                                }

                                this.setState({ fileList });
                            }}>
                            <p className="ant-upload-drag-icon">
                                <Icon type="inbox"/>
                            </p>
                            <p className="ant-upload-text">Click or drag file to this area to
                                upload</p>
                            <p className="ant-upload-hint">
                                Support for a single or bulk upload. Strictly prohibit from
                                uploading company data or other
                                band files
                            </p>
                        </Dragger>
                    </Modal>
                    <ImportResultModal
                        importResultVisible={this.state.importResultVisible}
                        importResult={this.state.importResult}
                        handleCancel={this.handleCancel}
                    />
                    {/*<Divider/>*/}
                    <Row className={classes.main}>
                        <Spin spinning={loading}>
                            {restaurants && (
                                <RestaurantsTable
                                    selectedRows={this.state.selectedRows}
                                    data={restaurants}
                                    setSelected={this.setSelected}
                                    setListId={this.setListId}
                                />
                            )}
                        </Spin>
                    </Row>
                </Card>
            </div>
        );
    }
}
