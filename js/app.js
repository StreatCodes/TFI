"use strict";

var fs = require('fs');

//load key and schema file
var KEY = JSON.parse(fs.readFileSync('key.json', 'utf8')).key;
var SCHEMA = new Map(JSON.parse(fs.readFileSync('schemaMap.json', 'utf8')));

var qualities = [];
qualities[0] = { quality: "Normal", color: "#B2B2B2" };
qualities[1] = { quality: "Genuine", color: "#4D7455" };
qualities[3] = { quality: "Vintage", color: "#476291" };
qualities[5] = { quality: "Unusual", color: "#8650AC" };
qualities[6] = { quality: "Unique", color: "#FFD700" };
qualities[7] = { quality: "Community", color: "#70B04A" };
qualities[8] = { quality: "Valve", color: "#A50F79" };
qualities[9] = { quality: "Self-Made", color: "#70B04A" };
qualities[11] = { quality: "Strange", color: "#CF6A32" };
qualities[13] = { quality: "Haunted", color: "#38F3AB" };
qualities[14] = { quality: "Collector's", color: "#AA0000" };
qualities[15] = { quality: "Decorated Weapon", color: "#FAFAFA" };

var ItemTable = React.createClass({
    displayName: 'ItemTable',

    getInitialState: function () {
        return { items: null };
    },
    handleResponse: function (data) {
        var responseItems = data.result.items;
        this.setState({ items: responseItems });
    },
    componentWillMount: function () {
        var requestURL = 'http://api.steampowered.com/IEconItems_440/GetPlayerItems/v0001/?key=' + KEY + '&SteamID=' + this.props.id;

        //use fetch api to get json from steam server
        fetch(requestURL).then(function (response) {
            if (response.status !== 200) {
                console.log('Error fetching user items, status: ' + response.status);
                return;
            }

            // Examine the text in the response
            response.json().then(this.handleResponse);
        }.bind(this)).catch(function (err) {
            console.log('Fetch Error :-S', err);
        });
    },
    render: function () {
        var itemList = this.state.items;

        console.log(qualities);

        if (itemList !== null) {
            return React.createElement(
                'div',
                null,
                React.createElement(
                    'table',
                    null,
                    React.createElement(
                        'colgroup',
                        null,
                        React.createElement('col', { style: {
                                width: "62%"
                            } }),
                        React.createElement('col', { style: {
                                width: "16%"
                            } }),
                        React.createElement('col', { style: {
                                width: "16%"
                            } }),
                        React.createElement('col', { style: {
                                width: "16%"
                            } })
                    ),
                    React.createElement(
                        'thead',
                        null,
                        React.createElement(
                            'tr',
                            null,
                            React.createElement(
                                'th',
                                null,
                                'Name'
                            ),
                            React.createElement(
                                'th',
                                null,
                                'Slot'
                            ),
                            React.createElement(
                                'th',
                                null,
                                'Quality'
                            ),
                            React.createElement(
                                'th',
                                null,
                                'Tradable'
                            )
                        )
                    ),
                    React.createElement(
                        'tbody',
                        null,
                        itemList.map(function (item, i) {
                            return React.createElement(
                                'tr',
                                { key: item.id },
                                React.createElement(
                                    'td',
                                    { style: { color: qualities[item.quality].color } },
                                    SCHEMA.get(item.defindex).name
                                ),
                                React.createElement(
                                    'td',
                                    null,
                                    'Slot'
                                ),
                                React.createElement(
                                    'td',
                                    null,
                                    qualities[item.quality].quality
                                ),
                                React.createElement(
                                    'td',
                                    null,
                                    'Tradable'
                                )
                            );
                        }.bind(this))
                    )
                )
            );
        } else {
            return React.createElement(
                'a',
                null,
                'Loading items'
            );
        }
    }
});

var PlayerProfile = React.createClass({
    displayName: 'PlayerProfile',

    render: function () {
        if (this.props.data !== null) {
            return React.createElement(
                'div',
                { className: 'main' },
                React.createElement('img', { src: this.props.data.avatarmedium, style: {
                        float: "left",
                        paddingRight: "20px",
                        width: "64px",
                        height: "64px"
                    } }),
                React.createElement(
                    'h3',
                    { href: this.props.data.profileurl },
                    this.props.data.personaname
                ),
                React.createElement(
                    'a',
                    null,
                    'Real name: ',
                    this.props.data.realname
                ),
                React.createElement('br', null),
                React.createElement(
                    'a',
                    null,
                    'Location: ',
                    this.props.data.loccountrycode,
                    ', ',
                    this.props.data.locstatecode
                ),
                React.createElement(ItemTable, { id: this.props.data.steamid })
            );
        } else {
            return React.createElement(
                'div',
                { className: 'main' },
                'No user selected'
            );
        }
    }
});

var Sidebar = React.createClass({
    displayName: 'Sidebar',

    getInitialState: function () {
        return { selected: null };
    },
    handleClick(i) {
        this.setState({ selected: this.props.users[i] });
    },
    render: function () {
        var userList = this.props.users;
        return React.createElement(
            'div',
            null,
            React.createElement(
                'div',
                { className: 'sidebar' },
                userList.map(function (user, i) {
                    return React.createElement(
                        'a',
                        { className: 'user', key: user.steamid, onClick: this.handleClick.bind(null, i) },
                        user.personaname
                    );
                }.bind(this))
            ),
            React.createElement(PlayerProfile, { data: this.state.selected }),
            React.createElement('br', { style: {
                    clear: "both"
                } })
        );
    }
});

var SearchBox = React.createClass({
    displayName: 'SearchBox',

    getInitialState: function () {
        return { searchString: 'STEAM_1:1:76561198004120193 STEAM_1:1:76561198004120194 STEAM_1:1:76561198004120195', appID: 440, users: [] };
    },
    handleSearchChange: function (e) {
        this.setState({ searchString: e.target.value });
    },
    handleResponse: function (data) {
        var players = data.response.players;
        this.setState({ users: players });
    },
    handleSearch: function (e) {
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
        var requestURL = "http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=" + KEY + "&steamids=";

        var formatedSearch = searchArray.toString();

        requestURL += formatedSearch;

        //use fetch api to get json from steam server
        fetch(requestURL).then(function (response) {
            if (response.status !== 200) {
                console.log('Error fetching user summaries, status: ' + response.status);
                return;
            }

            // Examine the text in the response
            response.json().then(this.handleResponse);
        }.bind(this)).catch(function (err) {
            console.log('Fetch Error :-S', err);
        });

        //set search input to new formatted text
        this.setState({ searchString: formatedSearch });
    },
    render: function () {
        return React.createElement(
            'div',
            null,
            React.createElement(
                'div',
                { className: 'searchbar' },
                React.createElement(
                    'form',
                    null,
                    React.createElement(
                        'select',
                        null,
                        React.createElement(
                            'option',
                            { value: '440' },
                            'TF2'
                        ),
                        React.createElement(
                            'option',
                            { value: '730' },
                            'CSGO'
                        ),
                        React.createElement(
                            'option',
                            { value: '570' },
                            'Dota 2'
                        )
                    )
                ),
                React.createElement(
                    'form',
                    { onSubmit: this.handleSearch, onChange: this.handleSearchChange, style: {
                            width: "calc(50% - 115px)",
                            paddingRight: "10px"
                        } },
                    React.createElement('input', { id: 'search', type: 'text', defaultValue: this.state.searchString, autoComplete: 'off', placeholder: 'Search' })
                ),
                React.createElement(
                    'form',
                    { onSubmit: this.handleFilter, style: {
                            width: "calc(50% - 115px)"
                        } },
                    React.createElement('input', { id: 'filter', type: 'text', placeholder: 'Filters' })
                )
            ),
            React.createElement(Sidebar, { users: this.state.users })
        );
    }
});

ReactDOM.render(React.createElement(SearchBox, null), document.getElementById('page'));
//# sourceMappingURL=/home/matt/Documents/TFI/js/app.js.map