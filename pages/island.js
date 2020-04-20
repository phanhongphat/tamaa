import React, { PureComponent } from 'react';

import MainLayout from 'src/layout/Main';
import AuthLayout from 'src/layout/Auth';
import IslandsDetailsLayout from 'src/containers/IslandDetails';

import AuthStorage from '../src/utils/AuthStorage';
import { Router } from '../src/routes';

export default class UserPage extends PureComponent {
    static async getInitialProps(ctx) {
        // query.slug
        const { id } = ctx.query;
        return {
            id
        };
    }

    componentDidMount() {
        // const { id } = this.props;
        const { isTama } = AuthStorage;
        // console.log(AuthStorage)
        if (!isTama) {
            Router.pushRoute('/');
        }
    }

    render() {
        const { id } = this.props;
        const { isTama } = AuthStorage;
        // console.log('this.props', this.props, 'abc', AuthStorage.idInfo);

        // eslint-disable-next-line eqeqeq
        if (!isTama) {
            return (<div />);
        }

        return (
            <AuthLayout>
                <MainLayout>
                    <IslandsDetailsLayout id={id} />
                </MainLayout>
            </AuthLayout>
        );
    }
}
