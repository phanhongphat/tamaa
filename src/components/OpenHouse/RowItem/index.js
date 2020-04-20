/* eslint-disable no-param-reassign */
/* eslint-disable no-nested-ternary */
/* eslint-disable react/jsx-indent-props */
import React from 'react';
import { Row, Col, Button, Icon, Modal } from 'antd';
import findIndex from 'lodash/findIndex';

import Item from 'src/components/OpenHouse/RowItem/Item';

const dayName = {
	monday: 'Lundi',
	tuesday: 'Mardi',
	wednesday: 'Mercredi',
	thursday: 'Jeudi',
	friday: 'Vendredi',
	saturday: 'Samedi',
	sunday: 'Dimanche'
};

const RowItem = ({
	data = [''],
	// format = 'HH:mm',
	// to = '',
	// from = '',
	name = '',
	exception = false,
	updateData = () => {},
	removeRowExceptionDay = () => {},
	applyAllFeild = () => {}
}) => {
	const addNewRowItem = () => {
		if (data.length < 3) {
			data.push('00:00-23:59');
			updateData(name, [...data]);
		} else {
			Modal.warning({
				title: 'Maximum of 3 shifts'
			});
		}
	};

	const removeRow = index => {
		data.splice(index, 1);
		updateData(name, [...data]);
	};

	const onChange = (e, index, feild) => {
		if (feild === 'from') {
			if (data[index] === '') {
				data[index] = `${e.format('HH:mm')}-`;
			} else {
				const time = data[index].split('-');
				if (e === null && data[index] !== '') {
					if (time && time.length === 3) {
						data[index] = `-${time[2]}`;
					} else if (time && time.length === 2) {
						data[index] = `-${time[1]}`;
					}
				} else if (e !== null && time && time.length === 3) {
					data[index] = `${e.format('HH:mm')}-${time[2]}`;
				} else if (e !== null && time && time.length === 2) {
					data[index] = `${e.format('HH:mm')}-${time[1]}`;
				}
			}
		}
		if (feild === 'to') {
			if (data[index] === '') {
				if (e === null) {
					data[index] = '';
				} else {
					data[index] = `-${data[index]}${e.format('HH:mm')}`;
				}
			} else if (data[index] !== '' && data[index].toString().indexOf('-') > -1) {
				const time = data[index].split('-');
				if (e === null) {
					data[index] = `${time[0]}-`;
				} else {
					data[index] = `${time[0]}-${e.format('HH:mm')}`;
				}
			}
		}

		// console.log('data ==>', findIndex(data, o => o === '00:00-00:00'));
		if (findIndex(data, o => o === '00:00-00:00') > -1) {
			data = ['00:00-00:00'];
		}
		updateData(name, data);
	};

	const closeDay = () => {
		Modal.confirm({
			title: 'Voulez-vous vraiment fermer cette journée?',
			onOk() {
				updateData(name, ['00:00-00:00']);
			},
			onCancel() {}
		});
	};
	const openDate = () => {
		updateData(name, ['00:00-00:15']);
	};

	// console.log('all data ====>', data);

	return (
		<Row type="flex">
			<Col md={4}>
				<span style={{ textTransform: 'capitalize' }}>{dayName[name] ? dayName[name] : name}</span>
			</Col>

			<Col>
				{data.map((e, index) => {
					let from;
					let to;
					let isClosed = false;
					const lastestIndex = data.length > 0 ? data.length - 1 === index : 0;

					if (typeof e === 'string') {
						const time = e.split('-');

						from = time[0] || '00:00';
						to = time[1] || '00:00';
						isClosed = from === '00:00' && to === '00:00';
					}

					return (
						<>
							<Row keys={index} type="flex">
								<Col>
									<Button.Group>
										<Item
											fromDefault={from}
											toDefault={to}
											// addTimeNewRow={this.addTimeNewRow}
											index={index}
											onChange={onChange}
											isClosed={isClosed}
										/>
									</Button.Group>
								</Col>
								<Col
									style={{
										marginLeft: '10px',
										paddingTop: '3px'
									}}>
									{/* {index >= 1 ? ( */}

									{exception ? (
										<>
											<Button
												type={index >= 1 ? 'link' : isClosed ? 'primary' : 'danger'}
												name="count"
												onClick={
													() =>
														index >= 1
															? removeRow(index)
															: isClosed
															? openDate()
															: closeDay(name)
													// : removeRowExceptionDay(name)
												}
												// onClick={() => removeRowExceptionDay(name)}
											>
												{index >= 1 ? <Icon type="minus" /> : isClosed ? 'Ouvrir' : 'Fermer'}
											</Button>
											<Button
												icon="close"
												onClick={() => removeRowExceptionDay(name)}
												type="link"
												style={{ color: 'red' }}>
												Remove
											</Button>
										</>
									) : (
										<Button
											type={index >= 1 ? 'link' : isClosed ? 'primary' : 'danger'}
											name="count"
											onClick={() =>
												index >= 1 ? removeRow(index) : isClosed ? openDate() : closeDay(name)
											}>
											{index >= 1 ? <Icon type="minus" /> : isClosed ? 'Ouvrir' : 'Fermer'}
										</Button>
									)}
									{name === 'monday' && index === 0 && (
										<Button
											type="link"
											onClick={() => applyAllFeild()}
											style={{ position: 'absolute' }}
											icon="arrow-down">
											S'applique à tous
										</Button>
									)}
								</Col>
							</Row>

							{lastestIndex && data.length < 3 && (
								<Row style={{ marginTop: '10px' }}>
									<Button
										// type="link"
										disabled={isClosed || (from === '00:00' && to === '23:59')}
										data-to={to}
										data-from={from}
										name="count"
										onClick={() => addNewRowItem()}>
										<Icon type="plus" />
									</Button>
								</Row>
							)}
						</>
					);
				})}
			</Col>
		</Row>
	);
};

export default RowItem;
