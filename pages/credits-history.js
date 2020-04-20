import React, { PureComponent } from 'react';

import MainLayout from 'src/layout/Main';
// import AuthLayout from 'src/layout/Auth';
import CreditsHistoryContainer from 'src/containers/CreditsHistory';

export default class RegisterPage extends PureComponent {
    render() {
        return (
            <MainLayout>
                <CreditsHistoryContainer />
            </MainLayout>
        );
    }
}
