const request = require('supertest')
const app = require('../src/app')
const User = require('../src/models/user')
const {userOneId,userOne,setupDatabase}=require('./fixtures/db')

beforeEach(setupDatabase)

test('Should sign up new user',async()=>{
    const response=await request(app).post('/users').send({
        name:'Andrew',
        email:'andrew@example.com',
        password:'mypass123'
    }).expect(201)

    //ASSERT THAT THE DATABASE WAS CHANGED CORRECTLY
    const user = await User.findById(response.body.user._id)
    expect(user).not.toBeNull()

    //ASSERTIONS ABOUT RESPONSE
    expect(response.body).toMatchObject({
        user:{
            name:'Andrew',
            email:'andrew@example.com'
        },
        token:user.tokens[0].token
    })
    expect(user.password).not.toBe('mypass123')
})

test('Login the user',async()=>{
    const response=await request(app).post('/users/login').send({
        email:userOne.email,
        password:userOne.password
    }).expect(200)

    //ASSERT TOKEN IN BODY MATCHES SECOND TOKEN
    const user =await  User.findOne({email:userOne.email})
    expect(user.tokens[1].token).toBe(response.body.token)
})

test('Should not login non existing user',async()=>{
    await request(app).post('/users/login').send({
        email:'arunshenoy99@gmail.com',
        password:'lolo'
    }).expect(400)
})

test('Should get profile for user',async()=>{
    await request(app)
    .get('/users/me')
    .set('Authorization',`Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200)
})

test('Should not get profile when there is no auth',async()=>{
    await request(app)
    .get('/users/me')
    .send()
    .expect(401)
})

test('Should delete account for user',async()=>{
    const response=await request(app)
    .delete('/users/me')
    .set('Authorization',`Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200)

    const user = await User.findOne({email:response.body.email})
    expect(user).toBeNull()
})

test('Should not delete account for no auth user',async()=>{
    await request(app)
    .delete('/users/me')
    .send()
    .expect(401)
})

test('Should upload avatar image',async()=>{
    await request(app)
    .post('/users/me/avatar')
    .set('Authorization',`Bearer ${userOne.tokens[0].token}`)
    .attach('avatar','tests/fixtures/profile-pic.jpg')
    .expect(200)

    const user =await  User.findById(userOne._id)
    expect(user.avatar).toEqual(expect.any(Buffer))                                    //TO EQUAL IS USED TO COMPARE OBJECTS,CHECK IF AVATAR WAS STORED AS BUFFER
})


test('Should update valid user fields',async()=>{
    await request(app)
    .patch('/users/me')
    .set('Authorization',`Bearer ${userOne.tokens[0].token}`)
    .send({name:'Arun'})
    .expect(200)

    const user = await User.findById(userOne._id)
    expect(user.name).toBe('Arun')
})

test('Should not update invalid fields',async()=>{
    await request(app)
    .patch('/users/me')
    .set('Authorization',`Bearer ${userOne.tokens[0].token}`)
    .send({location:'lolo'})
    .expect(400)
})