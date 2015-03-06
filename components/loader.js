    /** @jsx React.DOM */
    React.renderComponent(
        <h1>Hello, world!</h1>,
        document.getElementById('myDiv')
    );



    var MyComponent = React.createClass({
        getInitialState: function() {
            return {value: 'This is a description!'};
        },
        handleChange: function(event) {
            this.setState({value: event.target.value});
        },
        render: function() {
            var value = this.state.value;
            return <textarea name="description" value={value}  onChange={this.handleChange} />;
        }
    });

    var MyForm = React.createClass({

        getInitialState: function() {
            return {value: 'This is a description!'};
        },
        
        render: function() {
            var value = this.state.value;
            return <textarea name="description" value={value}  onChange={this.handleChange} />;
        }

    });





    React.renderComponent(
        <MyComponent/>,
        document.getElementById('myDiv')
    );
