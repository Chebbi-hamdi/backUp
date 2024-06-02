const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const testSchema = new Schema({

    name : {
        type:String,
    },
    familyName : {
        type:String,
    },
    email: {
        primary: {
            type: String,
            index: {unique: true, dropDups: true},
            required: true
        },
    },
    recup_email: {
        type: String,
    },
    password: {
        type: String,
    },
});

module.exports = mongoose.model('test', testSchema);



