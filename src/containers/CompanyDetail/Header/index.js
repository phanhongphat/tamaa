import React, { PureComponent } from 'react';
import { Typography } from 'antd';

const { Title } = Typography;

export default class CDHeader extends PureComponent {
    render() {
        const { name, user } = this.props.detail;
        return (
            <Title level={4}>{name} / #{user && user.customId}</Title>
        );
    }
}
