const mocha=require('mocha')
const chai=require('chai')
const chaitHttp=require('chai-http')
const server=require('../../index')
const assert=chai.assert
chai.use(chaitHttp)

describe("----- BUSINESS ENQUIRY ROUTES-----",()=>{
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
            assert.equal(res.status,200)
            assert.property(res.body,"accessToken")
            accessToken=res.body.accessToken
            done()
        })
    })
    
    it('creating business enquiry--successful',(done)=>{
        const data={
            "business":{
                "name":"TEST",
                "website":"test.com",
                "email":"test@vs.com",
                "mobie":{
                    "number":"9390599058",
                    "countryCode":"91"
                },
                "message":"this is sample message"
            }
            
        }
        chai.request(server)
        .post("/v1/doctor/businessEnquiry")
        .set({Authorization:`Bearer ${accessToken}`})
        .send(data)
        .end((err,res)=>{
            assert.equal(res.status,200)
            console.log(res.body);
            done()
        })
    })

    it('creating business enquiry--unauthorized',(done)=>{
        chai.request(server)
        .post("/v1/doctor/businessEnquiry")
        .set({Authorization:`Bearer `})
        .end((err,res)=>{
            assert.equal(res.status,401)
            console.log(res.body);
            done()
        })
    })
})
