    /** @jsx React.DOM */



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
            return {value: ''};
        },
        handleChange: function(event){
            this.setState({value:event.target.value});
        },


        handleSubmit: function(event){
            event.preventDefault();
            console.log(this);
            alert('I am submit' + this.state.value);
        },

        render: function() {
            var value = this.state.value;
            return (
                <form className="MyForm"  textvalue="" onSubmit={this.handleSubmit}>
                    <h1>MyForm</h1>
                    <textarea placeholder="Please insert words inside" name="description" value={value}  onChange={this.handleChange} />
                    <input type="submit" value="post"></input>
                </form>
            );
        }

    });






    React.renderComponent(
        <MyForm/>,
        document.getElementById('myDiv')
    );
