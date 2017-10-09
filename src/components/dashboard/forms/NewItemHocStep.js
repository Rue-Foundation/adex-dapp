import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Button } from 'react-toolbox/lib/button'
// import ProgressBar from 'react-toolbox/lib/progress_bar'
// import theme from './theme.css'
import Input from 'react-toolbox/lib/input'
import Base from './../../../models/Base'

export default function NewItemHoc(Decorated) {

    class ItemForm extends Component {
        constructor(props) {
            super(props)

            this.save = this.save.bind(this);

            this.state = {
                active: false,
                item: {},
                tabIndex: 0,
                saved: false
            }
        }

        componentWillReceiveProps(nextProps) {
            this.setState({ item: nextProps.newItem })
        }

        componentWillMount() {
            this.setState({ item: this.props.newItem })
        }

        // Works when inside dialog because when no active its content is unmounted
        componentWillUnmount() {
            this.updateItemInStore()
        }

        handleChange = (name, value) => {
            let newItem = Base.updateMeta(this.state.item, { [name]: value })
            this.setState({ item: newItem })
        }

        save() {
            let item = { ...this.state.item }
            // TODO: !!! this tempId should not be used - temp until web3 services !!!
            item.tempId = this.props.items.length

            this.setState({ saved: true }, () => {
                this.props.actions.addItem(item, this.props.addTo)
                this.props.actions.resetNewItem(this.state.item)

                // TODO:.....
                if (typeof this.props.onSave === 'function') {
                    this.props.onSave()
                }

                if (Array.isArray(this.props.onSave)) {
                    for (var index = 0; index < this.props.onSave.length; index++) {
                        if (typeof this.props.onSave[index] === 'function') {
                            this.props.onSave[index].onSave()
                        }
                    }
                }
            })
        }

        updateItemInStore() {
            if (!this.state.saved && this.state.item) {
                this.props.actions.updateNewItem(this.state.item, this.state.item._meta)
            }
        }

        render() {

            let item = this.state.item || {}
            item._meta = item._meta || {}

            return (
                <div style={{ textAlign: 'center' }}>

                    <section style={{ maxWidth: 640, margin: 'auto' }}>
                        <Decorated {...this.props} item={item} save={this.save} handleChange={this.handleChange} />
                    </section>
                </div>
            )
        }
    }

    ItemForm.propTypes = {
        actions: PropTypes.object.isRequired,
        account: PropTypes.object.isRequired,
        newItem: PropTypes.object.isRequired,
        title: PropTypes.string,
        items: PropTypes.array.isRequired,
        addTo: PropTypes.object
    }

    return ItemForm
}
