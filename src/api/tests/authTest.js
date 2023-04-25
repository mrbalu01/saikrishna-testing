const mocha=require('mocha')
const chai=require('chai')
const chaitHttp=require('chai-http')
const server=require('../../index')
const { log } = require('@grpc/grpc-js/build/src/logging')
const assert=chai.assert
chai.use(chaitHttp)
let accessToken=""
//mongodb://mvm-vigo-service1:v1taLs0nt%23Eg0@localhost:27018


describe("AUTH ROUTES",()=>{
    describe("--------POST - AUTH TESTS-------",()=>{
    it("doctor login--successful ",(done)=>{
        let data={
            "mobile":{
                "number":"9390599058",
                "countryCode":"91"
            }
        }
        chai.request(server)
        .post("/v1/doctor/auth/login")
        .send(data)
        .end((err,res)=>{
            console.log(res.body);
            assert.equal(res.status,200)
            assert.property(res.body,"accessToken")
            accessToken=res.body.accessToken
            assert.property(res.body.user,"mobile")
            assert.deepInclude(res.body.user,data)
            done()
        })
    })

    it("doctor login--incorrect credentials",(done)=>{
        let data={
            "mobile":{
                "number":"9390599058",
                "countryCode":"9"
            }
        }
        chai.request(server)
        .post("/v1/doctor/auth/login")
        .send(data)
        .end((err,res)=>{
            console.log(res.body);
            assert.equal(res.status,401)
            done()
        })
    })

    it("doctor login--invalid credentials",(done)=>{
        let data={
            "mobile":{
                "number":"",
                "countryCode":"91"
            }
        }
        chai.request(server)
        .post("/v1/doctor/auth/login")
        .send(data)
        .end((err,res)=>{
            console.log(res.body);
            assert.equal(res.status,500)
            done()
        })
    })
})

describe("--------GET - AUTH TESTS-------",()=>{
    it("auth token generation--successful ",(done)=>{
        chai.request(server)
        .get("/v1/doctor/auth/token?roomName=1&identity=admin")
        .set({Authorization:`Bearer ${accessToken}`})
        .end((err,res)=>{
            console.log(res.body)
            assert.equal(res.status,200)
            assert.property(res.body,"identity")
            assert.property(res.body,"token")
            done()
        })
    })

    it("auth token generation--unauthorized ",(done)=>{
        chai.request(server)
        .get("/v1/doctor/auth/token?roomName=1&identity=admin")
        .set({Authorization:`Bearer `})
        .end((err,res)=>{
            console.log(res.body)
            assert.equal(res.status,401)
            done()
        })
    })
})

})






