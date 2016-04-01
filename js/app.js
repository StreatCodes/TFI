"use strict";

var ItemList = React.createClass({
    displayName: "ItemList",

    render: function () {
        return React.createElement("div", { className: "main" });
    }
});

var Sidebar = React.createClass({
    displayName: "Sidebar",

    render: function () {
        return React.createElement("div", { className: "sidebar" });
    }
});

var SearchBox = React.createClass({
    displayName: "SearchBox",

    getInitialState: function () {
        return { searchString: '', appID: 440 };
    },
    handleSearchChange: function (e) {
        this.setState({ searchString: e.target.value });
    },
    searchArray: [],
    handleSearch: function (e) {
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
    render: function () {
        return React.createElement(
            "div",
            null,
            React.createElement(
                "div",
                { className: "searchbar" },
                React.createElement(
                    "form",
                    { onSubmit: this.handleSearch, onChange: this.handleSearchChange, style: {
                            width: "50%",
                            paddingRight: "10px"
                        } },
                    React.createElement("input", { id: "search", type: "text", value: this.state.searchString, autoComplete: "off", placeholder: "Search" })
                ),
                React.createElement(
                    "form",
                    { onSubmit: this.handleFilter, style: {
                            width: "50%"
                        } },
                    React.createElement("input", { id: "filter", type: "text", placeholder: "Filters" })
                )
            ),
            React.createElement(Sidebar, null)
        );
    }
});

ReactDOM.render(React.createElement(SearchBox, null), document.getElementById('page'));
//# sourceMappingURL=/home/matt/Documents/TFI/js/app.js.map