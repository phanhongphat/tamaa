import React from 'react';
import map from 'lodash/map';
import { Divider } from 'antd';

import RowItem from 'src/components/OpenHouse/RowItem';
import ExceptionModal from 'src/components/OpenHouse/ExceptionModal';

const ExceptionDay = ({ data, updateExceptionDay = () => {} }) => {
	const updateExceptionItemDay = (key, value) => {
		data[key] = value;
		updateExceptionDay({ ...data });
	};

	const removeRowExceptionDay = key => {
		if (data[key]) {
			delete data[key];
		}
		updateExceptionDay({ ...data });
	};

	return (
		<>
			{map(data, (value, key) => (
				<div style={{ marginBottom: '5px' }}>
					<RowItem
						name={key}
						normalday
						exception
						data={value}
						updateData={updateExceptionItemDay}
						removeRowExceptionDay={removeRowExceptionDay}
					/>
					<Divider />
				</div>
			))}
			<ExceptionModal addNewRow={updateExceptionItemDay} />
		</>
	);
};

export default ExceptionDay;
