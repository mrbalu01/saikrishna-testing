const mocha=require('mocha')
const chai=require('chai')
const chaitHttp=require('chai-http')
const server=require('../../index')
const assert=chai.assert
chai.use(chaitHttp)

describe("-----country routes-----",()=>{
    it('getting country list',(done)=>{
        chai.request(server)
        .get("/v1/doctor/countries")
        .end((err,res)=>{
            assert.equal(res.status,200)
            console.log(res.body);
            done()
        })
    })
})
