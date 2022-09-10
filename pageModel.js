import { Selector, t } from 'testcafe'
import { getDeviceTypeName } from './methods'

export default class PageModel {
    constructor() {
        //Selectors Device List
        this.deviceName = text => Selector('span.device-name').withText(text)
        this.deviceType = (name, type) => this.deviceName(name).parent(0).find('span.device-type').withText(type)
        this.deviceCapacity = (name, capacity) => this.deviceName(name).parent(0).find('span.device-capacity').withText(capacity)

        this.deviceEditButton = text => this.deviceName(text).parent(1).find('a.device-edit')
        this.deviceRemoveButton = text => this.deviceName(text).parent(1).find('button.device-remove')

        this.deviceRow = index => Selector('div.list-devices').child('div').nth(index)

        //Selectors Add Device Form
        this.addDeviceButton = Selector('a.submitButton')
        this.inputName = Selector('input#system_name')
        this.selectType = Selector('select#type')
        this.typeOption = this.selectType.find('option')
        this.inputCapacity = Selector('input#hdd_capacity')
        this.saveButton = Selector('button.submitButton')
    }

    async validateDevicesInDoom(devices) {
        for (const device of devices) {
            await t
                .expect(this.deviceName(device.system_name).exists).ok(`Device name not found: ${device.system_name}`)
                .expect(this.deviceType(device.system_name, device.type).exists).ok(`Device type not found: ${device.system_name}`)
                .expect(this.deviceCapacity(device.system_name, device.hdd_capacity).exists).ok(`Device capacity not found: ${device.system_name}`)
                .expect(this.deviceEditButton(device.system_name).exists).ok(`Edit button from ${device.system_name} not found`)
                .expect(this.deviceRemoveButton(device.system_name).exists).ok(`Remove button from ${device.system_name} not found`)
        }
    }

    async clickAddDeviceButton() {
        await t
            .click(this.addDeviceButton)
    }

    async createNewDevice(deviceName, deviceType, deviceCapacity) {
        await t
            .typeText(this.inputName, deviceName)
            .click(this.selectType)
            .click(this.typeOption.withText(getDeviceTypeName(deviceType)))
            .expect(this.selectType.value).eql(deviceType)
            .typeText(this.inputCapacity, deviceCapacity)
            .click(this.saveButton)
    }

    async validateDeviceIsVisible(deviceName, deviceType, deviceCapacity) {
        await t
            .expect(this.deviceName(deviceName).visible).ok()
            .expect(this.deviceType(deviceName, deviceType).visible).ok()
            .expect(this.deviceCapacity(deviceName, deviceCapacity).visible).ok()
    }

    async clickDeleteDeviceButton(deviceName) {
        await t.click(this.deviceRemoveButton(deviceName))
    }

    async getFirstDeviceName() {
        const deviceName = await this.deviceRow(0).find('span.device-name').innerText
        return deviceName
    }

    async getLastDeviceName() {
        const deviceName = await this.deviceRow(-1).find('span.device-name').innerText
        return deviceName
    }

    async validateDeviceNotVisible(deviceName) {
        await t
            .expect(this.deviceName(deviceName).visible).notOk()

    }
}