import React from 'react';
import injectSheet from 'react-jss';

import { Link } from 'routes';
// import logo from 'src/assets/logo.svg';

import styles from './styles';

@injectSheet(styles)
export default class UserLayout extends React.PureComponent {
	render() {
		const { children, classes } = this.props;
		return (
			<div className={classes.container}>
				<div className={classes.content}>
					<div className={classes.top}>
						{/* <div className={classes.header}>
							<Link to="/">
								<img alt="logo" className={styles.logo} src={logo} />
								<span className={classes.title}>Ant Design</span>
							</Link>
						</div>
						<div className={classes.desc}>Ant Design</div> */}
					</div>
					{children}
				</div>
			</div>
		);
	}
}
