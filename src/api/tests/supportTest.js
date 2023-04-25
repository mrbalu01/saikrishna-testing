const mocha=require('mocha')
const chai=require('chai')
const chaitHttp=require('chai-http')
const server=require('../../index')
let accessToken = ""
const assert=chai.assert
chai.use(chaitHttp)

describe("-----support routes-----",()=>{
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
    const data={
        customer:{
            firstName:"test",
            lastName:"test",
            email:"test@vs.com",
            mobile:{
                number:"8172736450",
                countryCode:"91"
            },
            condition:{
                id:"6123411f8fb672002b7d1279",
                name:""
            }
        }
    }
    
    it('refer a patient--successful',(done)=>{
        chai.request(server)
        .post("/v1/doctor/referAPatient")
        .send(data)
        .set({Authorization:`Bearer ${accessToken}`})
        .end((err,res)=>{
            assert.equal(res.status,200)
            console.log(res.body);
            done()
        })
    })

    it('refer a patient--unauthorized',(done)=>{
        chai.request(server)
        .post("/v1/doctor/referAPatient")
        .send(data)
        .set({Authorization:`Bearer`})
        .end((err,res)=>{
            assert.equal(res.status,401)
            console.log(res.body);
            done()
        })
    })
})