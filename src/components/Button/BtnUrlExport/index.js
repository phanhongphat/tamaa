import React from 'react';
import { Button } from 'antd';

import API from 'src/constants/url';

const { API_URL } = API;

const BtnExport = ({ uri = '', selectedRows = [] }) => {
	const handelExportUrlList = () => {
		if (uri !== '') {
			let url = `${API_URL}${uri}`;
			url = url + '?pagination=false';
			if (selectedRows && selectedRows.length > 0) {
				// console.log('BtnExport selectedRows ==>', selectedRows);

				selectedRows.map(e => {
					url = url + '&id[]=' + e.id;
				});

				console.log('uriExport ====>', url);
			}
			window.open(url, '_blank');
		}
	};

	return (
		<Button type="link" onClick={handelExportUrlList}>
			Export
		</Button>
	);
};

export default BtnExport;
