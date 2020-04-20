import React, { PureComponent } from 'react';
import injectSheet from 'react-jss';
// import Router from 'next/router';
import { Layout, Menu, Icon } from 'antd';
import { FormattedRelative, FormattedMessage, defineMessages } from 'react-intl';

import { Router, Link } from 'src/routes';
import AuthStorage from 'src/utils/AuthStorage';

import styles from './styles';

const { Sider } = Layout;
const SubMenu = Menu.SubMenu;

@injectSheet(styles)
class SiderLayout extends PureComponent {
    state = {
        collapsed: false,
        current: 'dashboard',
        openKeys: ''
    };

    componentDidMount() {
        const current = Router.pathname.replace('/', '');
        this.setState({ current });
        this.defindRouter(current);
    }

    onCollapse = collapsed => {
        // console.log(collapsed);
        this.setState({ collapsed });
    };

    handleClick = e => {
        // console.log('click ', e);
        if (e !== this.state.openKeys) {
            this.setState({
                current: e.key,
                openKeys: e.keyPath[1]
            });
        }
        {
            this.setState({
                current: e.key,
                openKeys: ''
            });
        }
    };

    defindRouter = current => {
        console.log('current ===>', current);
        switch (current) {
            case 'companies': {
                this.setState({
                    current: 'companies'
                });
                break;
            }
            case 'create-company': {
                this.setState({
                    current: 'companies'
                });
                break;
            }
            case 'company-detail': {
                this.setState({
                    current: 'companies'
                });
                break;
            }
            case 'employees': {
                this.setState({
                    current: 'employees'
                });
                break;
            }
            case 'employee-details': {
                this.setState({
                    current: 'employees'
                });
                break;
            }
            case 'create-employee': {
                this.setState({
                    current: 'employees'
                });
                break;
            }
            case 'restaurants': {
                this.setState({
                    current: 'restaurants'
                });
                break;
            }
            case 'restaurants-detail': {
                this.setState({
                    current: 'restaurants'
                });
                break;
            }
            case 'restaurants-create': {
                this.setState({
                    current: 'restaurants'
                });
                break;
            }
            case 'credits-refund': {
                this.setState({
                    openKeys: 'credits'
                });
                break;
            }
            case 'credits-affection': {
                this.setState({
                    openKeys: 'credits'
                });
                break;
            }
            case 'credits-companies-employees': {
                this.setState({
                    openKeys: 'credits-history',
                    current: 'credits-history-companies-employees'
                });
                break;
            }
            case 'credits-companies': {
                this.setState({
                    openKeys: 'credits-history',
                    current: 'credits-history-companies'
                });
                break;
            }
            case 'credits-employees': {
                this.setState({
                    openKeys: 'credits-history',
                    current: 'credits-history-employees'
                });
                break;
            }
            case 'credits-restaurants': {
                this.setState({
                    openKeys: 'credits-history',
                    current: 'credits-history-restaurants'
                });
                break;
            }
            case 'users': {
                this.setState({
                    openKeys: 'settings'
                });
                break;
            }
            case 'settings-metadata': {
                this.setState({
                    openKeys: 'settings'
                });
                break;
            }
            case 'islands': {
                this.setState({
                    openKeys: 'settings'
                });
                break;
            }
            case 'island': {
                this.setState({
                    openKeys: 'settings',
                    current: 'islands'
                });
                break;
            }
            default: {
                this.setState({
                    openKeys: ''
                });
            }
        }
    };

    setSubMenu = e => {
        this.setState({ openKeys: e.key });
    };

    render() {
        const { classes } = this.props;
        const { current, openKeys, defaultSelectedKeys } = this.state;
        const { isTama, isCompany, isRestaurant, isEmployee } = AuthStorage;

        return (
            // <Sider collapsible collapsed={this.state.collapsed} onCollapse={this.onCollapse}>
            <Sider className={classes.sider}>
                <div className={classes.logo}>
                    <Link route="/">
                        <img src="/static/assets/images/logo/logo.png"/>
                    </Link>
                </div>
                <Menu
                    theme="dark"
                    onClick={this.handleClick}
                    defaultSelectedKeys={[`${current}`]}
                    mode="inline"
                    openKeys={[`${openKeys}`]}
                    defaultOpenKeys={[`${openKeys}`]}
                    selectedKeys={[this.state.current]}>
                    {isTama || isCompany || isRestaurant ? (
                        <Menu.Item key="dashboard" onClick={() => Router.pushRoute('/')}>
                            <Icon type="pie-chart"/>
                            <Link route="/">
                                <FormattedMessage id="nav.dashboard" defaultMessage="Dashboard"/>
                            </Link>
                        </Menu.Item>
                    ) : (
                        ''
                    )}

                    {isTama && (
                        <Menu.Item key="companies" onClick={() => Router.pushRoute('/companies')}>
                            <Icon type="home"/>
                            <FormattedMessage id="nav.companise" defaultMessage="Companies"/>
                        </Menu.Item>
                    )}

                    {isTama || isCompany ? (
                        <Menu.Item key="employees" onClick={() => Router.pushRoute('/employees')}>
                            <Icon type="team"/>
                            <FormattedMessage id="nav.employees" defaultMessage="Employees"/>
                        </Menu.Item>
                    ) : (
                        ''
                    )}

                    {isTama ? (
                        <Menu.Item
                            key="restaurants"
                            onClick={() => Router.pushRoute('/restaurants')}>
                            <Icon type="shop"/>
                            <FormattedMessage id="nav.restaurants" defaultMessage="Restaurants"/>
                        </Menu.Item>
                    ) : (
                        ''
                    )}

                    {isTama ? (
                        <SubMenu
                            key="credits"
                            onTitleClick={this.setSubMenu}
                            title={
                                <span>
									<Icon type="credit-card"/>
									<FormattedMessage id="nav.credits" defaultMessage="Credits"/>
								</span>
                            }>
                            {isTama && (
                                <Menu.Item
                                    key="credits-affection"
                                    onClick={() => Router.pushRoute('/credits-affection')}>
                                    <FormattedMessage
                                        id="nav.credits.affection"
                                        defaultMessage="Affection"/>
                                </Menu.Item>
                            )}

                            {/*<Menu.Item key="credits-affection-employee">*/}
                            {/*	<Link route="/credits-affection-employee">*/}
                            {/*		Affection Employee*/}
                            {/*	</Link>*/}
                            {/*</Menu.Item>*/}
                            {isTama && (
                                <Menu.Item key="credits-refund"
                                           onClick={() => Router.pushRoute('/credits-refund')}>
                                    <FormattedMessage
                                        id="nav.credits.refund"
                                        defaultMessage="Refund"/>
                                </Menu.Item>
                            )}
                            {/*<Menu.Item key="credits-history"*/}
                            {/*           onClick={() => Router.pushRoute('/credits-history')}>*/}
                            {/*    <FormattedMessage id="nav.credits.history"*/}
                            {/*                      defaultMessage="Credits history"/>*/}
                            {/*</Menu.Item>*/}
                        </SubMenu>
                    ) : (
                        ''
                    )}

                    {isTama || isCompany ? (
                        <SubMenu
                            key="credits-history"
                            onTitleClick={this.setSubMenu}
                            title={
                                <span>
                                    <Icon type="history" />
                                    <FormattedMessage
                                        id="nav.credits.history"
                                        defaultMessage="Credits history"/>
                                </span>
                            }>
                            {(isTama || isCompany) && (
                                <Menu.Item
                                    key="credits-history-companies-employees"
                                    onClick={() => Router.pushRoute('/credits-companies-employees')}>
                                    <FormattedMessage
                                        id="nav.companise"
                                        defaultMessage="Companies"/>
                                    <small style={{ margin: "0 5px"}}>></small>
                                    <FormattedMessage
                                        id="nav.employees"
                                        defaultMessage="Employees"/>
                                </Menu.Item>
                            )}
                            {(isTama || isCompany) && (
                            <Menu.Item
                                key="credits-history-companies"
                                onClick={() => Router.pushRoute('/credits-companies')}>
                                <FormattedMessage
                                    id="nav.tamaa"
                                    defaultMessage="Tama'a"/>
                                <small style={{ margin: "0 5px"}}>></small>
                                <FormattedMessage
                                    id="nav.companise"
                                    defaultMessage="Companies"/>
                            </Menu.Item>
                            )}
                            {(isTama || isCompany) && (
                            <Menu.Item
                                key="credits-history-employees"
                                onClick={() => Router.pushRoute('/credits-employees')}>
                                <FormattedMessage
                                    id="nav.tamaa"
                                    defaultMessage="Tama'a"/>
                                <small style={{ margin: "0 5px"}}>></small>
                                <FormattedMessage
                                    id="nav.employees"
                                    defaultMessage="Employees"/>
                            </Menu.Item>
                            )}
                            {isTama && (
                            <Menu.Item
                                key="credits-history-restaurants"
                                onClick={() => Router.pushRoute('/credits-restaurants')}>
                                <FormattedMessage
                                    id="nav.tamaa"
                                    defaultMessage="Tama'a"/>
                                <small style={{ margin: "0 5px"}}>></small>
                                <FormattedMessage
                                    id="nav.restaurants"
                                    defaultMessage="Restaurants"/>
                            </Menu.Item>
                            )}
                        </SubMenu>
                    ) : (
                        ''
                    )}

                    {isRestaurant && (
                        <Menu.Item
                            key="credits-refund"
                            onClick={() => Router.pushRoute('/credits-restaurants')}>
                            <Icon type="credit-card"/>
                            <FormattedMessage
                                id="nav.credits.refund"
                                defaultMessage="Refund"/>
                        </Menu.Item>
                    )}

                    {isTama || isRestaurant ? (
                        <Menu.Item key="transactions"
                                   onClick={() => Router.pushRoute('/transactions')}>
                            <Icon type="form"/>
                            <FormattedMessage id="nav.transactions" defaultMessage="Transactions"/>
                        </Menu.Item>
                    ) : (
                        ''
                    )}

                    {isTama ? (
                        <SubMenu
                            key="settings"
                            onTitleClick={this.setSubMenu}
                            title={
                                <span>
									<Icon type="setting"/>
									<FormattedMessage id="nav.setting" defaultMessage="Settings"/>
								</span>
                            }>
                            <Menu.Item key="settings-metadata"
                                       onClick={() => Router.pushRoute('/settings-metadata')}>
                                <FormattedMessage id="nav.setting.meta"
                                                  defaultMessage="App Metadata"/>
                            </Menu.Item>
                            <Menu.Item key="users" onClick={() => Router.pushRoute('/users')}>
                                <FormattedMessage id="nav.setting.user" defaultMessage="Users"/>
                            </Menu.Item>
                            <Menu.Item key="islands" onClick={() => Router.pushRoute('/islands')}>
                                <FormattedMessage id="nav.setting.islandCities"
                                                  defaultMessage="Islands & Cities"/>
                            </Menu.Item>
                        </SubMenu>
                    ) : (
                        ''
                    )}
                </Menu>
            </Sider>
        );
    }
}

export default SiderLayout;
