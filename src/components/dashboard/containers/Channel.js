import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import actions from 'actions'
import { ItemsTypes } from 'constants/itemsTypes'
import ChannelModel from 'models/Channel'
import AdSlotModel from 'models/AdSlot'
import ItemHoc from './ItemHoc'
import ItemsList from './ItemsList'
import NewSlotForm from 'components/dashboard/forms/NewSlotForm'
// import theme from './theme.css'
import AddItemDialog from './AddItemDialog'
import NewItemSteps from 'components/dashboard/forms/NewItemSteps'
import theme from './theme.css'
import Translate from 'components/translate/Translate'

const VIEW_MODE = 'campaignRowsView'
const VIEW_MODE_UNITS = 'campaignAdUNitsRowsView'

export class Channel extends Component {
    constructor(props, context) {
        super(props, context);

        this.state = {
            tabIndex: 0
        }
    }

    handleTabChange = (index) => {
        this.setState({ tabIndex: index })
    }

    render() {
        let side = this.props.match.params.side;

        let item = this.props.item
        let meta = item._meta
        let propsSlots = { ...this.props.slots }
        let slots = []
        let otherSlots = Array.from(Object.values(propsSlots))
        let t = this.props.t

        if (!item) return (<h1>'404'</h1>)

        for (var index = 0; index < meta.items.length; index++) {
            if (propsSlots[meta.items[index]] && !propsSlots[meta.items[index]]._meta.deleted) {
                slots.push(propsSlots[meta.items[index]])
                otherSlots[meta.items[index]] = null
            }
        }

        return (
            <div>
                <h2>
                    <span>{this.props.t('SLOTS_IN_CHANNEL', { args: [slots.length] })}</span>
                    <span>
                        <div className={theme.newIemToItemBtn} >
                            <AddItemDialog
                                color='second'
                                addCampaign={this.props.actions.addCampaign}
                                btnLabel={this.props.t('NEW_SLOT_TO_CHANNEL')}
                                title=''
                                items={otherSlots}
                                viewMode={VIEW_MODE_UNITS}
                                listMode='rows'
                                addTo={item}
                                tabNewLabel={this.props.t('NEW_SLOT')}
                                tabExsLabel={this.props.t('EXISTING_SLOT')}
                                objModel={AdSlotModel}
                                newForm={(props) =>
                                    <NewItemSteps {...props} addTo={item} itemPages={[NewSlotForm]} itemType={ItemsTypes.AdSlot.id} itemModel={AdSlotModel} />
                                }
                            />
                        </div>
                    </span>
                </h2>
                <ItemsList {...this.props} parentItem={item} removeFromItem items={slots} viewModeId={VIEW_MODE} objModel={AdSlotModel} />
            </div>
        )
    }
}

Channel.propTypes = {
    actions: PropTypes.object.isRequired,
    account: PropTypes.object.isRequired,
    slots: PropTypes.array.isRequired,
    spinner: PropTypes.bool,
    rowsView: PropTypes.bool.isRequired
}

function mapStateToProps(state) {
    let persist = state.persist
    let memory = state.memory
    return {
        account: persist.account,
        slots: persist.items[ItemsTypes.AdSlot.id],
        spinner: memory.spinners[ItemsTypes.Channel.name],
        rowsView: !!persist.ui[VIEW_MODE],
        objModel: ChannelModel,
        itemTypeL: ItemsTypes.Channel.id
    }
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(actions, dispatch)
    }
}

const ChannelItem = ItemHoc(Channel)
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Translate(ChannelItem))
