const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
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
        name : {
            type:String,
        },
        familyName : {
            type:String,
        },       
       
        authType: {
            type: String,
        },
        sex: {
            type: String,
        },
        resetToken : {
            type:String,
        },
        phone: {
            primary: {
                type: String,
            },
            secondary: {
                type: String,
            },
        },
        status:
        {
            type: String,
            enum: ['unverified', 'enabled', 'disabled', 'blocked', 'deleted','verified'],

        },
        verificationToken:{
            type : String,
        },
        

        twoFactorAuthEnabled:
        {
            type: Boolean,
            default: false,
        },
        address: {
            type: String,
        },
        recovery_token: {
            type: String,
        },
        last_access_date: {
            type: Date,
            default: Date.now()
        },
        bio: {
            type: String,
        },
        socials: {
            facebook: {
                type: String,
                default: ""
            },
            twitter: {
                type: String,
                default: ""
            },
            instagram: {
                type: String,
                default: ""
            },
           
        },
        notifications: [{type: mongoose.Schema.Types.ObjectId, ref: 'Notification'}],
        notificationFollow:
        {
            type: Boolean,
            default: false,
        },
        notificationAnswerPost:
        {
            type: Boolean,
            default: false,
        },
        notificationMention:
        {
            type: Boolean,
            default: false,
        },
        notificationNewProject:
        {
            type: Boolean,
            default: false,
        },
        notificationProductUpdates:
        {
            type: Boolean,
            default: false,
        },
        subscribeNewsLetter:
        {
            type: Boolean,
            default: false,
        },
        ip : {
            type: String,
        }
    },  

);

module.exports = mongoose.model('User', userSchema);
