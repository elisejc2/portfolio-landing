const fs = require('fs');
const crypto = require('crypto');
// const { getSystemErrorMap } = require('util');
const util = require('util');
const Repositories = require('./repositories');
const scrypt = util.promisify(crypto.scrypt);

class UsersRepository extends Repositories {
    async comparePasswords(saved, supplied) {
        const [hashed, salt] = saved.split('.'); //the brackets on the left side of the equal sign show that we are doing destructuring; we want to reach into an array and pull values out of it
        const hashedSuppliedBuf = await scrypt(supplied, salt, 64);
        return hashed === hashedSuppliedBuf.toString('hex');

    }
    
    async create(attrs) {
        //attrs === { email: '', password: '' }
        attrs.id = this.randomId();

        const salt = crypto.randomBytes(8).toString('hex');
        const buf = await scrypt(attrs.password, salt, 64);

        const records = await this.getAll();
        const record = {
            ...attrs, //this ... syntax means create a new object
            password: `${buf.toString('hex')}.${salt}`
        };
        records.push(record);

        await this.writeAll(records)
        return attrs
    }
};

//this is how we get code to be available to other files inside our project 
module.exports = new UsersRepository('users.json');



// const test = async () => {
//     const repo = new UsersRepository('users.json');
//     const user = await repo.getOneBy({ email: 'test@test.com' });
//     console.log(user);
// };
// test();
// await repo.create({ email: 'test@test.com', password: 'myPassword' });
// const users = await repo.getAll();