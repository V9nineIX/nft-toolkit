import axios, { AxiosResponse } from 'axios';
import { getClient } from '../utils/client'


interface IPostsType {
	body: string;
	id: number;
	title: string;
	userId: number
}


// const instance = axios.create({
// 	baseURL: 'http://jsonplaceholder.typicode.com/',
// 	timeout: 15000,
// });


// const instance = getClient('http://jsonplaceholder.typicode.com/')

const instance = getClient(import.meta.env.VITE_PUBLIC_API_ENDPOINT)


const responseBody = (response: AxiosResponse) => response.data;

export const requests = {
	get: (url: string) => instance.get(url).then(responseBody),
	post: (url: string, body: {}, config?: any) => instance.post(url, body, config).then(responseBody),
	put: (url: string, body: {}) => instance.put(url, body).then(responseBody),
    patch: (url: string, body: {}) => instance.patch(url, body).then(responseBody),
	delete: (url: string) => instance.delete(url).then(responseBody),
};


// Example Post
export const Post = {
	getPosts: (): Promise<IPostsType[]> => requests.get('posts'),
	getAPost: (id: number): Promise<IPostsType> => requests.get(`posts/${id}`),
	createPost: (post: IPostsType): Promise<IPostsType> =>
		requests.post('posts', post),
	updatePost: (post: IPostsType, id: number): Promise<IPostsType> =>
		requests.put(`posts/${id}`, post),
	deletePost: (id: number): Promise<void> => requests.delete(`posts/${id}`),
};