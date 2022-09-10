import { getDevices, editDevice, deleteDevice } from './api.js'
import PageModel from './pageModel.js'
import { hostApp } from './routes.js'
import { getRandomName, reloadPage } from './methods'

const pageModel = new PageModel()

fixture('Emmanuel Challenge')
    .page(hostApp)

test('Test 1', async t => {
    // Get list devices data to API
    const devices = await getDevices()

    // Validate if data exists in the DOOM
    await pageModel.validateDevicesInDoom(devices)
})

test('Test 2', async t => {
    const deviceName = getRandomName('Test2')
    const deviceType = 'WINDOWS_SERVER'
    const deviceCapacity = '250'

    t.ctx.deviceName = deviceName

    //Create new device
    await pageModel.clickAddDeviceButton()
    await pageModel.createNewDevice(deviceName, deviceType, deviceCapacity)

    //Validate if device is visible
    await pageModel.validateDeviceIsVisible(deviceName, deviceType, deviceCapacity)
}).after(async t => {
    //Delete device
    const devices = await getDevices()
    const deviceExists = devices.some(value => value.system_name === t.ctx.deviceName)
    deviceExists && await pageModel.clickDeleteDeviceButton(t.ctx.deviceName)
})

test('Test 3', async t => {
    // Get first device data
    const deviceName = await pageModel.getFirstDeviceName()
    const devices = await getDevices()
    const device = devices.find(value => value.system_name === deviceName)
    t.ctx.device = device
    const randomDeviceNameEdit = getRandomName('Renamed Device')

    // Edit device with new name
    const payload = {
        id: device.id,
        system_name: randomDeviceNameEdit,
        type: device.type,
        hdd_capacity: device.hdd_capacity
    }

    await editDevice(payload)
    await reloadPage()
    await pageModel.validateDeviceIsVisible(randomDeviceNameEdit, device.type, device.hdd_capacity)

}).after(async t => {
    // Edit device with old name
    const payload = {
        id: t.ctx.device.id,
        system_name: t.ctx.device.system_name,
        type: t.ctx.device.type,
        hdd_capacity: t.ctx.device.hdd_capacity
    }
    await editDevice(payload)
    await reloadPage()
    await pageModel.validateDeviceIsVisible(t.ctx.device.system_name, t.ctx.device.type, t.ctx.device.hdd_capacity)
})

test('Test 4', async t => {
    // Get last device data
    const deviceName = await pageModel.getLastDeviceName()
    const devices = await getDevices()
    const { id: deviceId } = devices.find(value => value.system_name === deviceName)

    // Delete last device
    await deleteDevice(deviceId)
    await reloadPage()

    //Validate if device is not visible
    await pageModel.validateDeviceNotVisible(deviceName)
})