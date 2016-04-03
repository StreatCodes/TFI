"use strict";

var fs = require('fs');

console.time('load');
//load key and schema file
var KEY = JSON.parse(fs.readFileSync('key.json', 'utf8')).key;
var SCHEMA = JSON.parse(fs.readFileSync('schema.json', 'utf8'));
console.timeEnd('load');

var ItemTable = React.createClass({
    getInitialState: function() {
        return {items: null};
    },
    handleResponse: function(data) {
        var responseItems = data.result.items;
        this.setState({items: responseItems});
    },
    componentWillMount: function() {
        var requestURL = 'http://api.steampowered.com/IEconItems_440/GetPlayerItems/v0001/?key=' + KEY + '&SteamID=' + this.props.id;

        //use fetch api to get json from steam server
        fetch(requestURL).then(function(response) {
            if (response.status !== 200) {
                console.log('Error fetching user items, status: ' + response.status);
                return;
            }

            // Examine the text in the response
            response.json().then(this.handleResponse);
        }.bind(this)).catch(function(err) {
            console.log('Fetch Error :-S', err);
        });

    },
    render: function() {
		var itemList = this.state.items;

        if (itemList !== null) {
            return (
                <div>
                    <table>
                        <colgroup>
                            <col style={{
                                width: "62%"
                            }}/>
                            <col style={{
                                width: "16%"
                            }}/>
                            <col style={{
                                width: "16%"
                            }}/>
                            <col style={{
                                width: "16%"
                            }}/>
                        </colgroup>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Slot</th>
                                <th>Quality</th>
                                <th>Tradable</th>
                            </tr>
                        </thead>
                        <tbody>
		                    {itemList.map(function(item, i) {
		                        return (
								<tr>
									<th>{item.defindex}</th>
									<th>Slot</th>
									<th>{item.quality}</th>
									<th>Tradable</th>
								</tr>
								)
		                    }.bind(this))}
						</tbody>
                    </table>
                </div>
            );
        } else {
            return (
                <a>Loading items</a>
            );
        }
    }
});

var PlayerProfile = React.createClass({
    render: function() {
        if (this.props.data !== null) {
            return (
                <div className="main">
                    <img src={this.props.data.avatarmedium} style={{
                        float: "left",
                        paddingRight: "20px",
                        width: "64px",
                        height: "64px"
                    }}/>
                    <h3 href={this.props.data.profileurl}>{this.props.data.personaname}</h3>
                    <a>Real name: {this.props.data.realname}</a><br/>
                    <a>Location: {this.props.data.loccountrycode}, {this.props.data.locstatecode}</a>

                    <ItemTable id={this.props.data.steamid}/>
                </div>
            );
        } else {
            return (
                <div className="main">No user selected</div>
            );
        }
    }
});

var Sidebar = React.createClass({
    getInitialState: function() {
        return {selected: null};
    },
    handleClick(i) {
        this.setState({selected: this.props.users[i]});
    },
    render: function() {
        var userList = this.props.users;
        return (
            <div>
                <div className="sidebar">
                    {userList.map(function(user, i) {
                        return <a className="user" key={user.steamid} onClick={this.handleClick.bind(null, i)}>{user.personaname}</a>;
                    }.bind(this))}
                </div>

                <PlayerProfile data={this.state.selected}/>
                <br style={{
                    clear: "both"
                }}/>
            </div>
        );
    }
});

var SearchBox = React.createClass({
    getInitialState: function() {
        return {searchString: '', appID: 440, users: []};
    },
    handleSearchChange: function(e) {
        this.setState({searchString: e.target.value});
    },
    handleResponse: function(data) {
        var players = data.response.players;
        this.setState({users: players});

    },
    handleSearch: function(e) {
        e.preventDefault();
        var pattern = /STEAM_1:\S*/ig;

        //loop through search field and get all steam id's, store in searchArray
        //format: STEAM_1:1:76561198004120193 STEAM_1:1:76561198004120194 STEAM_1:1:76561198004120195
        var searchArray = [];
        var match = pattern.exec(this.state.searchString);
        while (match !== null) {
            //get the actual steam id
            match = match[0].split(/:/).pop();

            searchArray.push(match);
            match = pattern.exec(this.state.searchString);
        }
        var requestURL = "http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=" + KEY + "&steamids="

        var formatedSearch = searchArray.toString();

        requestURL += formatedSearch;

        //use fetch api to get json from steam server
        fetch(requestURL).then(function(response) {
            if (response.status !== 200) {
                console.log('Error fetching user summaries, status: ' + response.status);
                return;
            }

            // Examine the text in the response
            response.json().then(this.handleResponse);
        }.bind(this)).catch(function(err) {
            console.log('Fetch Error :-S', err);
        });

        //set search input to new formatted text
        this.setState({searchString: formatedSearch});
    },
    render: function() {
        return (
            <div>
                <div className="searchbar">
                    <form>
                        <select>
                            <option value="440">TF2</option>
                            <option value="730">CSGO</option>
                            <option value="570">Dota 2</option>
                        </select>
                    </form>
                    <form onSubmit={this.handleSearch} onChange={this.handleSearchChange} style={{
                        width: "calc(50% - 115px)",
                        paddingRight: "10px"
                    }}>
                        <input id="search" type="text" value={this.state.searchString} autoComplete="off" placeholder="Search"/>
                    </form>
                    <form onSubmit={this.handleFilter} style={{
                        width: "calc(50% - 115px)"
                    }}>
                        <input id="filter" type="text" placeholder="Filters"/>
                    </form>
                </div>

                <Sidebar users={this.state.users}/>
            </div>
        );
    }
});

ReactDOM.render(
    <SearchBox/>, document.getElementById('page'));
