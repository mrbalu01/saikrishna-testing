const mocha=require('mocha')
const chai=require('chai')
const chaitHttp=require('chai-http')
const server=require('../../index')
let accessToken = ""
const assert=chai.assert
chai.use(chaitHttp)

describe("-----story routes-----",()=>{
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
    it('getting list of stories [Images] from pagecontents --successful',(done)=>{
        chai.request(server)
        .get("/v1/doctor/story")
        .query({
            page:1,
            perPage:5,
            category:"",
            language:"en",//en id
        })
        .set({Authorization:`Bearer ${accessToken}`})
        .end((err,res)=>{
            assert.equal(res.status,200)
            console.log(res.body);
            done()
        })
    })

    it('getting list of stories [Images] from pagecontents --unauthorized',(done)=>{
        chai.request(server)
        .get("/v1/doctor/story")
        .end((err,res)=>{
            assert.equal(res.status,401)
            console.log(res.body);
            done()
        })
    })
})