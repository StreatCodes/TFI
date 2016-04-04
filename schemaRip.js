"use strict";

const fs = require('fs');

let schema = JSON.parse(fs.readFileSync('schema.json', 'utf8'));

let items = schema.result.items;
let itemMap = new Map();

for(let item of items){
	let itemToMap = {};
	let id = item.defindex;
	itemToMap.name = item.name;
	itemToMap.image_url = item.image_url;

	itemMap.set(id, itemToMap);
}

//convert map to json string
let mapJson = JSON.stringify(Array.from(itemMap.entries()));
fs.writeFileSync("schemaMap.json", mapJson, 'utf8');
