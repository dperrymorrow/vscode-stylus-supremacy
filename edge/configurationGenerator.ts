import * as fs from 'fs'
import * as Cheerio from 'cheerio'
import { createFormattingOptions } from 'stylus-supremacy'

const schema = createFormattingOptions.schema
const packageJson = JSON.parse(fs.readFileSync('./package.json', 'utf-8'))

packageJson.contributes.configuration.properties = Object.keys(schema)
	.filter(name => schema[name].hideInVSCE !== true)
	.map(name => {
		const item = { ...schema[name] }
		item.description = Cheerio.load('<p>' + item.description + '</p>').root().text()
		delete item.example
		delete item.hideInDemo
		return [name, item]
	})
	.reduce((hash, pair) => {
		hash['stylusSupremacy.' + pair[0]] = pair[1]
		return hash
	}, {})

console.log(JSON.stringify(packageJson.contributes, null, '  '))
// fs.writeFileSync('./package.json', JSON.stringify(packageJson, null, '  '))
