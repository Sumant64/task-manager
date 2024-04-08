const mongoose = require('mongoose');

mongoose.set("strictQuery", false);

mongoose.connect('mongodb://127.0.0.1:27017/task-manager-api', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('connection successfull to db')
}).catch((err) => {
    console.log(err);
})