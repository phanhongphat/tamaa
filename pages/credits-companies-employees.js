import React, { PureComponent } from 'react';

import MainLayout from 'src/layout/Main';
// import AuthLayout from 'src/layout/Auth';
import CreditsHistoryComapnyEmployeeContainer from 'src/containers/CreditsHistoryCompaniesEmployees';
import AuthLayout from 'src/layout/Auth';
// import CompanyLayout from 'src/layout/Company';
import Restaurant from 'src/layout/Restaurant';
import EmployeesLayout from 'src/layout/Employees';

export default class RegisterPage extends PureComponent {
    render() {
        return (
            <AuthLayout>
                <Restaurant>
                    <EmployeesLayout>
                        <MainLayout>
                            <CreditsHistoryComapnyEmployeeContainer />
                        </MainLayout>
                    </EmployeesLayout>
                </Restaurant>
            </AuthLayout>
        );
    }
}
