import React from 'react';
import Unavatar from 'unavatar';
import { Tooltip, Avatar } from 'antd';

const AvatarIcon = ({ src, tips, size, name, onClick = () => {} }) => {
	return (
		<div className="" style={{ display: 'inline-block' }}>
			{tips ? (
				<Tooltip>
					{/* <Unavatar name="TAMAA" /> */}
					<Avatar src={src} size={size} style={{}} />
				</Tooltip>
			) : (
				<Unavatar name={name || 'TAMAA'} />
			)}
		</div>
	);
};

export default AvatarIcon;
