const app = require('./app')
require('./db/mongoose')
const port  = process.env.PORT
app.listen(port,()=>{
    console.log('Server started on port '+port)
})
