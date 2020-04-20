import React, { PureComponent } from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import QRCode from 'qrcode.react';
import TableCredits from './Table/index.js';
import injectSheet from 'react-jss';
import {
    FormattedRelative,
    FormattedMessage,
    defineMessages
} from 'react-intl';
import {
    Button,
    Col,
    DatePicker,
    Dropdown,
    Form,
    Icon,
    Input,
    Layout,
    Modal,
    Radio,
    Row,
    Select,
    Switch,
    Typography,
    message,
    Divider,
    Card,
    Tag, Collapse
} from 'antd';

import { Router, Link } from 'src/routes';

import { loginRequest } from 'src/redux/actions/auth';
import AuthStorage from 'src/utils/AuthStorage';
import Loading from 'src/components/Loading/index.js';
import styles from './styles';
import CONSTANTS from 'src/constants';
import { editRestaurant, getDetailRestaurant } from 'src/redux/actions/restaurant';
import { getListTransactions, getCreditsByUserId } from 'src/redux/actions/transactions';
import { updateUserInfor } from 'src/redux/actions/user';

const { confirm } = Modal;
const { Option } = Select;
const { RangePicker } = DatePicker;
const { Panel } = Collapse;

// import NormalDay from './NormalDay';
// import ExceptionDay from './ExceptionDay';

function mapStateToProps(state) {
    return {
        store: {
            transactions: state.transactions.list,
            user: state.restaurant.details,
            credits: state.transactions.listCredits
        }
    };
}

const mapDispatchToProps = dispatch => {
    return {
        action: bindActionCreators(
            {
                getListTransactions,
                editRestaurant,
                updateUserInfor,
                getDetailRestaurant,
                getCreditsByUserId
            },
            dispatch
        )
    };
};

const { Text, Title } = Typography;
const { Search } = Input;

function numberWithSpaces(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
}

const formItemLayout = {
    labelCol: {
        xs: { span: 24 },
        sm: { span: 5 }
    },
    wrapperCol: {
        xs: { span: 24 },
        sm: { span: 12 }
    }
};

const formItemLayoutWithOutLabel = {
    wrapperCol: {
        xs: { span: 24, offset: 0 },
        sm: { span: 20, offset: 4 }
    }
};

let result = {};

@Form.create()
@connect(
    mapStateToProps,
    mapDispatchToProps
)
@injectSheet(styles)
export default class RestaurantCredits extends PureComponent {
    static propTypes = {
        store: PropTypes.shape({
            auth: PropTypes.object.isRequired
        }).isRequired,
        action: PropTypes.shape({
            loginRequest: PropTypes.func.isRequired
        }).isRequired
    };

    static defaultProps = {};

    state = {
        loading: true,
        activated: true,
        isSwitcherOn: this.props.activated,
        sorter: {
            'Monday': 1,
            'Tuesday': 2,
            'Wednesday': 3,
            'Thursday': 4,
            'Friday': 5,
            'Saturday': 6,
            'Sunday': 7
        },
        exceptionDays: []
    };

    getListTransactions(dates, dataString) {
        const payload = {
            query: this.props.details.email,
            'type[0]': 'REFUND',
            pagination: false
            // "order[date]": 'desc',
        };

        if (dates) {
            const temp1 = String(dataString[0]);
            const temp2 = String(dataString[1]);
            const date1 = moment(temp1, 'DD/MM/YYYY').format('YYYY-MM-DD 00:00:00');
            const date2 = moment(temp2, 'DD/MM/YYYY').format('YYYY-MM-DD 23:59:59');
            payload['date[after]'] = date1;
            payload['date[before]'] = date2;
        }

        // console.log('payload', payload);

        this.props.action.getCreditsByUserId(
            payload,
            () => {
                this.setState({ loading: false });
            },
            () => {
                this.setState({ loading: false });
            }
        );
    }

    componentDidMount() {
        this.getListTransactions();
        result = { ...this.props.details.openingHours };
    }

    handleActivated = () => {
        const {
            id,
            activated,
            creditActivated
        } = this.props.details.user;

        const payload = {
            id,
            creditActivated: !creditActivated
        };
        if (activated) {
            this.props.action.updateUserInfor(
                payload,
                () => {
                    this.setState({ loading: false });
                    message.success('Mise à jour réussie');
                    // message.success(
                    //     <FormattedMessage
                    //         id="restaurants.account.updateSuccessfully"
                    //         defaultMessage="Update data successfully"/>);
                    this.props.handleGetRestaurantDetail(this.props.details.id);
                },
                () => {
                    this.setState({ loading: false });
                    message.error('Error');
                }
            );
        } else message.error('You must activate your account first');
    };

    onChangeSwitcher = () => {
        const self = this;

        const {
            user: { activated, creditActivated, customId }
        } = this.props.details;

        confirm({
            title: 'Confirmer',
            content: `Confirmez-vous ${activated ? 'la désactivation' : 'l\'activation'} des crédits de ce restaurant?`,
            onOk() {
                self.handleActivated();
            },
            okText: 'Qui',
            onCancel() {
            },
            cancelText: 'Non'
        });
    };

    getExceptionDay = name => {
        this.setState({
            exceptionDays: [...this.state.exceptionDays,
                `${name[0] || ''} ${name[1] || ''} ${name[2] && 'of ' + name[2] || ''}`]
        });
    };

    handleGetAcceptedDay = (_state, store, _name) => {
        if (_state === false) delete (result[_name]);
        if (_state === true && store.length > 0) {
            result = { ...result, [_name.trim()]: [...store] };
            console.log(result);
        } else {
            delete result[_name];
        }
        // this.props.getAcceptedDay(result)
    };

    removeDay(index) {
        this.setState({ exceptionDays: this.state.exceptionDays.filter((day, i) => i !== index) });
    }

    render() {
        const {
            loading,
            sorter
        } = this.state;

        const { classes, details, store: { credits = {} } } = this.props;
        let dataTransactions = [...credits.data];
        // console.log(dataTransactions);
        const { getFieldDecorator, getFieldValue } = this.props.form;
        const {
            id,
            // activated,
            openingHours,
            balance,
            user: {
                activated,
                creditActivated
            }
        } = details;

        // console.log(this.props.details);
        const transactions = this.props.store.transactions.data;
        // console.log(transactions);

        /* --PANH--
         * Add sorter state
         * keys
        */
        //    const noException = ({ exceptions, ...rest }) => rest
        //    const normal = noException(openingHours)
        // console.log(normal);
        return (
            <div className={[classes.subContainer]}>
                <Row type="flex" justify="space-between" align="top">
                    <Col>
                        <Title level={4}>
                            <FormattedMessage
                                id="restaurants.credits.creditInformation"
                                defaultMessage="Credit information"/>
                        </Title>
                    </Col>
                    <Col>
                        <Button type="link">
                            <Icon type="download"/>
                            <FormattedMessage
                                id="restaurants.credits.export"
                                defaultMessage="Export"/>
                        </Button>
                    </Col>
                </Row>
                <Row>
                    <Col xl={12} md={24} className={classes.currentBalance}>
                        <Card style={{boxShadow: '2px 2px 10px lightgrey'}}>
                            <Row type="flex" align="middle" justify="space-between">
                                <Col>
                                    <Text strong>
                                        <FormattedMessage
                                            id="restaurants.credits.currentBalance"
                                            defaultMessage="Current Balance"/>
                                    </Text>
                                </Col>
                                <Col>
                                    <div style={{float: 'right', width: '100%'}}>
                                        <Row>
                                            <Text className={classes.creditTag}>
                                                {balance ? numberWithSpaces(balance) : 0}
                                                <span style={{ fontSize: '12px', padding: '0 10px' }}>
                                                {CONSTANTS.CURRENCY}
                                            </span>
                                            </Text>
                                        </Row>
                                    </div>
                                </Col>
                            </Row>
                        </Card>
                    </Col>
                </Row>
                <Row className={classes.headerBar} type="flex" align="middle"
                     justify='space-between'>
                    <Col className={classes.marginTopBottom}>
                        <Row>
                            <RangePicker
                                // ranges={{
                                //     'Today': [moment().startOf('date'), moment().endOf('date')],
                                //     'This Month': [moment().startOf('month'), moment().endOf('month')]
                                // }}
                                format="DD/MM/YYYY"
                                onChange={
                                    this.getListTransactions
                                }
                            />
                        </Row>
                    </Col>
                </Row>
                <div>
                    <TableCredits data={dataTransactions}/>
                </div>
            </div>
        );
    }
}
