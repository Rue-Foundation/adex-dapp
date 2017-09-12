import Account from './../models/Account'
import Campaign from './../models/Campaign'
import AdUnit from './../models/AdUnit'
// import Channel from './../models/Channel'
// import Slot from './../models/AdSlot'
// import objectAssign from 'object-assign';
// import itemsHelpers from './../helpers/itemsHelpers'
import { ItemsTypes } from './../constants/itemsTypes'
import Helper from './../helpers/miscHelpers'

// cached
let counts = {
    [ItemsTypes.AdUnit.id]: 0,
    [ItemsTypes.AdSlot.id]: 0,
    [ItemsTypes.Campaign.id]: 0,
    [ItemsTypes.Channel.id]: 0
}

let items = {
    [ItemsTypes.AdUnit.id]: [],
    [ItemsTypes.AdSlot.id]: [],
    [ItemsTypes.Campaign.id]: [],
    [ItemsTypes.Channel.id]: []
}

let account = null;
let campaign = null;
let unit = null;
// let channel = null;
// let slot = null;

function GenerateAccount() {
    if (account) return account

    let acc = new Account('Ivo Georgiev')
    return acc
}

function GenerateItems(type, acc) {
    if (items[type.id].length) return items[type.id]
    for (let i = 1; i <= Helper.getRandomInt(5, 20); i++) {
        let id = ++counts[type.id]
        let item

        switch (type.id) {
            case ItemsTypes.Campaign.id:
                item = Campaign.getRandCampaignInst(acc.addr, id)
                break
            case ItemsTypes.AdUnit.id:
                item = AdUnit.getRandAdUnitInst(acc.addr, id)
                break
            default:
                continue
        }

        items[type.id][item._id] = item
        acc.addItem(item)
    }

    return items[type.id]
}

function addUnitsToCampaigns() {
    if (items[ItemsTypes.Campaign.id].length) return items[ItemsTypes.Campaign.id]

    let campaigns = GenerateItems(ItemsTypes.Campaign, GenerateAccount())
    let adUnits = GenerateItems(ItemsTypes.AdUnit, GenerateAccount())

    for (let i = 1; i < campaigns.length; i++) {
        let used = []

        for (let j = 1; j < Helper.getRandomInt(1, adUnits.length); j++) {
            if (used.indexOf(adUnits[j]) > -1) continue

            campaigns[i].addItem(adUnits[j])
            used.push(adUnits[j])
        }
    }

    items[ItemsTypes.Campaign.id] = campaigns

    return items[ItemsTypes.Campaign.id]
}

function GenerateCampaign() {
    if (campaign) return campaign
    let camp = new Campaign(GenerateAccount().addr, '', '', { from: null, to: null, img: '', description: '' })
    camp.item_type = Campaign
    return camp
}

function GenerateUnit() {
    if (unit) return unit
    let unt = new AdUnit(GenerateAccount().addr, '', '', '', '', '', '', '')
    unt.item_type = AdUnit
    return unt
}

export default {
    account: GenerateAccount(),
    newItem: {
        campaign: GenerateCampaign(),
        unit: GenerateUnit(),
    },
    currentItem: {},
    items: {
        [ItemsTypes.Campaign.id]: addUnitsToCampaigns(),
        [ItemsTypes.AdUnit.id]: GenerateItems(ItemsTypes.AdUnit, GenerateAccount())
    },
    spinners: {}
}
