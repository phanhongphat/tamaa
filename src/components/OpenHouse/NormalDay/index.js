import React from 'react';
import map from 'lodash/map';
import { Divider } from 'antd';

import RowItem from 'src/components/OpenHouse/RowItem';

// @injectSheet(styles)
const NorMalDay = ({ data = [], updateNormalDay = () => {}, applyAllFeild = () => {} }) => {
	const updateDataNormalDay = (key, value) => {
		data[key] = value;
		updateNormalDay({ ...data });
	};

	return (
		// <div className={classes.container}>
		<div>
			{map(data, (value, key) => (
				<div style={{ marginBottom: '5px' }}>
					<RowItem name={key} data={value} updateData={updateDataNormalDay} applyAllFeild={applyAllFeild} />
					{/* <Divider /> */}
				</div>
			))}
		</div>
	);
};

export default NorMalDay;
