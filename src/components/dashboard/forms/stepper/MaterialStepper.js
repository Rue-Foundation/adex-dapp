import React from 'react'

import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as actions from 'actions/itemActions'
import { Stepper } from 'react-step/lib/stepper'
import { withStepper } from 'react-step/lib/with-stepper'
import stepperTheme from './stepperTheme.css'
import FontIcon from 'react-toolbox/lib/font_icon'
import classnames from 'classnames'
import Ripple from 'react-toolbox/lib/ripple'
import { Button } from 'react-toolbox/lib/button'

const Step = ({ page, active, index, children, theme, canAdvance, canFinish, canReverse, setPageIndex, canAdvanceToPage, currentPage, goToPage, ...other }) => {
    let warning = page.status === 'warning'
    let done = page.status === 'done'
    theme = stepperTheme
    return (
        <div
            className={classnames(theme.step,
                { [page.optional]: theme.optional },
                { [theme.warning]: warning },
                { [theme.active]: active },
                { [theme.done]: done }
            )}
            {...other}
            onClick={() => goToPage(index)
            }
        >
            {children}

            < div className={classnames(theme.circle)} >
                {
                    warning ?
                        <FontIcon value='warning' />
                        : (
                            done ?
                                <FontIcon value='done' style={{ fontSize: '20px', lineHeight: '24px' }} />
                                :
                                <span>{index + 1}</span>
                        )
                }
            </div >
            <div className={theme.barLeft}></div>
            <div className={theme.barRight}></div>
            <div className={theme.label}> {page.title} </div>
            <div className={theme.subLabel}> {page.optional === true ? 'hij' : ''} </div>
        </div >
    )
}

const RippleStep = Ripple({ spread: 3 })(Step)

const StepperNav = ({ pages, currentPage, ...other }) => {
    return (
        <div className={stepperTheme.stepperNav}>
            {pages.map((page, i) =>
                <RippleStep key={i} page={page} active={i === currentPage} index={i} {...other} currentPage={currentPage} />)}
        </div>
    )
}

class MaterialStepper extends React.Component {

    onComplete() {
        console.log('currPage', this.currPage)
        let props = this.props
        let page = props.pages[props.currentPage]

        console.log('props.pages[props.currentPage]', page.component)
    }

    goToPage(nexStep) {
        let canAdvance = (nexStep > this.props.currentPage) && this.canAdvanceNextToPage()
        let canGoBack = nexStep < this.props.currentPage

        if (canAdvance || canGoBack) {
            this.props.setPageIndex(nexStep)
        }
    }

    canAdvanceNextToPage() {
        /* TODO: add check for optional steps that can be skipped
            * fix duplicated code here and in render
        */
        let page = this.props.pages[this.props.currentPage]
        if (this.props.canAdvance && !Object.keys(this.props.validations[page.props.validateId] || {}).length) {
            return true
        } else {
            return false
        }
    }

    render() {
        let { pages, component, validations, currentPage, ...props } = { ...this.props }
        let page = pages[currentPage]
        let Comp = page.component

        return (
            <div className={stepperTheme.stepper}>
                <StepperNav  {...props} pages={pages} currentPage={currentPage} goToPage={this.goToPage.bind(this)} />

                <div className={stepperTheme.page}>
                    <div className={stepperTheme.pageContent}>
                        {<Comp {...page.props} />}
                    </div>

                    <div className={stepperTheme.controls}>
                        <div className={stepperTheme.left}>
                            {props.canReverse ?
                                <Button label='Back' onClick={() =>
                                    props.setPageIndex(currentPage - 1)
                                } />
                                : ''}
                        </div>

                        <div className={stepperTheme.right} >
                            <Button label='Cancel' accent />
                            {this.canAdvanceNextToPage() ?
                                <Button label='Continue' primary onClick={this.goToPage.bind(this, currentPage + 1)} />
                                : ''}
                            {page.completeBtn ?
                                <page.completeBtn />
                                : ''}
                        </div>
                    </div>
                </div>

            </div>
        )
    }
}

const WithMaterialStepper = withStepper(MaterialStepper)

class MyMaterialStepper extends React.Component {

    render() {
        return (
            <Stepper pages={this.props.pages}>
                <WithMaterialStepper validations={this.props.validations} />
            </Stepper>
        )
    }
}

MyMaterialStepper.propTypes = {
    actions: PropTypes.object.isRequired,
    account: PropTypes.object.isRequired,
    pages: PropTypes.array.isRequired
}

function mapStateToProps(state, props) {
    return {
        account: state.account,
        validations: state.validations
    }
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(actions, dispatch)
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(MyMaterialStepper)