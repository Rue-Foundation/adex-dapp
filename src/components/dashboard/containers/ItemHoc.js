
import React, { Component } from 'react'
import Chip from 'react-toolbox/lib/chip';

export default function ItemHoc(Decorated) {
    return class Item extends Component {
        constructor(props) {
            super(props)
            this.save = this.save.bind(this)
        }

        componentWillReceiveProps(nextProps){
            let item = this.props.items[this.props.match.params.itemId]
            let nextitem = nextProps.items[this.props.match.params.itemId]

            console.log('componentWillReceiveProps', item != nextitem)
            if(item != nextitem){
                this.setCurrentItem()
            }
        }

        componentWillMount() {
            this.setCurrentItem()
        }

        setCurrentItem() {
            let item = this.props.items[this.props.match.params.itemId]
            this.props.actions.setCurrentItem(item)
        }

        save() {
            var that = this
            this.props.actions.updateItem(this.props.item, this.props.item.meta, {success: that.setCurrentItem.bind(that)})
            // TODO: Handle on success or something like that and add spinner while saving!!!
            // setTimeout(() => {
            //     this.setCurrentItem()
            // }, 200)
        }

        isDirtyProp(prop) {
            return this.item.dirtyProps.indexOf(prop) > -1

        }

        render() {
            return (
                <div>
                    <Decorated {...this.props} save={this.save} />
                    {this.props.item.dirty ?
                        (
                            <div>
                                <h1> Unsaved changes there are!!! To know! </h1>
                                <div>
                                    {this.props.item.dirtyProps.map((p) => {
                                        return (<Chip key={p}>{p}</Chip>)
                                    })}
                                </div>
                            </div>
                        ) : ''}

                </div>
            )
        }
    }
}
