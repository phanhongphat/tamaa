import React, { PureComponent } from 'react';

import MainLayout from 'src/layout/Main';
import AuthLayout from 'src/layout/Auth';
import CompanyLayout from 'src/layout/Company';
// import Restaurant from 'src/layout/Restaurant';
import RestaurantDetailLayout from 'src/containers/RestaurantDetail';

import AuthStorage from 'src/utils/AuthStorage';
import { Router, Link } from 'src/routes';

export default class RegisterPage extends PureComponent {
    static async getInitialProps(ctx) {
        // query.slug
        const { id } = ctx.query;
        return {
            id
        };
    }

    componentDidMount() {
        const { id } = this.props;
        const { idInfo, isRestaurant } = AuthStorage;
        if (isRestaurant && id != idInfo) {
            Router.pushRoute('/');
        }
    }

    render() {
        const { id } = this.props;
        const { idInfo, isRestaurant } = AuthStorage;
        // console.log('this.props', this.props, 'abc', AuthStorage.idInfo);

        // eslint-disable-next-line eqeqeq
        if (isRestaurant && id != idInfo) {
            return (<div />);
        }

        return (
            <AuthLayout>
                <CompanyLayout>
                     {/*<Restaurant>*/}
                        <MainLayout>
                            <RestaurantDetailLayout id={id} />
                        </MainLayout>
                     {/*</Restaurant>*/}
                </CompanyLayout>
            </AuthLayout>
        );
    }
}
