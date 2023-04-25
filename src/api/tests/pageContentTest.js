const mocha=require('mocha')
const chai=require('chai')
const chaitHttp=require('chai-http')
const server=require('../../index')
let accessToken = ""
const assert=chai.assert
chai.use(chaitHttp)

describe("-----page content routes-----",()=>{
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
    
    it('getting page content attributes for client--successful',(done)=>{
        chai.request(server)
        .get("/v1/doctor/pageContent")
        .query({
            page:1,
            perPage:5,
            query:"",
            contentType:"TEXT", //IMAGE TEXT TEXT_IMAGE
            category:"",
            feaure:"",
            language:"en",//en id
            expired:false
        })
        .set({Authorization:`Bearer ${accessToken}`})
        .end((err,res)=>{
            assert.equal(res.status,200)
            console.log(res.body);
            done()
        })
    })

    it('getting page content attributes for client--unauthorized',(done)=>{
        chai.request(server)
        .get("/v1/doctor/pageContent")
        .set({Authorization:`Bearer `})
        .end((err,res)=>{
            assert.equal(res.status,401)
            console.log(res.body);
            done()
        })
    })
})