import React, { PureComponent } from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import QRCode from 'qrcode.react';

import FieldEditor from 'src/components/Input/Edit';
import EditNumeric from 'src/components/Input/EditNumeric';
import EditTextArea from 'src/components/Input/EditTextArea';
import EditDatetimePicker from 'src/components/Input/EditDatetimePicker';
import UploadImages from 'src/components/Upload/Images';
import NormalDay from 'src/containers/CompanyDetail/Credits/CreditConditions/NormalDay';
import ExceptionDay from 'src/containers/CompanyDetail/Credits/CreditConditions/ExceptionDay';

import ConditionEdit from 'src/containers/CompanyDetail/Credits/CreditConditions/NormalDay/edit';

import injectSheet from 'react-jss';
import {
    Form,
    Input,
    // InputNumber,
    DatePicker,
    Select,
    Button,
    Upload,
    Icon,
    Modal,
    Typography,
    Row,
    Col,
    Avatar,
    TimePicker,
    Tabs,
    Divider,
    Radio,
    Card,
    message,
    Switch,
    Collapse,
    Tooltip
} from 'antd';
import { FormattedRelative, FormattedMessage, defineMessages } from 'react-intl';
import { Router, Link } from 'src/routes';

import { loginRequest } from 'src/redux/actions/auth';
import AuthStorage from 'src/utils/AuthStorage';
import Loading from 'src/components/Loading/index.js';
import styles from './styles';
import { uploadRestaurantImages, deleteRestaurantImages } from 'src/redux/actions/restaurantImages';
import { editRestaurant } from 'src/redux/actions/restaurant';
import { getListIsland } from 'src/redux/actions/island';
import { getListTowns } from 'src/redux/actions/town';

const FormItem = Form.Item;
const { Option } = Select;
const { Title, Paragraph, Text } = Typography;
const { TabPane } = Tabs;
const { confirm } = Modal;
const { Dragger } = Upload;
const { Panel } = Collapse;

const domain = process.env.API_URL.slice(0, process.env.API_URL.lastIndexOf('/'));

function mapStateToProps(state) {
    return {
        store: {
            user: state.restaurant.details,
            islands: state.islands.list,
            cities: state.towns.list
        }
    };
}

const mapDispatchToProps = dispatch => {
    return {
        action: bindActionCreators(
            {
                editRestaurant,
                getListIsland,
                getListTowns,
                uploadRestaurantImages,
                deleteRestaurantImages
            },
            dispatch
        )
    };
};
@injectSheet(styles)
@connect(
    mapStateToProps,
    mapDispatchToProps
)
@Form.create()
export default class RestaurantDetails extends PureComponent {
    static propTypes = {
        store: PropTypes.shape({
            auth: PropTypes.object.isRequired,
            user: PropTypes.object.isRequired
        }).isRequired,
        action: PropTypes.shape({
            loginRequest: PropTypes.func.isRequired
        }).isRequired
    };

    static defaultProps = {};

    state = {
        loading: true,
        previewVisible: false,
        cascader: false,
        value: '',
        changeAvatarVisible: false,
        confirmLoading: false,
        fileAvatar: []
    };

    onChangeDate = (field, value) => {
        this.setState({
            [field]: value
        });
    };

    componentDidMount() {
        const { island } = this.props.details;
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

        // console.log(this.props.store);
    }

    handleCancel = () => this.setState({ previewVisible: false, isClickEdit: false });
    handleCancelChangeAvatar = () => this.setState({ changeAvatarVisible: false });

    handlePreview = async file => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
        }

        this.setState({
            previewImage: file.url || file.preview,
            previewVisible: true
        });
    };

    handleChange = ({ fileList }) => this.setState({ fileList });
    handleChangeAvatar = () => {
        const { fileAvatar } = this.state;
        const { id } = this.props.details.user;
        if (fileAvatar.length) {
            const avatarPayload = {
                id,
                files: fileAvatar.map((each, index) => {
                    return {
                        field: 'avatar',
                        file: this.state.fileAvatar[0].originFileObj
                    };
                })
            };

            this.props.action.uploadRestaurantImages(
                avatarPayload,
                nextPhoto => {
                    if (nextPhoto[0].status === 'success') {
                        this.setState({ changeAvatarVisible: false, fileAvatar: [] });
                        this.props.handleGetRestaurantDetail(this.props.details.id);
                        message.success(
                            <FormattedMessage id="restaurants.create.popupMessage.isSuccess"
                                              defaultMessage="Success"/>,
                            2
                        );
                    } else {
                        message.error(
                            <FormattedMessage id="restaurants.create.popupMessage.isFailed"
                                              defaultMessage="Failed"/>,
                            2
                        );
                    }
                    this.setState({
                        loading: false,
                        loadingSubmit: false
                    });
                },
                nextPhotoErr => {
                    this.setState({
                        loading: false,
                        loadingSubmit: false
                    });
                }
            );
        } else {
            message.error('Please select your avatar');
        }
    };
    handleDeletePhoto = (deleteImage) => {
        // console.log(deleteImage);
        const { id } = this.props.details.user;

        const deletePayload = {
            id,
            file_id: [deleteImage.id]
        };
        this.props.action.deleteRestaurantImages(
            deletePayload,
            next => {
                if (next[0].status === 'success') {
                    this.props.handleGetRestaurantDetail(this.props.details.id);
                    message.success(
                        <FormattedMessage id="restaurants.create.popupMessage.isSuccess"
                                          defaultMessage="Success"/>,
                        2
                    );
                } else {
                    message.error(
                        <FormattedMessage id="restaurants.create.popupMessage.isFailed"
                                          defaultMessage="Failed"/>,
                        2
                    );
                }
                this.setState({
                    loading: false
                });
            },
            nextErr => {
                this.setState({
                    loading: false
                });
            }
        );
    };
    handleUploadPhoto = (info) => {
        this.setState({ fileList: info.fileList });

        const { id, photo, user } = this.props.details;
        const { status } = info.file;

        if (status && status === 'done') {
            const photoPayload = {
                id: user.id,
                files: [{
                    field: 'photo',
                    file: info.file.originFileObj
                }]
            };
            console.log(photoPayload);
            this.props.action.uploadRestaurantImages(
                photoPayload,
                nextPhoto => {
                    console.log('NextPhoto', nextPhoto);
                    if (nextPhoto.status === 'success') {
                        this.props.handleGetRestaurantDetail(this.props.details.id);
                        message.success(
                            <FormattedMessage id="restaurants.create.popupMessage.isSuccess"
                                              defaultMessage="Success"/>,
                            2
                        ).then(() => {
                                this.setState({ fileList: undefined });
                            }
                        );
                    } else {
                        message.error(
                            <FormattedMessage id="restaurants.create.popupMessage.isFailed"
                                              defaultMessage="Failed"/>,
                            2
                        );
                    }
                    this.setState({ loading: false });
                },
                nextPhotoErr => {
                    this.setState({ loading: false });
                }
            );
        } else {
            console.log(info.fileList);
        }
    };

    onChangeValue = (value) => {
        this.setState({
            value: value
        }, () => {
            // console.log(this.state.value);
        });
    };

    onChange(e) {
        const target = e.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        this.setState({ [name]: value });
    }

    handleUpdateInformation = (name, value) => {
        const { id } = this.props.details;
        const payload = {
            id,
            [name]: value
        };
        this.props.action.editRestaurant(
            payload,
            next => {
                this.setState({ loading: false });
                if (next.title !== 'An error occurred') {
                    this.props.handleGetRestaurantDetail(id);
                } else {
                    message.error(next.detail);
                }
            },
            nextErr => this.setState({ loading: false })
        );
    };

    handleEdit = () => {
        this.setState({ cascader: true });
        const { island } = this.props.details;
        if (island) {
            this.props.action.getListTowns(
                () => this.setState({ loading: false }),
                () => this.setState({ loading: false }),
                {
                    island: island ? island.id : '',
                    pagination: false
                }
                // island.id
            );
        }
    };

    onSelectChange(e, name) {
        const { island } = this.props.details;
        if (name && name === 'city') {
            this.setState({ [name]: `/api/cities/${e}` });
        } else {
            this.setState({ [name]: `/api/islands/${e}` });
            // this.props.form.resetFields();
            this.props.action.getListTowns(
                () => this.setState({ loading: false }),
                () => this.setState({ loading: false }),
                {
                    island: e,
                    pagination: false
                }
            );
        }
    }

    handleSelectUpdate = () => {
        this.props.form.validateFields((err, fieldsValue) => {
            if (!err) {
                const { id } = this.props.details;
                const { island, city } = this.state;
                const payload = {
                    id,
                    city,
                    island
                };
                // console.log(payload);
                this.props.action.editRestaurant(
                    payload,
                    next => {
                        this.setState({ loading: false });
                        if (next.title !== 'An error occurred') {
                            this.props.handleGetRestaurantDetail(id);
                            this.setState({ cascader: false });
                        } else {
                            message.error(next.detail);
                        }
                    },
                    nextErr => this.setState({ loading: false })
                );
            } else {
                message.error(err);
            }
        });
    };

    galleryFormat = (photo) => {
        if (photo.constructor === Array) {
            return photo.map((each) => {
                return {
                    ...each,
                    uid: each.id,
                    url: domain + each.path
                };
            });
        } else {
            return [{
                ...photo,
                uid: photo.id,
                url: domain + photo.path
            }];
        }
    };

    openChangeAvatarModal = () => {
        this.setState({
            changeAvatarVisible: true
        });
    };

    render() {
        const { getFieldDecorator, getFieldValue } = this.props.form;

        const {
            loading,
            previewVisible,
            previewImage,
            _avatar,
            fileList,
            fileAvatar
        } = this.state;

        const { classes } = this.props;

        const {
            activated,
            address,
            avatar,
            bankAccountNumber,
            bankName,
            cardAccepted,
            companyRegistration,
            corporateName,
            description,
            facebook,
            id,
            images,
            instagram,
            island,
            city,
            joinDate,
            latitude,
            longitude,
            managerFirstName,
            managerLastName,
            managerPhoneNumber,
            openingHours,
            phoneNumber1,
            phoneNumber2,
            qrcode,
            refundDate,
            restaurantBalance,
            email,
            restaurantName,
            salesCommissionPolicy,
            website,
            user,
            photo, restriction
        } = this.props.details;
        console.log(openingHours)
        const {
            cities,
            islands
        } = this.props.store;


        const noException = ({ exceptions, ...rest }) => rest;
        const normal = noException(openingHours);
        const customPanelStyle = {
            // background: '#f7f7f7',
            borderRadius: 4,
            marginBottom: 24,
            borderBottom: 1,
            overflow: 'hidden'
        };
        return (
            <Card
                className={classes.detailMasterOver900}
                bordered={false}>
                <Row type='flex' justify='space-between'>
                    <Col span={8}>
                        <Row type='flex' align="middle">
                            <Avatar
                                style={{ marginRight: '30px' }}
                                shape="square"
                                size={160}
                                icon="user"
                                src={qrcode ? domain + qrcode : null}>
                                QR Code
                            </Avatar>
                            <Row
                                type='flex'
                                justify="center"
                                align="middle"
                                className="restaurantAvatarContainer"
                                onClick={this.openChangeAvatarModal}>
                                <Avatar
                                    className="restaurantAvatar"
                                    // style={{paddingLeft: '20px'}}
                                    shape="circle"
                                    size={140}
                                    icon="user"
                                    src={avatar ? domain + avatar.path : null}>
                                </Avatar>
                                <Icon
                                    type="upload"
                                    className="restaurantAvatarUploadIcon"/>
                            </Row>
                        </Row>
                    </Col>
                    <Col span={16}>
                        <Row className={classes.row}>
                            ID: {user.customId}
                        </Row>
                        <Row className={classes.row}>
                            <FieldEditor
                                value={restaurantName || ''}
                                name="restaurantName"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please input your restaurant name!'
                                    }
                                ]}
                                handleSave={this.handleUpdateInformation}/>
                        </Row>
                        <Row className={classes.row}>
                            <Text strong>
                                <FormattedMessage
                                    id="restaurants.details.description"
                                    defaultMessage="Description"/>
                            </Text>
                        </Row>
                        <Row className={classes.row}>
                            <EditTextArea
                                value={description || ''}
                                name="description"
                                rules={[
                                    {
                                        required: true,
                                        min: 17,
                                        max: 80,
                                        message: 'Description must contains 17 - 80 characters'
                                    }
                                ]}
                                // onChange={this.onChange}
                                handleSave={this.handleUpdateInformation}/>
                        </Row>
                        <Row className={classes.row}>
                            <Text strong>
                                <FormattedMessage
                                    id="restaurants.details.phoneNumber"
                                    defaultMessage="Phone number"/>
                            </Text>
                        </Row>
                        <Row className={classes.row}>
                            <EditNumeric
                                value={phoneNumber1 || ''}
                                name="phoneNumber1"
                                negative={false}
                                float={false}
                                addonBefore="+689"
                                rules={[
                                    {
                                        required: true,
                                        min: 7,
                                        max: 9,
                                        message: 'Le numéro de téléphone doit comporter entre 7 et 9 caractères (ne pas inclure +689)'
                                    }
                                ]}
                                onChange={this.onChange}
                                handleSave={this.handleUpdateInformation}/>
                        </Row>
                        <Row className={classes.row}>
                            <EditNumeric
                                value={phoneNumber2 || ''}
                                name="phoneNumber2"
                                negative={false}
                                float={false}
                                addonBefore="+689"
                                rules={[
                                    {
                                        // required: true,
                                        min: 7,
                                        max: 9,
                                        message: 'Le numéro de téléphone doit comporter entre 7 et 9 caractères (ne pas inclure +689)'
                                    }
                                ]}
                                onChange={this.onChange}
                                handleSave={this.handleUpdateInformation}/>
                        </Row>
                    </Col>
                </Row>
                <Divider/>
                <Row type='flex' justify='space-between' className={classes.row}>
                    <Col span={8}>
                        <Text strong>
                            <FormattedMessage
                                id="restaurants.details.address"
                                defaultMessage="Address"/>
                        </Text>
                    </Col>
                    <Col span={16}>
                        <FieldEditor
                            value={address || ''}
                            name="address"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input your restaurant address!'
                                }
                            ]}
                            handleSave={this.handleUpdateInformation}
                        />
                    </Col>
                </Row>
                {/* City - Island */}
                <Row type='flex' justify='space-between' className={classes.row}>
                    <Col span={8}>
                        <Text strong>
                            <FormattedMessage
                                id="restaurants.details.island"
                                defaultMessage="Island"/>
                        </Text>
                    </Col>
                    <Col span={16}>
                        <Row type='flex' justify='space-between' align='middle'>
                            <Col span={20}>
                                {!this.state.cascader ?
                                    (
                                        <Text>
                                            {island ? island.islandName : ''}
                                        </Text>
                                    )
                                    : (
                                        <Select
                                            className={classes.selectIslandCity}
                                            defaultValue={island ? island.islandName : ''}
                                            onChange={e => this.onSelectChange(e, 'island')}>
                                            {islands.data.map(island => (
                                                <Option key={island.id} value={island.id}>
                                                    {island.islandName}
                                                </Option>
                                            ))}
                                        </Select>
                                    )}
                            </Col>
                        </Row>
                    </Col>
                </Row>
                <Row type='flex' justify='space-between' className={classes.row}>
                    <Col span={8}>
                        <Text strong>
                            <FormattedMessage
                                id="restaurants.details.city"
                                defaultMessage="City"/>
                        </Text>
                    </Col>
                    <Col span={16}>
                        <Form>
                            {this.state.cascader ? (
                                    <Row type="flex" justify="space-between">
                                        <Col>
                                            <Form.Item className={classes.selectIslandCity}>
                                                {getFieldDecorator('city', {
                                                    rules: [
                                                        {
                                                            required: true,
                                                            message: 'Champ obligatoires'
                                                        }
                                                    ]
                                                })(
                                                    <Select
                                                        defaultValue={city ? city.cityName : ''}
                                                        onChange={e => this.onSelectChange(e, 'city')}>
                                                        {cities.data.map(town => (
                                                            <Option key={town.id} value={town.id}>
                                                                {town.cityName}
                                                            </Option>
                                                        ))}
                                                    </Select>
                                                )}
                                            </Form.Item>
                                        </Col>
                                        <Col>
                                            <Row type="flex">
                                                <Button.Group>
                                                <Button
                                                        style={{ border: '1px solid lightgrey' }}
                                                        onClick={() => this.setState({ cascader: false })}>
                                                        <FormattedMessage
                                                            id="cancel"
                                                            defaultMessage="Cancel"/>
                                                    </Button>{' '}
                                                    <Button onClick={this.handleSelectUpdate}
                                                            type="primary">
                                                        <FormattedMessage
                                                            id="save"
                                                            defaultMessage="Save"/>
                                                    </Button>

                                                </Button.Group>
                                            </Row>
                                        </Col>
                                    </Row>
                                )
                                : (
                                    <Input.Group compact>
                                        <Row style={{ display: 'flex', alignContent: 'center' }}>
                                            <Col span={20}>
                                                <Text>
                                                    {city ? city.cityName : ''}
                                                </Text>
                                            </Col>
                                            <Col span={4}>
                                                <Button type="link" onClick={this.handleEdit}>
                                                    <Icon type="form"/>
                                                    <FormattedMessage
                                                        id="edit"
                                                        defaultMessage="Edit"/>
                                                </Button>
                                            </Col>
                                        </Row>
                                    </Input.Group>
                                )}
                        </Form>
                    </Col>
                </Row>
                <Row type='flex' justify='space-between' className={classes.row}>
                    <Col span={8}>
                        <Text strong>
                            <FormattedMessage
                                id="restaurants.details.latitude"
                                defaultMessage="Latitude"/>
                        </Text>
                    </Col>
                    <Col span={16}>
                        <EditNumeric
                            value={latitude || ''}
                            name="latitude"
                            negative={true}
                            float={true}
                            // addonBefore="+689"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input latitude!'
                                }
                            ]}
                            output="number"
                            onChange={this.onChange}
                            handleSave={this.handleUpdateInformation}/>
                    </Col>
                </Row>
                <Row type='flex' justify='space-between' className={classes.row}>
                    <Col span={8}>
                        <Text strong>
                            <FormattedMessage
                                id="restaurants.details.longitude"
                                defaultMessage="Longitude"/>
                        </Text>
                    </Col>
                    <Col span={16}>
                        <EditNumeric
                            value={longitude || ''}
                            name="longitude"
                            // negative={false}
                            // float={false}
                            // addonBefore="+689"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input longitude!'
                                }
                            ]}
                            output="number"
                            onChange={this.onChange}
                            handleSave={this.handleUpdateInformation}/>
                    </Col>
                </Row>
                <Divider/>
                <Row type='flex' justify='space-between' className={classes.row}>
                    <Col span={8}>
                        <Text strong>
                            <FormattedMessage
                                id="restaurants.details.managerFirstName"
                                defaultMessage="Manager's first name"/>
                        </Text>
                    </Col>
                    <Col span={16}>
                        <FieldEditor
                            value={managerFirstName || ''}
                            name="managerFirstName"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input manager first name!'
                                }
                            ]}
                            handleSave={this.handleUpdateInformation}
                        />
                    </Col>
                </Row>
                <Row type='flex' justify='space-between' className={classes.row}>
                    <Col span={8}>
                        <Text strong>
                            <FormattedMessage
                                id="restaurants.details.managerLastName"
                                defaultMessage="Manager's last name"/>
                        </Text>
                    </Col>
                    <Col span={16}>
                        <FieldEditor
                            value={managerLastName || ''}
                            name="managerLastName"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input manager last name!'
                                }
                            ]}
                            handleSave={this.handleUpdateInformation}
                        />
                    </Col>
                </Row>
                <Row type='flex' justify='space-between' className={classes.row}>
                    <Col span={8}>
                        <Text strong>
                            <FormattedMessage
                                id="restaurants.details.managerPhoneNumber"
                                defaultMessage="Manager's phone"/>
                        </Text>
                    </Col>
                    <Col span={16}>
                        <EditNumeric
                            value={managerPhoneNumber || ''}
                            name="managerPhoneNumber"
                            negative={false}
                            float={false}
                            addonBefore="+689"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input your phone number!'
                                }, {
                                    min: 7,
                                    max: 9,
                                    message: 'Le numéro de téléphone doit comporter entre 7 et 9 caractères (ne pas inclure +689)'
                                }
                            ]}
                            onChange={this.onChange}
                            handleSave={this.handleUpdateInformation}/>
                    </Col>
                </Row>
                <Row type='flex' justify='space-between' className={classes.row}>
                    <Col span={8}>
                        <Text strong>
                            <FormattedMessage
                                id="restaurants.details.corporateName"
                                defaultMessage="Corporate name"/>
                        </Text>
                    </Col>
                    <Col span={16}>
                        <FieldEditor
                            value={corporateName || ''}
                            name="corporateName"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input corporate name!'
                                }
                            ]}
                            handleSave={this.handleUpdateInformation}
                        />
                    </Col>
                </Row>
                <Row type='flex' justify='space-between' className={classes.row}>
                    <Col span={8}>
                        <Text strong>
                            <FormattedMessage
                                id="restaurants.details.companyRegistration"
                                defaultMessage="Company registration"/>
                        </Text>
                    </Col>
                    <Col span={16}>
                        <FieldEditor
                            value={companyRegistration || ''}
                            name="companyRegistration"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input company registration!'
                                }
                            ]}
                            handleSave={this.handleUpdateInformation}
                        />
                    </Col>
                </Row>
                <Row type='flex' justify='space-between' className={classes.row}>
                    <Col span={8}>
                        <Text strong>
                            <FormattedMessage
                                id="restaurants.details.cardAccepted"
                                defaultMessage="Card accepted"/>
                        </Text>
                    </Col>
                    <Col span={16}>
                        <Switch
                            name="cardAccepted"
                            checked={cardAccepted}
                            // defaultChecked={cardAccepted}
                            onChange={(value) => {
                                confirm({
                                    title: 'Confirmer',
                                    content: `You want to change this attribute?`,
                                    onOk: () => this.handleUpdateInformation('cardAccepted', value),
                                    okText: 'Qui',
                                    onCancel() {
                                    },
                                    cancelText: 'Non'
                                });
                            }}
                            checkedChildren={
                                <FormattedMessage
                                    id="restaurants.create.cardAccepted.accept"
                                    defaultMessage="Accept"/>}
                            unCheckedChildren={
                                <FormattedMessage
                                    id="restaurants.create.cardAccepted.decline"
                                    defaultMessage="Decline"/>}
                        />
                    </Col>
                </Row>
                <Divider/>
                <Row type='flex' justify='space-between' className={classes.row}>
                    <Col span={8}>
                        <Text strong>
                            <FormattedMessage
                                id="restaurants.details.bankName"
                                defaultMessage="Bank name"/>
                        </Text>
                    </Col>
                    <Col span={16}>
                        <FieldEditor
                            value={bankName || ''}
                            name="bankName"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input bank name!'
                                }
                            ]}
                            handleSave={this.handleUpdateInformation}
                        />
                    </Col>
                </Row>
                <Row type='flex' justify='space-between' className={classes.row}>
                    <Col span={8}>
                        <Text strong>
                            <FormattedMessage
                                id="restaurants.details.bankAccountNumber"
                                defaultMessage="Account number"/>
                        </Text>
                    </Col>
                    <Col span={16}>
                        <EditNumeric
                            value={bankAccountNumber || ''}
                            name="bankAccountNumber"
                            negative={false}
                            float={false}
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input bank account number!'
                                }
                            ]}
                            onChange={this.onChange}
                            handleSave={this.handleUpdateInformation}/>
                    </Col>
                </Row>
                <Divider/>
                <Row>
                    <Collapse bordered={false}>
                        <Panel header={<Text strong>Opening hours</Text>} style={customPanelStyle}>
                            <Row>
                                {/* <Col xs={0} sm={0} md={0} lg={0} xl={3}></Col> */}
                                <Col md={24} lg={20} xl={20}>
                                     <ConditionEdit
						                normal={normal !== undefined ? normal : []}
						                exceptions={openingHours['exceptions'] !== undefined ? openingHours['exceptions'] : []}
						                id={id}
                                        stateName="openingHours"
                                        restriction={restriction}
					            />
                                </Col>
                            </Row>
                        </Panel>
                    </Collapse>
                </Row>
                <Divider/>
                <Row type='flex' justify='space-between' className={classes.row}>
                    <Col span={8}>
                        <Text strong>
                            <FormattedMessage
                                id="restaurants.details.saleCommissionPolicy"
                                defaultMessage="Sales commission policy"/>
                        </Text>
                    </Col>
                    <Col span={16}>
                        <EditTextArea
                            value={salesCommissionPolicy || ''}
                            name="salesCommissionPolicy"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input sales commission policy!'
                                }
                            ]}
                            handleSave={this.handleUpdateInformation}
                        />
                    </Col>
                </Row>
                <Row type='flex' justify='space-between' className={classes.row}>
                    <Col span={8}>
                        <Text strong>
                            <FormattedMessage
                                id="restaurants.details.joinDate"
                                defaultMessage="Join date"/>
                        </Text>
                    </Col>
                    <Col span={16}>
                        {joinDate ? moment(joinDate).format('DD/MM/YYYY') : ''}
                    </Col>
                </Row>
                <Row type='flex' justify='space-between' className={classes.row}>
                    <Col span={8}>
                        <Text strong>
                            <FormattedMessage
                                id="restaurants.details.refundDate"
                                defaultMessage="Refund date"/>
                        </Text>
                    </Col>
                    <Col span={16}>
                        <FieldEditor
                            // dateFormat='DD/MM/YYYY'
                            value={refundDate || ''}
                            name="refundDate"
                            rules={[{
                                required: true,
                                message: 'Please select refund date!'
                            }]}
                            handleSave={this.handleUpdateInformation}
                        />
                    </Col>
                </Row>
                <Divider/>
                <Row type='flex' justify='space-between' className={classes.row}>
                    <Col span={8}>
                        <Text strong>
                            <FormattedMessage
                                id="restaurants.details.facebook"
                                defaultMessage="Facebook"/>
                        </Text>
                    </Col>
                    <Col span={16}>
                        <FieldEditor
                            value={facebook || ''}
                            name="facebook"
                            rules={[
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
                                        } else {
                                            callback();
                                        }
                                    }
                                }
                            ]}
                            handleSave={this.handleUpdateInformation}
                        />
                    </Col>
                </Row>
                <Row type='flex' justify='space-between' className={classes.row}>
                    <Col span={8}>
                        <Text strong>
                            <FormattedMessage
                                id="restaurants.details.instagram"
                                defaultMessage="Instagram"/>
                        </Text>
                    </Col>
                    <Col span={16}>
                        <FieldEditor
                            value={instagram || ''}
                            name="instagram"
                            rules={[
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
                            ]}
                            handleSave={this.handleUpdateInformation}
                        />
                    </Col>
                </Row>
                <Row type='flex' justify='space-between' className={classes.row}>
                    <Col span={8}>
                        <Text strong>
                            <FormattedMessage
                                id="restaurants.details.website"
                                defaultMessage="Website"/>
                        </Text>
                    </Col>
                    <Col span={16}>
                        <FieldEditor
                            value={website || ''}
                            name="website"
                            rules={[
                                {
                                    type: 'url',
                                    message: 'Please input link to Website'
                                }
                            ]}
                            handleSave={this.handleUpdateInformation}
                        />
                    </Col>
                </Row>
                <Divider/>
                <Row type='flex' justify='space-between' className={classes.row}>
                    <Col span={8}>
                        <Text strong>
                            <FormattedMessage
                                id="restaurants.details.gallery"
                                defaultMessage="Gallery"/>
                        </Text>
                        <div>
                            <small>
                                <Icon type="info-circle"/>&nbsp;
                                <FormattedMessage
                                    id="restaurants.details.galleryMaximum10"
                                    defaultMessage="Maximum is 10 images"/>
                            </small>
                        </div>
                    </Col>
                    <Col span={16}>
                        <UploadImages
                            max={10}
                            fileList={
                                fileList ? fileList : this.setState({ fileList: this.galleryFormat(photo) })
                            }
                            multiple={true}
                            // fileList={photo ? this.galleryFormat(photo) : []}
                            handleChange={this.handleUploadPhoto}
                            onRemove={this.handleDeletePhoto}/>
                    </Col>
                </Row>
                <Modal
                    title="Change restaurant's avatar"
                    visible={this.state.changeAvatarVisible}
                    destroyOnClose={true}
                    // onOk={this.handleChangeAvatar}
                    // okText="Change"
                    // onCancel={this.handleCancelChangeAvatar}
                    // cancelText="Annuler"
                    closable={false}
                    footer={<Button.Group>
                        <Button style={{border: '1px solid lightgrey'}} onClick={this.handleCancelChangeAvatar}>Annuler</Button>{' '}
                        <Button type="primary" onClick={this.handleChangeAvatar}>Changer</Button>
                        </Button.Group>}
                    confirmLoading={this.state.confirmLoading}
                    >
                    <Dragger
                        name='file'
                        // multiple={true}
                        listType='picture'
                        fileList={fileAvatar}
                        action='https://www.mocky.io/v2/5cc8019d300000980a055e76'
                        beforeUpload={(file, FileList) => {
                            const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
                            if (!isJpgOrPng) {
                                message.error('You can only upload JPG/PNG file!');
                            }
                            const isLt2M = file.size / 1024 / 1024 < 2;
                            if (!isLt2M) {
                                message.error('Image must smaller than 2MB!');
                            }
                            return isJpgOrPng && isLt2M;
                        }}
                        onChange={(info) => {
                            const { status } = info.file;

                            if (status === 'done') {
                                message.success(`${info.file.name} file uploaded successfully.`);
                            } else if (status === 'error') {
                                message.error(`${info.file.name} file upload failed.`);
                            }

                            let fileList = [...info.fileList];

                            fileList = fileList.filter(() => {
                                    return ((info.file.type === 'image/jpeg' || info.file.type === 'image/png') && info.file.size / 1024 / 1024 < 2);
                                }
                            );

                            if (fileList.length > 1) {
                                fileList = fileList.slice(-1);
                            }

                            this.setState({ fileAvatar: fileList });
                        }}>
                        <p className="ant-upload-drag-icon">
                            <Icon type="inbox"/>
                        </p>
                        <p className="ant-upload-text">
                            {/* Click or drag file to this area to
                            upload */}
                            Cliquez ou faites glisser le fichier à cette zone
                            télécharger
                        </p>
                        <p className="ant-upload-hint">
                            Prise en charge unique ou téléchargement. Strictement interdire
                            transfert de données d'entreprise ou autre
                            fichier de bande
                            {/* Support for a single or bulk upload. Strictly prohibit from
                            uploading company data or other
                            band files */}
                        </p>
                    </Dragger>
                </Modal>
            </Card>
        );
    }
}
