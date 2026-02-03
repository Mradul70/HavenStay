const mongoose = require("mongoose");
const plm = require("passport-local-mongoose");
const passportLocalMongoose = typeof plm === "function" ? plm : plm.default;
const Schema = mongoose.Schema;

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    username: {
        type: String,
        required: true,
        unique: true,
    },
});

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", userSchema);
