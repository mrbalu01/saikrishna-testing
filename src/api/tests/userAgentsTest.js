const mocha=require('mocha')
const chai=require('chai')
const chaitHttp=require('chai-http')
const server=require('../../index')
const User=require('../models/auth/user.model')
const assert=chai.assert
chai.use(chaitHttp)
let data={}

describe("-----useragents routes-----",()=>{
    before((done)=>{
        data.accessToken = ""
        data.businessId=""
        data.random = Math.floor(Math.random() * 90000 + 10000)
        data.number = Math.floor(Math.random() * 9000000000) + 1000000000

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
            data.accessToken=res.body.accessToken
            data.businessId=res.body.user.businessPartners[0].businessPartnerId;            
            done()
        })
    })

    describe("creating user associate",()=>{
        before(()=>{
            data.associateData={
            firstName:"test",
            lastName:"vs",
            loginId:`test@vs${data.random}`,
            password:"changeme",
            mobile:{
                number:data.number,
                countryCode:"91"
            },
            confirmPassword:"changeme",
            businessPartners:[
                {
                    email:"test@vs.com",
                    businessPartnerId:data.businessId,
                    roles:[
                        {
                            role:"ASSOCIATE" 
                        }
                    ]
                }
            ]
        }
    })

        it('creating user associate--successful',(done)=>{
            chai.request(server)
            .post("/v1/doctor/users/userAgents")
            .send(data.associateData)
            .set({
                Authorization:`Bearer ${data.accessToken}`})
            .end((err,res)=>{
                assert.equal(res.status,200)
                console.log(res.body);
                data.loginId=res.body.loginId
                data.userId=res.body.id
                done()
            })
        })

        it('creating user associate--login id arleady exist error',(done)=>{
            chai.request(server)
            .post("/v1/doctor/users/userAgents")
            .send(data.associateData)
            .set({Authorization:`Bearer ${data.accessToken}`})
            .end((err,res)=>{
                assert.equal(res.status,500)
                console.log(res.body);
                done()
            })
        })

        it('creating user associate--unauthorized',(done)=>{
            chai.request(server)
            .post("/v1/doctor/users/userAgents")
            .send(data.associateData)
            .end((err,res)=>{
                assert.equal(res.status,401)
                console.log(res.body);
                done()
            })
        })

        // it('Duplicate login Id--successful',(done)=>{
        //     chai.request(server)
        //     .post("v1/doctor/users/userAgents/duplicateLoginId")
        //     .set({Authorization:`Bearer ${data.accessToken}`})
        //     .send({
        //         loginId:data.loginId
        //     })
        //     .end((err,res)=>{
        //         assert.equal(res.status,200)
        //         console.log(res.body.isDuplicate);
        //         done()
        //     })
        // })

        it('Duplicate login Id--unauthorized',(done)=>{
            chai.request(server)
            .post("v1/doctor/users/userAgents/duplicateLoginId")
            .send({
                loginId:data.loginId
            })
            .end((err,res)=>{
                //assert.equal(res.status,401)
                console.log(err);
                console.log(res.body);
                done()
            })
        })

        it('updating user associate--successful',(done)=>{
            const Data={
                firstName:"update",
                lastName:"test",
                mobile:{
                    number:data.number+1,
                    countryCode:"91"
                }
            }
            chai.request(server)
            .patch(`/v1/doctor/users/userAgents/${data.userId}`)
            .set({
                Authorization:`Bearer ${data.accessToken}`,
                business:data.businessId
            })
            .send(Data)
            .end((err,res)=>{
                assert.equal(res.status,200)
                console.log(res.body);
                done()
            })
        })

        it('updating user associate--missing businessId',(done)=>{
            chai.request(server)
            .patch(`/v1/doctor/users/userAgents/${data.userId}`)
            .set({
                Authorization:`Bearer ${data.accessToken}`})
            .end((err,res)=>{
                assert.equal(res.status,404)
                console.log(res.body);
                done()
            })
        })

        it('updating user associate--unauthorized',(done)=>{
            chai.request(server)
            .patch(`/v1/doctor/users/userAgents/${data.userId}`)
            .end((err,res)=>{
                assert.equal(res.status,401)
                console.log(res.body);
                done()
            })
        })        

        it('getting user asssociate profile--successful',(done)=>{
            chai.request(server)
            .get("/v1/doctor/users/userAgents/Profile")
            .set({Authorization:`Bearer ${data.accessToken}`})
            .end((err,res)=>{
                assert.equal(res.status,200)
                console.log(res.body);
                done()
            })
        })

        it('getting user asssociate profile--unauthorized',(done)=>{
            chai.request(server)
            .get("/v1/doctor/users/userAgents/Profile")
            .end((err,res)=>{
                assert.equal(res.status,401)
                console.log(res.body);
                done()
            })
        })

        it('getting user associate profile by userId--successful',(done)=>{
            chai.request(server)
            .get(`/v1/doctor/users/userAgents/${data.userId}`)
            .set({Authorization:`Bearer ${data.accessToken}`})
            .end((err,res)=>{
                assert.equal(res.status,200)
                console.log(res.body);
                done()
            })
        })

        it('getting user associate profile by userId--invalid user',(done)=>{
            chai.request(server)
            .get(`/v1/doctor/users/userAgents/1234`)
            .set({Authorization:`Bearer ${data.accessToken}`})
            .end((err,res)=>{
                assert.equal(res.status,404)
                console.log(res.body);
                done()
            })
        })

        it('getting user associate profile by userId--unauthorized',(done)=>{
            chai.request(server)
            .get(`/v1/doctor/users/userAgents/${data.userId}`)
            .end((err,res)=>{
                assert.equal(res.status,401)
                console.log(res.body);
                done()
            })
        })

        it('getting list of useragents--successful',(done)=>{
            chai.request(server)
            .get("/v1/doctor/users/userAgents")
            .query({
                isActive:false,
                query:"",
                page:1,
                perPage:5,
            })
            .set({
                Authorization:`Bearer ${data.accessToken}`,
                business:data.businessId})
            .end((err,res)=>{
                assert.equal(res.status,200)
                console.log(res.body);
                done()
            })
        })

        it('getting list of useragents--missing businessId',(done)=>{
            chai.request(server)
            .get("/v1/doctor/users/userAgents")
            .set({
                Authorization:`Bearer ${data.accessToken}`})
            .end((err,res)=>{
                assert.equal(res.status,404)
                console.log(res.body);
                done()
            })
        })

        it('getting list of useragents--unauthorized',(done)=>{
            chai.request(server)
            .get("/v1/doctor/users/userAgents")
            .end((err,res)=>{
                assert.equal(res.status,401)
                console.log(res.body);
                done()
            })
        })

        it('deleting user associate--unauthorized',(done)=>{
            chai.request(server)
            .delete(`/v1/doctor/users/userAgents/${data.userId}`)
            .end((err,res)=>{
                assert.equal(res.status,401)
                console.log(res.body);
                done()
            })
        })

        it('deleting user associate--successful',(done)=>{
            chai.request(server)
            .delete(`/v1/doctor/users/userAgents/${data.userId}`)
            .set({
                Authorization:`Bearer ${data.accessToken}`,
                business:data.businessId
            })
            .end(async(err,res)=>{
                assert.equal(res.status,200)
                await User.findByIdAndDelete(data.userId)
                console.log(res.body);
                done()
            })
        })

        it('deleting user associate--missing businessId',(done)=>{
            chai.request(server)
            .delete(`/v1/doctor/users/userAgents/${data.userId}`)
            .set({
                Authorization:`Bearer ${data.accessToken}`})
            .end((err,res)=>{
                assert.equal(res.status,404)
                console.log(res.body);
                done()
            })
        })

    })
})