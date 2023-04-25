const mocha=require('mocha')
const chai=require('chai')
const chaitHttp=require('chai-http')
const server=require('../../index')
let accessToken = ""
const assert=chai.assert
chai.use(chaitHttp)

describe("-----device instance routes-----",()=>{
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
    
    it('validating patch--successful',(done)=>{
        chai.request(server)
        .post("/v1/doctor/deviceInstance/validatePatch")
        .query({
            patchId: "63774f3173e70c0021bcacb9"
        })
        .set({Authorization:`Bearer ${accessToken}`})
        .end((err,res)=>{
            assert.equal(res.status,200)
            console.log(res.body);
            done()
        })
    })

    it('validating patch--unauthorized',(done)=>{
        chai.request(server)
        .post("/v1/doctor/deviceInstance/validatePatch")
        .set({Authorization:`Bearer `})
        .end((err,res)=>{
            assert.equal(res.status,401)
            console.log(res.body);
            done()
        })
    })
})