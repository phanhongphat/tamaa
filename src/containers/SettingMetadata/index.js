import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';

import injectSheet from 'react-jss';
import { Card } from 'antd';

import Breadcrumb from 'src/components/Breadcrumb';
import MetadataForm from 'src/containers/SettingMetadata/Form';

import styles from './styles';

@injectSheet(styles)
export default class MetadataContainer extends PureComponent {
	static defaultProps = {};

	state = {
		loading: true
	};

	render() {
		const { classes } = this.props;
		const routes = [
			{
				// path: '/employees',
				breadcrumbName: 'Setting'
			},
			{
				// path: '/employees',
				breadcrumbName: 'Metadata'
			}
		];
		return (
			<>
				<Breadcrumb breadcrumb={routes} title="Setting Meta data" />
				<div style={{ minHeight: 360, marginTop: '16px' }}>
					<MetadataForm />
				</div>
			</>
		);
	}
}
