import { requests } from './api'

export const Collection = {
	post: (data): Promise<any> => requests.post('collection/uploadImage', data, { headers: { "Content-Type": "multipart/form-data" } }),
	createCollection: (data): Promise<any> => requests.post('collection', data),
	getByOwnerId: (ownerId: string): Promise<any> => requests.get(`collection/owner/${ownerId}`),
	getByCollectionId: (collectionId: string): Promise<any> => requests.get(`collection/${collectionId}`),
	updateCollectionById: ({ collectionId, data }: { collectionId: string, data: any }): Promise<any> => requests.patch(`collection/${collectionId}`, data),
	generateImage: (collectionId: string, data): Promise<any> => requests.put(`collection/generateImage/${collectionId}`, data),
	removeLayer: (layerId: string, data): Promise<any> => requests.post(`collection/removeLayer/${layerId}`, data),
	generateCollection: (collectionId: string, data): Promise<any> => requests.put(`collection/generateCollection/${collectionId}`, data),
	uploadCustomToken: (data): Promise<any> => requests.post('collection/uploadCustomToken', data, { headers: { "Content-Type": "multipart/form-data" } }),
	updateCollectionStatus: (collectionId: string, data): Promise<any> => requests.patch(`collection/updateCollectionStatus/${collectionId}`, data),
	uploadIPFS: (collectionId: string, data): Promise<any> => requests.post(`collection/uploadToIPFS/${collectionId}`, data),
	setPhase: (collectionId: string, data): Promise<any> => requests.patch(`collection/setPhase/${collectionId}`, data),


};