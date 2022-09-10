import { t } from "testcafe"

export const getRandomName = name => `${name}-${Math.random() * 1000}`

export const reloadPage = async() => await t.eval(() => location.reload(true))

export const getDeviceTypeName = deviceType => {
    switch (deviceType) {
        case 'WINDOWS_WORKSTATION':
            return 'WINDOWS WORKSTATION'
        case 'WINDOWS_SERVER':
            return 'WINDOWS SERVER'
        case 'MAC':
            return 'MAC'
    }
}