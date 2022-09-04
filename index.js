import { Selector } from 'testcafe'
import { getDevices, editDevice, deleteDevice } from './api.js'

fixture('Emmanuel Challenge')
    .page('http://localhost:3001/')

//Selectors Device List
const deviceName = text => Selector('span.device-name').withText(text)
const deviceType = (name, type) => deviceName(name).parent(0).find('span.device-type').withText(type)
const deviceCapacity = (name, capacity) => deviceName(name).parent(0).find('span.device-capacity').withText(capacity)

const deviceEditButton = text => deviceName(text).parent(1).find('a.device-edit')
const deviceRemoveButton = text => deviceName(text).parent(1).find('button.device-remove')

const firstElement = Selector('div.list-devices').child('div').nth(0)
const lastElement = Selector('div.list-devices').child('div').nth(-1)

//Selectors Add Device Form
const addDeviceButton = Selector('a.submitButton')
const inputName = Selector('input#system_name')
const selectType = Selector('select#type')
const typeOption = selectType.find('option')
const inputCapacity = Selector('input#hdd_capacity')
const saveButton = Selector('button.submitButton')

test('Test 1', async t => {

    // Get list devices data
    const devices = await getDevices()

    // Validate if data exists in the DOOM
    for (const device of devices) {
        await t
            .expect(deviceName(device.system_name).exists).ok(`Device name not found: ${device.system_name}`)
            .expect(deviceType(device.system_name, device.type).exists).ok(`Device type not found: ${device.system_name}`)
            .expect(deviceCapacity(device.system_name, device.hdd_capacity).exists).ok(`Device capacity not found: ${device.system_name}`)
            .expect(deviceEditButton(device.system_name).exists).ok(`Edit button from ${device.system_name} not found`)
            .expect(deviceRemoveButton(device.system_name).exists).ok(`Remove button from ${device.system_name} not found`)
    }
})

test('Test 2', async t => {
    const randomDeviceName = `Emmanuel-${Math.random() * 100}`
    t.ctx.randomDeviceName = randomDeviceName
        //Create new device
    await t
        .click(addDeviceButton)
        .typeText(inputName, randomDeviceName)
        .click(selectType)
        .click(typeOption.withText('WINDOWS SERVER'))
        .expect(selectType.value).eql('WINDOWS_SERVER')
        .typeText(inputCapacity, '250')
        .click(saveButton)

    //Validate if device is visible
    await t
        .expect(deviceName(randomDeviceName).visible).ok()
        .expect(deviceType(randomDeviceName, 'WINDOWS_SERVER').visible).ok()
        .expect(deviceCapacity(randomDeviceName, '250').visible).ok()
}).after(async t => {
    //Delete device 
    const devices = await getDevices()
    const deviceExists = devices.some(value => value.system_name === t.ctx.randomDeviceName)
    deviceExists && await t.click(deviceRemoveButton(t.ctx.randomDeviceName))
})

test('Test 3', async t => {
    // Get first device data
    const deviceNameFE = await firstElement.find('span.device-name').innerText
    const devices = await getDevices()
    const { id: deviceId, type: deviceType, hdd_capacity: deviceCapacity } = devices.find(value => value.system_name === deviceNameFE)
    const randomDeviceNameEdit = `Renamed Device-${Math.random() * 100}`

    // Edit device with new name
    const payload = {
        id: deviceId,
        system_name: randomDeviceNameEdit,
        type: deviceType,
        hdd_capacity: deviceCapacity
    }
    await editDevice(payload)
    await t.eval(() => location.reload(true))
    await t.expect(deviceName(randomDeviceNameEdit).visible).ok()

    // Edit device with old name
    const payload2 = {
        id: deviceId,
        system_name: deviceNameFE,
        type: deviceType,
        hdd_capacity: deviceCapacity
    }
    await editDevice(payload2)
    await t.eval(() => location.reload(true))
    await t.expect(deviceName(deviceNameFE).visible).ok()

})

test('Test 4', async t => {
    // Get last device data
    const deviceNameLE = await lastElement.find('span.device-name').innerText
    const devices = await getDevices()
    const { id: deviceId } = devices.find(value => value.system_name === deviceNameLE)

    // Delete last device
    await deleteDevice(deviceId)
    await t.eval(() => location.reload(true))

    //Validate if device is not visible/exists
    await t.expect(deviceName(deviceNameLE).visible).notOk()
    await t.expect(deviceName(deviceNameLE).exists).notOk()
})