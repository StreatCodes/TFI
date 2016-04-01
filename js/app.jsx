"use strict";

var ItemList = React.createClass({
    render: function() {
        return (
            <div className="main"></div>
        );
    }
})

var Sidebar = React.createClass({
    render: function() {
        return (
            <div className="sidebar"></div>
        );
    }
});

var SearchBox = React.createClass({
    getInitialState: function() {
        return {searchString: '', appID: 440};
    },
    handleSearchChange: function(e) {
        this.setState({searchString: e.target.value});
    },
	searchArray: [],
    handleSearch: function(e) {
		e.preventDefault();
        var pattern = /STEAM_1:\S*/ig;

		//loop through search field and get all steam id's, store in searchArray
		//format: STEAM_1:1:8917236 STEAM_1:1:8917236
		this.searchArray = [];
		var match = pattern.exec(this.state.searchString);
        while (match !== null) {
			//get the actual steam id
			match = match[0].split(/:/).pop();

            this.searchArray.push(match);
            match = pattern.exec(this.state.searchString);
        }

        console.log(this.searchArray);
    },
    render: function() {
        return (
            <div>
                <div className="searchbar">
                    {/*<select>
                    <option value="440">TF2</option>
                    <option value="730">CSGO</option>
                    <option value="570">Dota 2</option>
                </select>*/}
                    <form onSubmit={this.handleSearch} onChange={this.handleSearchChange} style={{
                        width: "50%",
                        paddingRight: "10px"
                    }}>
                        <input id="search" type="text" value={this.state.searchString} autoComplete="off" placeholder="Search"/>
                    </form>
                    <form onSubmit={this.handleFilter} style={{
                        width: "50%"
                    }}>
                        <input id="filter" type="text" placeholder="Filters"/>
                    </form>
                </div>

                <Sidebar/>
            </div>
        );
    }
});

ReactDOM.render(
    <SearchBox/>, document.getElementById('page'));
