import React, { PureComponent } from 'react';
import injectSheet from 'react-jss';
import CsvDownload from 'react-json-to-csv';

import styles from './styles';

@injectSheet(styles)
export default class BtnExport extends PureComponent {
	render() {
		const { data = [], filename = 'export.csv', textBtn = 'Export' } = this.props;
		return (
			<CsvDownload className="ant-btn ant-btn-link" data={data} filename={filename}>
				{textBtn}
			</CsvDownload>
		);
	}
}
