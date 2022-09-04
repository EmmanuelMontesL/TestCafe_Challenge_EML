import axios from 'axios'

const host = 'http://localhost:3000/devices'


export const getDevices = async() => {
    try {
        const { data } = await axios.get(host)
        return data
    } catch (error) {
        console.error(error)
    }
}

export const editDevice = async payload => {
    try {
        const { data } = await axios.put(`${host}/${payload.id}`, payload)
        return data
    } catch (error) {
        console.error(error)
    }
}

export const deleteDevice = async deviceId => {
    try {
        const { data } = await axios.delete(`${host}/${deviceId}`)
        return data
    } catch (error) {
        console.error(error)
    }
}