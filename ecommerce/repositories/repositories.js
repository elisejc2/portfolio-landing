const fs = require('fs');
const crypto = require('crypto');



module.exports = class Repositories {
    constructor(filename) {
        if (!filename) {
            throw new Error('Creating a repository requires a filename');
        }

        //instance variable
        this.filename = filename;
        try {
            fs.accessSync(this.filename); //if that file does not exisit it will throw an error (in the catch)
        } catch (err) {
            fs.writeFileSync(this.filename, '[]'); //this will create the file since there was none
        }
    }

    async create(attrs) {
        attrs.id = this.randomId();
        const records = await this.getAll();
        records.push(attrs);
        await this.writeAll(records);

        return attrs;
    };

    async getAll() {
        return JSON.parse(
            await fs.promises.readFile(this.filename, { 
            encoding: 'utf8' 
            })
        );
    }

    async writeAll(records) {
         //write the updated 'records' array back to this.filename
        await fs.promises.writeFile(this.filename, JSON.stringify(records, null, 2)); //the null and 2 make it so they arent all printed on the same line in the json file 
        //2 is the level of indentation to use inside the json string 
    }
    randomId() {
        return crypto.randomBytes(4).toString('hex');
    }

    async getOne(id) {
        const records = await this.getAll();
        return records.find(record => record.id === id); //iterate through each record and return true for the first record that has an id property equal to the id that we passed in (aka a match) 
    }

    async delete(id) {
        const records = await this.getAll();
        const filteredRecords = records.filter(record => record.id !== id); //the filter fxn is only going to retain elements that return true from the inner fxn; so we want to return true if the id is not the same
        await this.writeAll(filteredRecords);
    }

    async update(id, attrs) {
        const records = await this.getAll();
        const record = records.find(record => record.id === id);

        if (!record) {
            throw new Error(`Record with id ${id} not found`);
        }

        //ex: if record === { email: test@test.com } and attrs === { password: 'mypassword' };, the Object.assign() would => records === { email: test@test.com, password: 'mypassword' }
        Object.assign(record, attrs); //Object.assign() takes all of the records and copies them one by one, ontoo the record object (users.json ?)
        await this.writeAll(records);
    }

    async getOneBy(filters) {
        // { email: test1@test.com }
        const records = await this.getAll();

        //the outer loop is a 'for of' loop bc we are iterating thro an array
        //inner for loop is a 'for in' loop bc we are iterating thro an object
        for (let record of records) {
            let found = true;
            for (let key in filters) {
                const existingProperty = record[key]; //test1@test.com
                const propertyToFilterOn = filters[key]; //test1@test.com

                if (existingProperty !== propertyToFilterOn) {
                    found = false;
                }
            }
            if (found) {
                return record;
            }
        }
    }
};