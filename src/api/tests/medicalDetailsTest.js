const mocha=require('mocha')
const chai=require('chai')
const chaitHttp=require('chai-http')
const server=require('../../index')
let accessToken = ""
const assert=chai.assert
chai.use(chaitHttp)

describe("-----medical details routes-----",()=>{
    before((done)=>{
        chai.request(server)
        .post("/v1/doctor/auth/login")
        .send({
            "mobile":{
                "number":"9390599058",
                "countryCode":"91"
            }
        })
        .end((err,res)=>{
            console.log(res.body);
            accessToken=res.body.accessToken
            done()
        })
    })
    
    it('getting list of ecg records--successful',(done)=>{
        chai.request(server)
        .get("/v1/doctor/conditions")
        .set({Authorization:`Bearer ${accessToken}`})
        .end((err,res)=>{
            assert.equal(res.status,200)
            console.log(res.body);
            done()
        })
    })

    it('getting list of ecg records--unauthorized',(done)=>{
        chai.request(server)
        .get("/v1/doctor/conditions")
        .set({Authorization:`Bearer`})
        .end((err,res)=>{
            assert.equal(res.status,401)
            console.log(res.body);
            done()
        })
    })
})