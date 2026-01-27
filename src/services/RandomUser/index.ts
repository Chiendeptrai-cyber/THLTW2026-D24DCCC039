import axios from 'axios';

export const getData = async () => {
	const res = await axios.get('https://randomapi.com/api/6de6abfedb24f889e0b5f675edc50deb?fmt=raw&sole');
	return res;
};
