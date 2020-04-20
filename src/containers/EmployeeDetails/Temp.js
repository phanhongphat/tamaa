import React, { PureComponent } from 'react'
import { Layout } from 'antd'

// import Exception from './AcceptedDays'
import Exception from 'src/containers/CreateCompany/Exception'
// import ExceptionModal from './ExceptionModal'
import { FormattedRelative, FormattedMessage, defineMessages } from 'react-intl';

let result = [];

export default class DatePickers extends PureComponent {
    state = {
        dayOfWeek: [<FormattedMessage id="monday" defaultMessage="Monday" />,
                <FormattedMessage id="tuesday" defaultMessage="Tuesday" />,
                <FormattedMessage id="wednesday" defaultMessage="Wednesday" />,
                <FormattedMessage id="thursday" defaultMessage="Thursday" />, 
                <FormattedMessage id="friday" defaultMessage="Friday" />, 
                <FormattedMessage id="saturday" defaultMessage="Saturday" />, 
                <FormattedMessage id="sunday" defaultMessage="Sunday" />]
    }
    handleGetAcceptedDay = (_state, store, _name) => {
        if (_state !== true && store.length > 0) {
            result = { ...result, [_name.trim()]: [...store] };
            // console.log(_name, store, _name.trim());
        }
        else delete result[_name]
        this.props.getAcceptedDay(result)
    }

    componentDidMount() {
        result = { ...this.props.lastConditions }
    }

    // getExceptionDay = name => {
    //     this.setState({dayOfWeek: [...this.state.dayOfWeek, `${name[0] || ''} ${name[1] || ''} ${name[2] && 'of ' + name[2] || ''}`]})
    // }



    render() {
        const { dayOfWeek } = this.state;
        return (
            <Layout style={{ backgroundColor: 'white' }}>
                {dayOfWeek.map((day, index) => <Exception 
                                                    key={index} 
                                                    name={day} 
                                                    handleGetAcceptedDay={this.handleGetAcceptedDay} 
                                                    id={index}
                                                    acceptedDays={this.props.acceptedDays} />)}
                {/* <ExceptionModal getExceptionDay={this.getExceptionDay}/> */}
            </Layout>
        )
    }
}
