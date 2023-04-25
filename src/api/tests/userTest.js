const mocha=require('mocha')
const chai=require('chai')
const chaitHttp=require('chai-http')
const server=require('../../index')
const assert=chai.assert
chai.use(chaitHttp)
const User=require('../models/auth/user.model')
let data={}

describe("-----user routes-----",()=>{
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
    
    describe("create doctor",()=>{
        before(()=>{
        data.docData={
            firstName:"test",
            lastName:"vs",
            mobile:{
             number:data.number,
             countryCode:"91"
            },
            businessPartners:[
             {
                 businessPartnerId:data.businessId,
                 displayName:"test@vs",
                 email:"test@vs.com",
                 providerNumber:"",
                 speciality:"Cardioilogy" ,
                 roles:[
                     {
                         role:"INTERNAL_DOCTOR" 
                     }
                 ]
             }
            ]
         }
        })

        it('create doctor--success',(done)=>{
            chai.request(server)
            .post("/v1/doctor/users")
            .set({Authorization:`Bearer ${data.accessToken}`})
            .send(data.docData)
            .end((err,res)=>{
                assert.equal(res.status,200)
                data.docId=res.body.id
                console.log(res.body);
                done()
            })
        })
    
        it('create doctor--number arleady exist error',(done)=>{
            chai.request(server)
            .post("/v1/doctor/users")
            .set({Authorization:`Bearer ${data.accessToken}`})
            .send(data.docData)
            .end((err,res)=>{
                assert.equal(res.status,500)
                console.log(res.body);
                done()
            })
        })
    
        it('create doctor--unauthorized',(done)=>{
            chai.request(server)
            .post("/v1/doctor/users")
            .set({Authorization:`Bearer`})
            .send(data.docData)
            .end((err,res)=>{
                assert.equal(res.status,401)
                console.log(res.body);
                done()
            })
        })

        it('getting doctor details--successful',(done)=>{
            chai.request(server)
            .get("/v1/doctor/users")
            .set({Authorization:`Bearer ${data.accessToken}`,
            business:data.businessId})
            .end((err,res)=>{
                assert.equal(res.status,200)
                console.log(res.body);
                done()
            })
        })

        it('getting doctor details--missing businessId',(done)=>{
            chai.request(server)
            .get("/v1/doctor/users")
            .set({Authorization:`Bearer ${data.accessToken}`})
            .end((err,res)=>{
                assert.equal(res.status,404)
                console.log(res.body);
                done()
            })
        })

        it('getting doctor details--unauthorized',(done)=>{
            chai.request(server)
            .get("/v1/doctor/users")
            .end((err,res)=>{
                assert.equal(res.status,401)
                console.log(res.body);
                done()
            })
        })

        it('getting doctor profile--successful',(done)=>{
            chai.request(server)
            .get("/v1/doctor/users/profile")
            .set({Authorization:`Bearer ${data.accessToken}`})
            .end((err,res)=>{
                assert.equal(res.status,200)
                console.log(res.body);
                done()
            })
        })

        it('getting doctor profile--unauthorized',(done)=>{
            chai.request(server)
            .get("/v1/doctor/users/profile")
            .end((err,res)=>{
                assert.equal(res.status,401)
                console.log(res.body);
                done()
            })
        })

        it('getting doctor by mobile--successful',(done)=>{
            chai.request(server)
            .get("/v1/doctor/users/doctorByMobile")
            .set({Authorization:`Bearer ${data.accessToken}`,
            business:data.businessId})
            .query({
                countryCode:"91",
                number:data.number
            })
            .end((err,res)=>{
                assert.equal(res.status,200)
                console.log(res.body);
                done()
            })
        })

        it('getting doctor by mobile--missing/invalid mobile number/country code',(done)=>{
            chai.request(server)
            .get("/v1/doctor/users/doctorByMobile")
            .set({Authorization:`Bearer ${data.accessToken}`,
            business:data.businessId})
            .end((err,res)=>{
                assert.equal(res.status,500)
                console.log(res.body);
                done()
            })
        })

        it('getting doctor by mobile--missing businessId',(done)=>{
            chai.request(server)
            .get("/v1/doctor/users/doctorByMobile")
            .set({Authorization:`Bearer ${data.accessToken}`})
            .end((err,res)=>{
                assert.equal(res.status,404)
                console.log(res.body);
                done()
            })
        })

        it('getting doctor by mobile--unauthorized',(done)=>{
            chai.request(server)
            .get("/v1/doctor/users/doctorByMobile")
            .end((err,res)=>{
                assert.equal(res.status,401)
                console.log(res.body);
                done()
            })
        })

        it('checking for doctor existance--successful',(done)=>{
            chai.request(server)
            .get("/v1/doctor/users/isDoctorExists")
            .set({Authorization:`Bearer ${data.accessToken}`})
            .query({
                countryCode:"91",
                number:data.number
            })
            .end((err,res)=>{
                assert.equal(res.status,200)
                console.log(res.body);
                done()
            })
        })        

        it('checking for doctor existance--unauthorized',(done)=>{
            chai.request(server)
            .get("/v1/doctor/users/isDoctorExists")
            .end((err,res)=>{
                assert.equal(res.status,401)
                console.log(res.body);
                done()
            })
        })

        it('getting doctor profile list under mentioned business Id--successful',(done)=>{
            chai.request(server)
            .get(`/v1/doctor/users/doctorsByBusinessId/${data.businessId}`)
            .set({Authorization:`Bearer ${data.accessToken}`})
            .end((err,res)=>{
                assert.equal(res.status,200)
                console.log(res.body);
                done()
            })
        })

        it('getting doctor profiles under mentioned business Id--user doesnot exist(no businessId)',(done)=>{
            chai.request(server)
            .get(`/v1/doctor/users/doctorsByBusinessId/`)
            .set({Authorization:`Bearer ${data.accessToken}`})
            .end((err,res)=>{
                assert.equal(res.status,404)
                console.log(res.body);
                done()
            })
        })

        it('getting doctor profiles under mentioned business Id--businessId cast error',(done)=>{
            chai.request(server)
            .get(`/v1/doctor/users/doctorsByBusinessId/1234`)
            .set({Authorization:`Bearer ${data.accessToken}`})
            .end((err,res)=>{
                assert.equal(res.status,500)
                console.log(res.body);
                done()
            })
        })

        it('getting doctor profile list under mentioned business Id--unauthorized',(done)=>{
            chai.request(server)
            .get(`/v1/doctor/users/doctorsByBusinessId/${data.businessId}`)
            .end((err,res)=>{
                assert.equal(res.status,401)
                console.log(res.body);
                done()
            })
        })

        it('getting doctor profile by doctor Id--successful',(done)=>{
            chai.request(server)
            .get(`/v1/doctor/users/${data.docId}`)
            .set({Authorization:`Bearer ${data.accessToken}`})
            .end((err,res)=>{
                assert.equal(res.status,200)
                console.log(res.body);
                done()
            })
        })

        it('getting doctor profile by doctor Id--missing businessId',(done)=>{
            chai.request(server)
            .get(`/v1/doctor/users/`)
            .set({Authorization:`Bearer ${data.accessToken}`})
            .end((err,res)=>{
                assert.equal(res.status,404)
                console.log(res.body);
                done()
            })
        })

        it('getting doctor profile by doctor Id--unauthorized',(done)=>{
            chai.request(server)
            .get(`/v1/doctor/users/${data.docId}`)
            .end((err,res)=>{
                assert.equal(res.status,401)
                console.log(res.body);
                done()
            })
        })

        // it('getting active case count--successful',(done)=>{
        //     chai.request(server)
        //     .get(`/v1/doctor/users/${data.docId}/activeCaseCount`)
        //     .set({
        //         Authorization:`Bearer ${data.accessToken}`,
        //         business:data.businessId
        // })
        //     .end((err,res)=>{
        //         //assert.equal(res.status,200)
        //         console.log(res.body);
        //         done()
        //     })
        // })

        it('getting active case count--missing businessId',(done)=>{
            chai.request(server)
            .get(`/v1/doctor/users/${data.docId}/activeCaseCount`)
            .set({
                Authorization:`Bearer ${data.accessToken}`})
            .end((err,res)=>{
                assert.equal(res.status,404)
                console.log(res.body);
                done()
            })
        })


        it('getting active case count--unauthorized',(done)=>{
            chai.request(server)
            .get(`/v1/doctor/users/${data.docId}/activeCaseCount`)
            .end((err,res)=>{
                assert.equal(res.status,401)
                console.log(res.body);
                done()
            })
        })

        it('updating doctor profile by doctor Id--successful',(done)=>{
            const Data={
                firstName:"update",
                lastName:"test",
                mobile:{
                    number:`${data.number+1}`,
                    countryCode:"91"
                }
            }
            chai.request(server)
            .patch(`/v1/doctor/users/${data.docId}`)
            .set({
                Authorization:`Bearer ${data.accessToken}`,
                business:data.businessId
            })
            .send(Data)
            .end((err,res)=>{
                assert.equal(res.status,200)
                assert.equal(res.body.id,data.docId)
                assert.equal(res.body.businessPartners[0].businessPartnerId,data.businessId)
                console.log(res.body);
                done()
            })
        })

        it('updating doctor profile by doctor Id--missing businessId',(done)=>{
            chai.request(server)
            .patch(`/v1/doctor/users/${data.docId}`)
            .set({
                Authorization:`Bearer ${data.accessToken}`})
            .end((err,res)=>{
                assert.equal(res.status,404)
                console.log(res.body);
                done()
            })
        })

        it('updating doctor profile by doctor Id--unauthorized',(done)=>{
            chai.request(server)
            .patch(`/v1/doctor/users/${data.docId}`)
            .end((err,res)=>{
                assert.equal(res.status,401)
                console.log(res.body);
                done()
            })
        })

        it('deleting doctor by doctor Id--unauthorized',(done)=>{
            chai.request(server)
            .delete(`/v1/doctor/users/${data.docId}`)
            .end((err,res)=>{
                assert.equal(res.status,401)
                console.log(res.body);
                done()
            })
        })

        it('deleting doctor by doctor Id--successful',(done)=>{
            chai.request(server)
            .delete(`/v1/doctor/users/${data.docId}`)
            .set({
                Authorization:`Bearer ${data.accessToken}`,
                business:data.businessId
            })
            .end(async(err,res)=>{
                await User.findByIdAndDelete(data.docId)
                assert.equal(res.status,200)
                console.log(res.body);
                done()
            })
        })

        it('deleting doctor by doctor Id--missing businessId',(done)=>{
            chai.request(server)
            .delete(`/v1/doctor/users/${data.docId}`)
            .set({
                Authorization:`Bearer ${data.accessToken}`,})
            .end((err,res)=>{
                assert.equal(res.status,404)
                console.log(res.body);
                done()
            })
        })

    })


    

})


