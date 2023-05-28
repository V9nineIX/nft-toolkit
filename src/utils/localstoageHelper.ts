//@ts-nocheck

import { reactLocalStorage } from 'reactjs-localstorage';

const DEFUALT_TTL = 600000  //10 min = 600000 ms

const setWithExpiry = (key: string, value: any, ttl: any = DEFUALT_TTL) => {
    const now = new Date()

    // `item` is an object which contains the original value
    // as well as the time when it's supposed to expire
    const item: any = {
        value: value,
        expiry: now.getTime() + ttl,
    }
    //localStorage.setItem(key, JSON.stringify(item))
    reactLocalStorage.setObject(key, item);
}

const getWithExpiry = (key: string) => {
    //const itemStr = localStorage.getItem(key)
    try {
        const itemStr = reactLocalStorage.getObject(key);
        // if the item doesn't exist, return null
        if (!itemStr) {
            return null
        }
        const item: any = itemStr
        const now = new Date()

        // compare the expiry time of the item with the current time
        if (now.getTime() > item.expiry) {
            // If the item is expired, delete the item from storage
            // and return null
            //localStorage.removeItem(key)
            reactLocalStorage.remove(key);
            return null
        }
        return item?.value
    } catch (ex) {
        console.log('ex', ex)
        return null
    }
}

const getLocalstorage = (key: string) => {
    try {
        let dataGet = localStorage.getItem(key);
        dataGet = JSON.parse(dataGet);

        return dataGet?.value
    } catch (ex) {
        console.log('ex', ex)
        return null
    }
}


export {
    setWithExpiry,
    getWithExpiry,
    getLocalstorage,
}