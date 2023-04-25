const mocha=require('mocha')
const chai=require('chai')
const chaitHttp=require('chai-http')
const server=require('../../index')
let accessToken = ""
let businessId=""
let serviceEnablerId=""
const assert=chai.assert
chai.use(chaitHttp)
const data={

}

describe("-----business partner routes-----",()=>{
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
            businessId=res.body.user.businessPartners[0].businessPartnerId
            serviceEnablerId=res.body.user.businessPartners[0]._id
            done()
        })
    })

    it('getting business partner details--successful',(done)=>{
        chai.request(server)
        .get(`/v1/doctor/business`)
        .set({Authorization:`Bearer ${accessToken}`})
        .end((err,res)=>{
            //assert.equal(res.status,200)
            console.log(res.body);
            done()
        })
    })

    it('getting business partner details--unauthorized',(done)=>{
        chai.request(server)
        .get("/v1/doctor/business")
        .end((err,res)=>{
            assert.equal(res.status,401)
            console.log(res.body);
            done()
        })
    })

    it('creating business partner--successful',(done)=>{
        chai.request(server)
        .post("/v1/doctor/business")
        .set({Authorization:`Bearer ${accessToken}`,
        business:businessId})
        //.send(data)
        .end((err,res)=>{
            //assert.equal(res.status,401)
            console.log(res.body);
            done()
        })
    })

    it('creating business partner--missing businessId',(done)=>{
        chai.request(server)
        .post("/v1/doctor/business")
        .set({Authorization:`Bearer ${accessToken}`})
        .send(data)
        .end((err,res)=>{
            assert.equal(res.status,404)
            console.log(res.body);
            done()
        })
    })

    it('creating business partner--unauthorized',(done)=>{
        chai.request(server)
        .post("/v1/doctor/business")
        .set({business:businessId})
        .send(data)
        .end((err,res)=>{
            assert.equal(res.status,401)
            console.log(res.body);
            done()
        })
    })

    it('getting business partner details by id--successful',(done)=>{
        chai.request(server)
        .get(`/v1/doctor/business/${businessId}`)
        .set({Authorization:`Bearer ${accessToken}`})
        .end((err,res)=>{
            //assert.equal(res.status,200)
            console.log(res.body);
            done()
        })
    })

    it('getting business partner details by id--unauthorized',(done)=>{
        chai.request(server)
        .get(`/v1/doctor/business/${businessId}`)
        .end((err,res)=>{
            assert.equal(res.status,401)
            console.log(res.body);
            done()
        })
    })

    it('getting case count by business partner id--successful',(done)=>{
        chai.request(server)
        .get("/v1/doctor/business/case/count")
        .set({Authorization:`Bearer ${accessToken}`,
        business:businessId
    })
        .end((err,res)=>{
            console.log(res.body);
            //assert.equal(res.status,200)
            done()
        })
    })

    it('getting case count by business partner id--missing businessId',(done)=>{
        chai.request(server)
        .get("/v1/doctor/business/case/count")
        .set({Authorization:`Bearer ${accessToken}`})
        .end((err,res)=>{
            console.log(res.body);
            assert.equal(res.status,500)
            done()
        })
    })

    it('getting case count by business partner id--unauthorized',(done)=>{
        chai.request(server)
        .get("/v1/doctor/business/case/count")
        .end((err,res)=>{
            assert.equal(res.status,401)
            console.log(res.body);
            done()
        })
    })

    it('getting case statistics by business partner id--successful',(done)=>{
        chai.request(server)
        .get(`/v1/doctor/business/${businessId}/statistics`)
        .set({Authorization:`Bearer ${accessToken}`})
        .end((err,res)=>{
            //assert.equal(res.status,200)
            console.log(res.body);
            done()
        })
    })

    it('getting case statistics by business partner id--unauthorized',(done)=>{
        chai.request(server)
        .get(`/v1/doctor/business/${businessId}/statistics`)
        .end((err,res)=>{
            assert.equal(res.status,401)
            console.log(res.body);
            done()
        })
    })
})