import { useState } from 'react';

export type TabViewPageProps = {
	/** Tiêu đề của tab menu */
	title: string;

	/** Menu key, cũng dùng để cho vào hash
	 * Phải là giá trị `unique`
	 * @example 'thong-bao', 'danh-sach', 'tong-quan'
	 */
	menuKey: string;

	/** Nội dung của tab */
	content: JSX.Element;

	/** Icon của tab */
	icon?: JSX.Element;

	/** Mã quyền để kiểm tra xem có được phép truy cập vào tab này không */
	accessCode?: string;
};
