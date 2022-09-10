import axios from 'axios'
import { routes, hostServer } from './routes'

export const getDevices = async() => {
    try {
        const { data } = await axios.get(`${hostServer}${routes.devices}`)
        return data
    } catch (error) {
        console.error(error)
    }
}

export const editDevice = async payload => {
    try {
        const { data } = await axios.put(`${hostServer}${routes.devices}/${payload.id}`, payload)
        return data
    } catch (error) {
        console.error(error)
    }
}

export const deleteDevice = async deviceId => {
    try {
        const { data } = await axios.delete(`${hostServer}${routes.devices}/${deviceId}`)
        return data
    } catch (error) {
        console.error(error)
    }
}