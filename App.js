var React = require('react'),
    DOM = React.DOM, div = DOM.div, button = DOM.button, ul = DOM.ul, li = DOM.li, textarea = DOM.textarea;

// This is just a simple example of a component that can be rendered on both
// the server and browser

module.exports = React.createClass({

    // We initialise its state by using the `props` that were passed in when it
    // was first rendered. We also want the button to be disabled until the
    // component has fully mounted on the DOM
    getInitialState: function() {
        return {items: this.props.items, disabled: true, value:""}
    },

    // Once the component has been mounted, we can enable the button
    componentDidMount: function() {
        this.setState({disabled: false})
    },

    // Then we just update the state whenever its clicked by adding a new item to
    // the list - but you could imagine this being updated with the results of
    // AJAX calls, etc
    handleClick: function() {
        this.setState({
            items: this.state.items.concat('Item ' + this.state.items.length)
        })
    },

    handleTextareaChange: function(event){
        console.log(event.target.value);
        this.setState({value:event.target.value});
    },

    handleSubmit: function(){
        var formData = new FormData();

        formData.append("insertString", this.state.value);

        var req = new XMLHttpRequest();
        req.open('post','/',false);

    //    req.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        req.onload = function(r){
            console.log(JSON.parse(r.target.response));
        };
        req.send(formData);
    },

    // For ease of illustration, we just use the React JS methods directly
    // (no JSX compilation needed)
    // Note that we allow the button to be disabled initially, and then enable it
    // when everything has loaded
    render: function() {
        var value = this.state.value;
        return div(null,

            button({onClick: this.handleClick, disabled: this.state.disabled}, 'Add Item'),

            ul({children: this.state.items.map(function(item) {
                return li(null, item)
            })}),

            textarea({placeholder:"請輸入７０字字元！", name:"submitText" ,value:value, onChange:this.handleTextareaChange}),
            button({onClick: this.handleSubmit, disabled:this.state.disabled}, "送出")

        )
    },
})

