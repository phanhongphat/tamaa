import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Breadcrumb from 'src/components/Breadcrumb';
import HeaderContent from 'src/components/HeaderContent';
import injectSheet from 'react-jss';
import CONSTANTS from 'src/constants';
import ExportButton from 'src/components/Button/BtnUrlExport';
import {
    Card,
    Input,
    Icon,
    Menu,
    Dropdown,
    Button,
    message,
    Row,
    Col,
    Spin,
    Form,
    Modal,
    Typography,
    Upload,
} from 'antd';
import {
    getListEmployees,
    deleteEmployees,
    getEmployeeDetails,
    searchEmployee
} from 'src/redux/actions/employee.js';
import { affectCredit } from 'src/redux/actions/affectCredit.js';
import { deactivatedUsersRequest } from 'src/redux/actions/user.js';
import { getListCompanies } from 'src/redux/actions/companies.js';
import { importByCSV } from 'src/redux/actions/importByCSV';
import AuthStorage from 'src/utils/AuthStorage';
import { Router } from 'src/routes';
import ListEmployees from 'src/containers/Employee/Table';
import styles from './styles';
import { FormattedRelative, FormattedMessage, defineMessages } from 'react-intl';
import { updateUserInfor } from 'src/redux/actions/user.js';
import BtnExport from 'src/components/Button/BtnExport';
import NumericInput from 'src/components/Input/NumericInput';
import ImportResultModal from 'src/components/Import/ImportResultModal';

const { Search } = Input;
const { Text, Title } = Typography;
const { confirm } = Modal;
const { Dragger } = Upload;

const domain = process.env.API_URL.slice(0, process.env.API_URL.lastIndexOf('/'));

function mapStateToProps(state) {
    return {
        store: {
            user: state.employees.list,
            userDetail: state.employees.detail,
            searchList: state.employees.searchList,
            companies: state.companies.list.data,
            message: state.message.message
        }
    };
}

const mapDispatchToProps = dispatch => {
    return {
        action: bindActionCreators(
            {
                getListEmployees,
                deleteEmployees,
                affectCredit,
                updateUserInfor,
                getEmployeeDetails,
                deactivatedUsersRequest,
                searchEmployee,
                getListCompanies,
                importByCSV
            },
            dispatch
        )
    };
};

function numberWithSpaces(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
}

@injectSheet(styles)
@connect(
    mapStateToProps,
    mapDispatchToProps
)
@Form.create()
export default class EmployeeContainer extends PureComponent {
    static propTypes = {
        classes: PropTypes.object.isRequired,
        // slug: PropTypes.string.isRequired,
        // store
        store: PropTypes.shape({
            user: PropTypes.object.isRequired
        }),
        // action
        action: PropTypes.shape({
            getListEmployee: PropTypes.func.isRequired
        })
    };

    static defaultProps = {};

    state = {
        loading: true,
        listId: [],
        isClickedFilter: false,
        visible: false,
        totalBalance: 0,
        activated: false,
        creditActivated: false,
        employeeData: [],
        employeeDataSearch: [],
        searchValue: false,
        searchString: '',
        importVisible: false,
        fileList: [],
        uriExport: '/get-employee-csv'
    };

    componentDidMount() {
        const { isTama } = AuthStorage;
        if (isTama) {
            this.getListCompanies();
        }
        this.getListEmployees();
    }

    getListEmployees = () => {
        this.setState({ loading: true });
        const { isTama, isCompany, isRestaurant, isEmployee, idInfo, userId, email } = AuthStorage;
        let payload = {};
        if (isTama) {
            payload = {
                pagination: false
            };
        } else if (isCompany) {
            ////http://t-api.kyanon.digital/api/employees?company=6&pagination=false
            payload = {
                pagination: false,
                company: idInfo
            };
        }
        this.props.action.getListEmployees(
            payload,
            (resp) => {
                this.setState({
                    loading: false,
                    employeeData: this.props.store.user.data,
                    isTama: true
                });
            },
            () => {
                this.setState({ loading: false });
            }
        );

    };

    getListCompanies = () => {
        this.props.action.getListCompanies(
            { pagination: false },
            () => this.setState({ loading: false }),
            () => this.setState({ loading: false })
        );
    };

    handelDeleteEmployees = id => {
        const payload = {
            id
        };

        this.props.action.deleteEmployees(
            payload,
            () => {
                this.getListEmployees();
                this.setState({ loading: false });
            },
            () => {
                //
                this.setState({ loading: false });
            }
        );
    };
    _filter = () => {
        this.setState({
            isClickedFilter: !this.state.isClickedFilter
        });
    };

    hide = () => {
        this.setState({
            visible: false
        });
    };

    _handleVisibleChange = visible => {
        this.setState({ visible });
    };

    showModal = () => {
        this.setState({
            visible: true,
            loading: true
        });

    };

    handleDeactivated = () => {
        // console.log(this.state.listId);
        const seft = this;
        const idUsersArray = [];
        const payload = [];
        let isDoDeactivated = true;
        confirm({
            title: 'Confirmez-vous la désactivation des éléments sélectionnés?',
            content: 'Lorsque vous cliquez sur le bouton OK, cette boîte de dialogue sera fermée après 1 seconde',
            onOk() {
                seft.state.listId.map((item) => {
                    if (seft.state.searchValue === true) {
                        if (item.activated === false || item.creditActivated === false) {
                            isDoDeactivated = false;
                        }
                        // const idUsersArray = {
                        //     id: item.user.id,
                        //     activated: false,
                        //     creditActivated: false
                        // };
                        idUsersArray.push(item.userId);
                    } else {
                        if (item.user.activated === false || item.user.creditActivated === false) {
                            isDoDeactivated = false;
                        }
                        // const idUsersArray = {
                        //     id: item.user.id,
                        //     activated: false,
                        //     creditActivated: false
                        // };
                        idUsersArray.push(item.user.id);
                    }

                });
                if (isDoDeactivated === true) {
                    idUsersArray.map((id) => {
                        payload.push({
                            'id': id,
                            // 'activated': false,
                            'creditActivated': false
                        });
                    });
                    console.log(payload);
                    seft.deactivatedUsers(payload);
                } else {
                    message.error('Un ou plusieurs compte(s) sont déjà désactivés');
                }
            },
            onCancel() {
            }
        });
    };

    deactivatedUsers = (payload = []) => {
        this.props.action.deactivatedUsersRequest(
            payload,
            (next) => {
                if (next.message.includes('Mise à jour des données avec succès') && next.statusCode === 200) {
                    message.success(next.message);
                } else {
                    message.error(next.message);
                }
                if (this.state.searchValue === true) {
                    this.handleSearch(this.state.searchString);
                } else {
                    this.getListEmployees();
                }

                this.setState({ loading: false });
            },
            (next) => {
                message.success(next.message);
                this.setState({ loading: false });
            }
        );
    };

    handelUpdateUser = (payload = {}) => {
        this.props.action.updateUserInfor(
            payload,
            () => {
                this.setState({ loading: false });
                this.success();
                Router.pushRoute('/employees');
            },
            () => {
                this.setState({ loading: false });
            }
        );
    };

    handleImport = () => {
        const { fileList } = this.state;

        this.setState({
            loading: true
        });

        if (fileList.length) {
            const payload = {
                entity: 'employee',
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
                    this.getListEmployees();
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

    handleSearch = (searchStr) => {
        this.setState({ loading: true });
        if (searchStr === '') {
            this.getListEmployees();
        }

        const { isTama, isCompany, isRestaurant, isEmployee, idInfo, userId, email } = AuthStorage;
        let payload = {};
        if (isTama) {
            payload = {
                params: {
                    query: searchStr
                }
            };
        } else if (isCompany) {
            payload = {
                params: {
                    query: searchStr,
                    company_Id: idInfo
                }
            };
        }
        this.props.action.searchEmployee(
            {
                ...payload
            },
            (res) => {
                const { searchList } = this.props.store;
                console.log(searchList);
                this.setState({
                    searchValue: true,
                    searchString: searchStr,
                    loading: false,
                    employeeData: [...res]
                });
            },
            () => {
                this.setState({ loading: false });
            }
        );
    };

    clearSearch = searchString => {
        if (searchString.length > 0) return;
        else {
            this.getListEmployees();
        }
    };

    success = () => {
        message.success('Employé désactivé avec succès!');
    };

    handleDeleteEmployees = () => {
        const { listId } = this.state;
        // this.handelDeleteEmployees(1);

        if (listId && listId.length > 0) {
            listId.forEach((item, index) => {
                this.handelDeleteEmployees(item.id);
            });
        }
    };

    linkToCreateEmployee = () => {
        Router.pushRoute('/create-employee');
    };

    handleOkAffect = () => {
        this.setState({
            // ModalText: 'The modal will be closed after two seconds',
            loading: true,
            confirmLoading: true
        });
        const { isTama, isCompany, idInfo } = AuthStorage;
        const _id = [];
        this.state.listId.map(
            row => {
                console.log(row);
                _id.push(Number(row.user.id));
            }
        );

        const payload = {
            listID: _id,
            amount: this.state.balance,
            noteMain: this.state.noteMain ? this.state.noteMain : null,
            noteSub: this.state.noteSub ? this.state.noteSub : null
        };

        this.props.action.affectCredit(
            payload,
            (res) => {
                const { message: data = {} } = this.props.store;
                console.log(data.data);
                if (data.data.statusCode && data.data.statusCode === 200) {
                    if (this.state.searchValue === true) {
                        this.handleSearch(this.state.searchString);
                    } else {
                        this.getListEmployees();
                    }
                    message.success(data.data.message);
                    this.setState({
                        loading: false,
                        visible: false,
                        confirmLoading: false
                    });
                } else {
                    message.error(data.data.message);
                    //this.getListEmployees();
                }
            },
            () => this.setState({ loading: false })
        );
        setTimeout(() => {
            this.setState({
                visible: false,
                totalBalance: 0,
                confirmLoading: false
            });
        }, 2000);
    };

    handleCancel = () => {
        this.setState({
            visible: false,
            confirmLoading: false,
            loading: false,
            totalBalance: 0,
            importResultVisible: false,
            importVisible: false,
            fileList: []
        });
    };

    handleDownloadSampleFile = () => {
        const linkSource = domain + '/sample/import/employee_sample_data.csv';
        const downloadLink = document.createElement('a');
        // const fileName = 'restaurants.pdf';

        downloadLink.href = linkSource;
        // downloadLink.download = fileName;
        downloadLink.click();
    };

    handleCancelModalDeactivated = () => {
        this.setState({
            visibleDeactivated: false
        });
    };

    validateWithCurrentBalances = (rule, value, callback) => {
        if (value % 1 !== 0) {
            callback('* S\'il vous plaît entrer entier uniquement');
        } else {
            let totalBalance = value * this.state.listId.length;
            this.setState({ totalBalance, balance: value });
        }
    };

    setListId = listId => {
        this.setState({ listId: [...listId] });
    };

    render() {
        const {
            classes,
            store: {
                user = {},
                companies = [],
                message = {}
            }
        } = this.props;
        const { listId, loading, fileList } = this.state;
        const { getFieldDecorator } = this.props.form;
        let companyList = [];
        companies.map((item) => {
            let oneCompany = {
                text: item.name,
                value: item.name
            };
            companyList.push(oneCompany);
        });
        const routes = [
            {
                breadcrumbName: <FormattedMessage id="employees.name" defaultMessage="Employees"/>
            }
        ];
        const dataExport = this.state.employeeData.length > 0 && this.state.employeeDataSearch;

        const openModalImportCSV = () => {
            this.setState({ importVisible: true });
        };

        const menuMore = (
            <Menu>
                <Menu.Item
                    key="restaurant-more-import"
                    onClick={() => openModalImportCSV()}>
                    <Button className="ant-btn ant-btn-link">
                        <Icon type="import"/>
                        <FormattedMessage id="import" defaultMessage="Import"/>
                    </Button>
                </Menu.Item>
                {/* <Menu.Item key="restaurant-more-download" onClick={() => this.handleDownloadSampleFile()}>
                    <Button type="link">
                        <Icon type="download"/>
                        <FormattedMessage id="download" defaultMessage="Download sample file"/>
                    </Button>
                </Menu.Item> */}
                <Menu.Item
                    key="restaurant-more-export"
                    // onClick={this.handleExportQRCode}
                    >
			        <Icon type="export" />
                    <ExportButton uri={this.state.uriExport} selectedRows={this.state.listId}/>
                    {/* <FormattedMessage id="export" defaultMessage="Export"/> */}
                </Menu.Item>
            </Menu>
        );
        const totalBalance = numberWithSpaces(this.state.totalBalance);
        const temp = [...this.state.employeeData];
        return (
            <>
                <Breadcrumb
                    breadcrumb={routes}
                    //  title="ss"
                />
                <Card style={{ minHeight: 360, marginTop: '16px' }} bordered={false}>
                    {/* <div style={{ margin: '-16px 0' }}>All Employees</div> */}
                    <Row type="flex" justify="space-between">
                        {/* <Col span={14} md={12}> */}
                        {/* <FormattedMessage id="employees.headerContent" defaultMessage="All Employees" /> */}
                        {/* <HeaderContent name="All Employees" /> */}
                        <h3>
                            <strong>
                                <FormattedMessage id="employees.headerContent"
                                                  defaultMessage="All Employees"/>
                            </strong>
                        </h3>

                        {/* </Col> */}
                        {/* <Col span={10} md={12}> */}
                        <Row type="flex" justify="end" align="middle">
                            <Col>
                                <Row type="flex" justify="end">
                                    <Search
                                        placeholder="Rechercher dans tous les champs"
                                        className={classes.btnSearch}
                                        onSearch={value => this.handleSearch(value)}
                                        onChange={e => this.clearSearch(e.target.value)}
                                    />
                                </Row>
                            </Col>
                            <Col className={classes.wrapperCreateNew}>
                                <Row type="flex" justify="center">
                                    <Button type="link" onClick={this.linkToCreateEmployee}>
                                        <Icon type="plus"/>
                                        <FormattedMessage id="employees.create"
                                                          defaultMessage="Create employee"/>
                                    </Button>
                                </Row>
                            </Col>
                            <Col>
                                <Row>
                                    <Button className="ant-btn ant-btn-link"
                                            onClick={this.showModal}
                                            disabled={this.state.listId.length === 0}>
                                        <Icon type="dollar"/>
                                        <FormattedMessage id="affect" defaultMessage="Affect"/>
                                    </Button>
                                </Row>
                            </Col>
                            <Col>
                                <Row type="flex" justify="end">
                                    <Dropdown overlay={menuMore} trigger={['click']}
                                              placement="bottomRight">
                                        <Icon type="more"/>
                                    </Dropdown>
                                </Row>
                            </Col>
                        </Row>
                        {/* </Col> */}
                    </Row>
                    <Modal
                        destroyOnClose={true}
                        title={<FormattedMessage id="employees.affect"
                                                 defaultMessage="Affect employees"/>}
                        visible={this.state.visible}
                        onOk={this.handleOkAffect}
                        confirmLoading={this.state.confirmLoading}
                        onCancel={this.handleCancel}
                        footer={[
                            <Button key="back"
                            // loading={this.state.confirmLoading}
                                    onClick={this.handleCancel}>
                                <FormattedMessage id="cancel" defaultMessage="Cancel"/>
                            </Button>,
                            <Button
                                key="affect"
                                type="primary"
                                loading={this.state.confirmLoading}
                                onClick={this.handleOkAffect}>
                                <FormattedMessage id="affect" defaultMessage="Affect"/>
                            </Button>
                        ]}>
                        <Form>
                            <Form.Item label={<FormattedMessage id="amountEachEmployee"
                                                                defaultMessage="Amount of each employee"/>}>
                                {getFieldDecorator('amount', {
                                    rules: [
                                        {
                                            validator: this.validateWithCurrentBalances
                                        }
                                    ]
                                })(<NumericInput
                                    placeholder={'Amount is affected for employee(s) '}
                                    negative={false}
                                    float={false}
                                    onChange={value => {
                                        this.setState({ balance: value });
                                    }}
                                />)}
                            </Form.Item>
                            <Text>
                                <FormattedMessage id="employees.totalBalance"
                                                  defaultMessage="Total balances"/>: {totalBalance}{' '}
                                {CONSTANTS.CURRENCY}
                            </Text>
                            <Form.Item className={classes.inputNote}>
                                <Input.Group compact>
                                    <Input className={classes.inputNoteMain}
                                           placeholder="Note 1"
                                           onChange={value => {
                                               this.setState({ noteMain: value.target.value });
                                           }}/>
                                    <Input
                                        className={classes.inputNoteMain}
                                        placeholder="Note 2"
                                        onChange={value => {
                                            this.setState({ noteSub: value.target.value });
                                        }}/>
                                </Input.Group>
                            </Form.Item>
                        </Form>
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
                    <div className={classes.main}>
                        <Spin spinning={loading}>
                            <ListEmployees companies={companyList} data={temp} isSearch={false}
                                           setListId={this.setListId}/>

                        </Spin>

                    </div>

                </Card>
            </>
        );
    }
}
