import { Button, Tooltip, type ButtonProps } from 'antd';
import React from 'react';
import './style.less';

/** Button extend text with default Tooltip */
const ButtonExtend = (
	props: {
		children?: React.ReactNode;
		tooltip?: React.ReactNode;
		notHideText?: boolean;
	} & ButtonProps,
) => {
	const { children, tooltip, notHideText, ...otherProps } = props;

	return (
		<Tooltip title={tooltip ?? children}>
			<Button {...otherProps}>
				{!notHideText && !!children && !!otherProps.icon ? <span className='span-extend'>{children}</span> : children}
			</Button>
		</Tooltip>
	);
};

export default ButtonExtend;
