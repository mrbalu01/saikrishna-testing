const mocha=require('mocha')
const chai=require('chai')
const chaitHttp=require('chai-http')
const server=require('../../index')
let data = {}
const assert=chai.assert
chai.use(chaitHttp)
//look into data.id in before...
describe("-----case routes-----",()=>{
    before((done)=>{
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
            data.businessId=res.body.user.businessPartners[0].businessPartnerId
            data.docFName=res.body.user.firstName
            data.docLName=res.body.user.lastName
            data.docId=res.body.user.id
            data.platformPartner=res.body.user.platformPartner
            data.id=""
            done()
        })
    })

    // it.only('customer creation',(done)=>{
    //     chai.request("http://localhost:3000")
    //     .post("/v1/patient/auth/register")
    //     .set({apikey:"dmlnb2NhcmU6JDJhJDEwJEhpY0JmS1hhckFoZ2pNMGNFRlZoWWU2ZHA4WkRJVFdXTXltaWUwNGQuWlYuRWFQTkRDNFlH"})
    //     .send({
    //         firstname:"test",
    //         lastName:"vs",
    //         mobile:{
    //             number:data.number,
    //             countryCode:"91"
    //         }
    //     })
    //     .end((err,res)=>{
    //         data.customerId=res.body.customer.id
    //         console.log(res.body);
    //         done()
    //     })

    // })

    // it.only('Creating patient case--successful',(done)=>{
        
    //     const Data={
    //         customerId:data.customerId,
    //         business:{
    //             id:data.businessId
    //         },
    //         platformPartner:data.platformPartner,
    //         doctor:{
    //             firstName:data.firstName,
    //             lastName:data.lastName,
    //             id:data.docId
    //         },
    //         condition:{
    //             id:"6369e3bf3c61f80022966520"
    //         },
    //         totalDuration:{
    //             duration:"1",
    //             durationUnits:"DAYS"
    //         }
    //     }
    //     chai.request(server)
    //     .post(`/v1/doctor/case/createCase`)
    //     .set({Authorization:`Bearer ${data.accessToken}`,
    //     business:data.businessId})
    //     .send(Data)
    //     .end((err,res)=>{
    //         //assert.equal(res.status,200)
    //         console.log(res.body);
    //         done()
    //     })
    // })


    it('Get List of cases for the Doctor / Associate / Admin--successful',(done)=>{
        chai.request(server)
        .get(`/v1/doctor/case/`)
        .set({Authorization:`Bearer ${data.accessToken}`,
        business:data.businessId})
        .query({
            search:"",
            customer:"",
            condition:"",
            page:"",
            perPage:""
        })
        .end((err,res)=>{
            assert.equal(res.status,200)
            console.log(res.body);
            done()
        })
    })

    it('Get List of cases for the Doctor / Associate / Admin--missing businessId',(done)=>{
        chai.request(server)
        .get(`/v1/doctor/case/`)
        .set({Authorization:`Bearer ${data.accessToken}`})
        .end((err,res)=>{
            assert.equal(res.status,404)
            console.log(res.body);
            done()
        })
    })

    it('Get List of cases for the Doctor / Associate / Admin--unauthorized',(done)=>{
        chai.request(server)
        .get(`/v1/doctor/case/`)
        .end((err,res)=>{
            assert.equal(res.status,401)
            console.log(res.body);
            done()
        })
    })

    it('Get List of ecg reports group by caseNumber--successful',(done)=>{
        chai.request(server)
        .get(`/v1/doctor/case/caseReports`)
        .set({Authorization:`Bearer ${data.accessToken}`,
        business:data.businessId})
        .query({
            search:"",
            customer:"",
            page:"",
            perPage:""
        })
        .end((err,res)=>{
            //assert.equal(res.status,200)
            console.log(res.body);
            done()
        })
    })

    it('Get List of ecg reports group by caseNumber--missing businessId',(done)=>{
        chai.request(server)
        .get(`/v1/doctor/case/caseReports`)
        .set({Authorization:`Bearer ${data.accessToken}`})
        .end((err,res)=>{
            assert.equal(res.status,404)
            console.log(res.body);
            done()
        })
    })

    it('Get List of ecg reports group by caseNumber--unauthorized',(done)=>{
        chai.request(server)
        .get(`/v1/doctor/case/caseReports`)
        .end((err,res)=>{
            assert.equal(res.status,401)
            console.log(res.body);
            done()
        })
    })

    it('Checks if the active case is present for the mobile number--successful',(done)=>{
        chai.request(server)
        .get(`/v1/doctor/case/isActiveCasePresent`)
        .set({Authorization:`Bearer ${data.accessToken}`})
        .query({
            number:"",
            countryCode:"91"
        })
        .end((err,res)=>{
            assert.equal(res.status,200)
            console.log(res.body);
            done()
        })
    })

    it('Checks if the active case is present for the mobile number--unauthorized',(done)=>{
        chai.request(server)
        .get(`/v1/doctor/case/isActiveCasePresent`)
        .end((err,res)=>{
            assert.equal(res.status,401)
            console.log(res.body);
            done()
        })
    })


    it('Get Case Details by caseId--successful',(done)=>{
        chai.request(server)
        .get(`/v1/doctor/case/64476ad8d735ba001f65fd5f`)
        .set({Authorization:`Bearer ${data.accessToken}`})
        .end((err,res)=>{
            assert.equal(res.status,200)
            assert.equal(res.body.id,"64476ad8d735ba001f65fd5f")
            console.log(res.body);
            done()
        })
    })

    it('Get Case Details by caseId--case doesnot exist error',(done)=>{
        chai.request(server)
        .get(`/v1/doctor/case/1234`)
        .set({Authorization:`Bearer ${data.accessToken}`})
        .end((err,res)=>{
            assert.equal(res.status,500)
            console.log(res.body);
            done()
        })
    })

    it('Get Case Details by caseId--unauthorized',(done)=>{
        chai.request(server)
        .get(`/v1/doctor/case/1234`)
        .end((err,res)=>{
            assert.equal(res.status,401)
            console.log(res.body);
            done()
        })
    })

    it('Get All Latest vitals for a case--successful',(done)=>{
        chai.request(server)
        .get(`/v1/doctor/case/64476ad8d735ba001f65fd5f/GetAllVitalLatestData`)
        .set({Authorization:`Bearer ${data.accessToken}`})
        .end((err,res)=>{
            assert.equal(res.status,200)
            console.log(res.body);
            done()
        })
    })

    it('Get All Latest vitals for a case--case doesnot exist error',(done)=>{
        chai.request(server)
        .get(`/v1/doctor/case/1234/GetAllVitalLatestData`)
        .set({Authorization:`Bearer ${data.accessToken}`})
        .end((err,res)=>{
            assert.equal(res.status,500)
            console.log(res.body);
            done()
        })
    })

    it('Get All Latest vitals for a case--unauthorized',(done)=>{
        chai.request(server)
        .get(`/v1/doctor/case/${data.id}/GetAllVitalLatestData`)
        .end((err,res)=>{
            assert.equal(res.status,401)
            console.log(res.body);
            done()
        })
    })

    it('Get vitals for a caseId.--successful',(done)=>{
        chai.request(server)
        .get(`/v1/doctor/case/64476ad8d735ba001f65fd5f/vitalDetails`)
        .set({Authorization:`Bearer ${data.accessToken}`})
        .end((err,res)=>{
            assert.equal(res.status,200)
            console.log(res.body);
            done()
        })
    })

    it('Get vitals for a caseId.--case doesnot exist error',(done)=>{
        chai.request(server)
        .get(`/v1/doctor/case/1234/vitalDetails`)
        .set({Authorization:`Bearer ${data.accessToken}`})
        .end((err,res)=>{
            assert.equal(res.status,500)
            console.log(res.body);
            done()
        })
    })

    it('Get vitals for a caseId.--unauthorized',(done)=>{
        chai.request(server)
        .get(`/v1/doctor/case/64476ad8d735ba001f65fd5f/vitalDetails`)
        .end((err,res)=>{
            assert.equal(res.status,401)
            console.log(res.body);
            done()
        })
    })

    it('Get Historical Data for a Case--successful',(done)=>{
        chai.request(server)
        .post(`/v1/doctor/case/64476ad8d735ba001f65fd5f/vitalSummary`)
        .set({Authorization:`Bearer ${data.accessToken}`})
        .send({
            from:"",
            to:""
        })
        .end((err,res)=>{
            assert.equal(res.status,200)
            console.log(res.body);
            done()
        })
    })

    it('Get Historical Data for a Case--case id doesnot exist error',(done)=>{
        chai.request(server)
        .post(`/v1/doctor/case/1234/vitalSummary`)
        .set({Authorization:`Bearer ${data.accessToken}`})
        .send({
            from:"",
            to:""
        })
        .end((err,res)=>{
            //assert.equal(res.status,500)
            console.log(res.body);
            done()
        })
    })

    it('Get Historical Data for a Case--unauthorized',(done)=>{
        chai.request(server)
        .post(`/v1/doctor/case/64476ad8d735ba001f65fd5f/vitalSummary`)
        .end((err,res)=>{
            assert.equal(res.status,401)
            console.log(res.body);
            done()
        })
    })

    it('Get List of ecg reports--successful',(done)=>{
        chai.request(server)
        .get(`/v1/doctor/case/64476ad8d735ba001f65fd5f/reports`)
        .query({
            page:"",
            perPage:""
        })
        .set({Authorization:`Bearer ${data.accessToken}`})
        .end((err,res)=>{
            assert.equal(res.status,200)
            console.log(res.body);
            done()
        })
    })

    it('Get List of ecg reports--case doenot exist error',(done)=>{
        chai.request(server)
        .get(`/v1/doctor/case/1234/reports`)
        .set({Authorization:`Bearer ${data.accessToken}`})
        .end((err,res)=>{
            assert.equal(res.status,500)
            console.log(res.body);
            done()
        })
    })

    it('Get List of ecg reports--unauthorized',(done)=>{
        chai.request(server)
        .get(`/v1/doctor/case/64476ad8d735ba001f65fd5f/reports`)
        .end((err,res)=>{
            assert.equal(res.status,401)
            console.log(res.body);
            done()
        })
    })

    it('Get case summary of live cases--successful',(done)=>{
        chai.request(server)
        .get(`/v1/doctor/case/customerCasesSummary/caseStage`)
        .query({
            condition:"",
            page:"",
            perPage:""
        })
        .set({Authorization:`Bearer ${data.accessToken}`,
        business:data.businessId})
        .end((err,res)=>{
            //assert.equal(res.status,200)
            console.log(res.body);
            done()
        })
    })

    it('Get case summary of live cases--missing business partner header',(done)=>{
        chai.request(server)
        .get(`/v1/doctor/case/customerCasesSummary/caseStage`)
        .set({Authorization:`Bearer ${data.accessToken}`})
        .end((err,res)=>{
            assert.equal(res.status,404)
            console.log(res.body);
            done()
        })
    })

    it('Get case summary of live cases--unauthorized',(done)=>{
        chai.request(server)
        .get(`/v1/doctor/case/customerCasesSummary/caseStage`)
        .end((err,res)=>{
            assert.equal(res.status,401)
            console.log(res.body);
            done()
        })
    })

    it('Getting patient cases under mentioned business-Id--successful',(done)=>{
        chai.request(server)
        .get(`/v1/doctor/case/customerCasesSummary/caseStage`)
        .set({Authorization:`Bearer ${data.accessToken}`,
        business:data.businessId})
        .end((err,res)=>{
            //assert.equal(res.status,200)
            console.log(res.body);
            done()
        })
    })  
    
    it('Getting patient cases under mentioned business-Id--missing business partner header',(done)=>{
        chai.request(server)
        .get(`/v1/doctor/case/customerCasesSummary/caseStage`)
        .set({Authorization:`Bearer ${data.accessToken}`})
        .end((err,res)=>{
            assert.equal(res.status,404)
            console.log(res.body);
            done()
        })
    }) 
    
    it('Getting patient cases under mentioned business-Id--unauthorized',(done)=>{
        chai.request(server)
        .get(`/v1/doctor/case/customerCasesSummary/caseStage`)
        .end((err,res)=>{
            assert.equal(res.status,401)
            console.log(res.body);
            done()
        })
    })
    
    it('Get Case Messages for All cases--successful',(done)=>{
        chai.request(server)
        .get(`/v1/doctor/case/messages/all`)
        .set({Authorization:`Bearer ${data.accessToken}`})
        .end((err,res)=>{
            //assert.equal(res.status,200)
            console.log(res.body);
            done()
        })
    })
    
    it('Get Case Messages for All cases--unauthorized',(done)=>{
        chai.request(server)
        .get(`/v1/doctor/case/messages/all`)
        .end((err,res)=>{
            assert.equal(res.status,401)
            console.log(res.body);
            done()
        })
    })

    it('Get Case Messages--successful',(done)=>{
        chai.request(server)
        .get(`/v1/doctor/case/64476ad8d735ba001f65fd5f/messages`)
        .set({Authorization:`Bearer ${data.accessToken}`})
        .end((err,res)=>{
            assert.equal(res.status,200)
            console.log(res.body);
            done()
        })
    })

    it('Get Case Messages--case id doestnot exist error',(done)=>{
        chai.request(server)
        .get(`/v1/doctor/case/1234/messages`)
        .set({Authorization:`Bearer ${data.accessToken}`})
        .end((err,res)=>{
            assert.equal(res.status,500)
            console.log(res.body);
            done()
        })
    })

    it('Get Case Messages--unauthorized',(done)=>{
        chai.request(server)
        .get(`/v1/doctor/case/1234/messages`)
        .end((err,res)=>{
            assert.equal(res.status,401)
            console.log(res.body);
            done()
        })
    })

    it('Get status of case devices battery status--successful',(done)=>{
        chai.request(server)
        .get(`/v1/doctor/case/64476ad8d735ba001f65fd5f/batteryStatus`)
        .set({Authorization:`Bearer ${data.accessToken}`})
        .end((err,res)=>{
            assert.equal(res.status,200)
            console.log(res.body);
            done()
        })
    })

    it('Get status of case devices battery status--caseid doesnot exist error',(done)=>{
        chai.request(server)
        .get(`/v1/doctor/case/1234/batteryStatus`)
        .set({Authorization:`Bearer ${data.accessToken}`})
        .end((err,res)=>{
            assert.equal(res.status,500)
            console.log(res.body);
            done()
        })
    })

    it('Get status of case devices battery status--unauthorized',(done)=>{
        chai.request(server)
        .get(`/v1/doctor/case/64476ad8d735ba001f65fd5f/batteryStatus`)
        .end((err,res)=>{
            assert.equal(res.status,401)
            console.log(res.body);
            done()
        })
    })

    it('Get Case Messages for All cases--successful',(done)=>{
        chai.request(server)
        .get(`/v1/doctor/case/messages`)
        .set({Authorization:`Bearer ${data.accessToken}`})
        .end((err,res)=>{
            //assert.equal(res.status,200)
            console.log(res.body);
            done()
        })
    })

    it('Get Case Messages for All cases--unauthorized',(done)=>{
        chai.request(server)
        .get(`/v1/doctor/case/messages`)
        .end((err,res)=>{
            assert.equal(res.status,401)
            console.log(res.body);
            done()
        })
    })

    it('Mark a Case Message as Read--successful',(done)=>{
        chai.request(server)
        .post(`/v1/doctor/case/64476ad8d735ba001f65fd5f/messages/markAsRead`)
        .send({
            caseMessageId:""
        })
        .set({Authorization:`Bearer ${data.accessToken}`})
        .end((err,res)=>{
            //assert.equal(res.status,200)
            console.log(res.body);
            done()
        })
    })

    it('Mark a Case Message as Read--case doesnot exist',(done)=>{
        chai.request(server)
        .post(`/v1/doctor/case/1234/messages/markAsRead`)
        .set({Authorization:`Bearer ${data.accessToken}`})
        .send({
            caseMessageId:""
        })
        .end((err,res)=>{
            assert.equal(res.status,500)
            console.log(res.body);
            done()
        })
    })

    it('Mark a Case Message as Read--unauthorized',(done)=>{
        chai.request(server)
        .post(`/v1/doctor/case/64476ad8d735ba001f65fd5f/messages/markAsRead`)
        .end((err,res)=>{
            assert.equal(res.status,401)
            console.log(res.body);
            done()
        })
    })

    it('Get liveStream With Pagination for Case--successful',(done)=>{
        chai.request(server)
        .post(`/v1/doctor/case/64476ad8d735ba001f65fd5f/liveStreamWithPagination`)
        .send({

        })
        .set({Authorization:`Bearer ${data.accessToken}`})
        .end((err,res)=>{
            //assert.equal(res.status,200)
            console.log(res.body);
            done()
        })
    })

    it('Get liveStream With Pagination for Case--case doesnot exist',(done)=>{
        chai.request(server)
        .post(`/v1/doctor/case/1234/liveStreamWithPagination`)
        .set({Authorization:`Bearer ${data.accessToken}`})
        .send({})
        .end((err,res)=>{
            assert.equal(res.status,500)
            console.log(res.body);
            done()
        })
    })

    it('Get liveStream With Pagination for Case--unauthorized',(done)=>{
        chai.request(server)
        .post(`/v1/doctor/case/64476ad8d735ba001f65fd5f/liveStreamWithPagination`)
        .set({Authorization:`Bearer ${data.accessToken}`})
        .end((err,res)=>{
            assert.equal(res.status,401)
            console.log(res.body);
            done()
        })
    })

    it('Get ecgEvents for Case--successful',(done)=>{
        chai.request(server)
        .get(`/v1/doctor/case/64476ad8d735ba001f65fd5f/ecgEvents`)
        .set({Authorization:`Bearer ${data.accessToken}`})
        .end((err,res)=>{
            assert.equal(res.status,200)
            console.log(res.body);
            done()
        })
    })

    it('Get ecgEvents for Case--case id doesnot exist error',(done)=>{
        chai.request(server)
        .get(`/v1/doctor/case/1234/ecgEvents`)
        .set({Authorization:`Bearer ${data.accessToken}`})
        .end((err,res)=>{
            assert.equal(res.status,500)
            console.log(res.body);
            done()
        })
    })

    it('Get ecgEvents for Case--unauthorized',(done)=>{
        chai.request(server)
        .get(`/v1/doctor/case/64476ad8d735ba001f65fd5f/ecgEvents`)
        .end((err,res)=>{
            assert.equal(res.status,401)
            console.log(res.body);
            done()
        })
    })

    it('Get Cardiologs summary for Case--successful',(done)=>{
        chai.request(server)
        .get(`/v1/doctor/case/64476ad8d735ba001f65fd5f/cardiologsSummary`)
        .set({Authorization:`Bearer ${data.accessToken}`})
        .end((err,res)=>{
            assert.equal(res.status,200)
            console.log(res.body);
            done()
        })
    })

    it('Get Cardiologs summary for Case--caseid doesnot exist',(done)=>{
        chai.request(server)
        .get(`/v1/doctor/case/1234/cardiologsSummary`)
        .set({Authorization:`Bearer ${data.accessToken}`})
        .end((err,res)=>{
            assert.equal(res.status,500)
            console.log(res.body);
            done()
        })
    })

    it('Get Cardiologs summary for Case--unauthorized',(done)=>{
        chai.request(server)
        .get(`/v1/doctor/case/64476ad8d735ba001f65fd5f/cardiologsSummary`)
        .end((err,res)=>{
            assert.equal(res.status,401)
            console.log(res.body);
            done()
        })
    })

    it('Get case events--successful',(done)=>{
        chai.request(server)
        .get(`/v1/doctor/case/64476ad8d735ba001f65fd5f/caseEvents`)
        .set({Authorization:`Bearer ${data.accessToken}`})
        .end((err,res)=>{
            assert.equal(res.status,200)
            console.log(res.body);
            done()
        })
    })

    it('Get case events--caseid doesnot exist',(done)=>{
        chai.request(server)
        .get(`/v1/doctor/case/1234/caseEvents`)
        .set({Authorization:`Bearer ${data.accessToken}`})
        .end((err,res)=>{
            assert.equal(res.status,500)
            console.log(res.body);
            done()
        })
    })

    it('Get case events--unauthorized',(done)=>{
        chai.request(server)
        .get(`/v1/doctor/case/1234/caseEvents`)
        .end((err,res)=>{
            assert.equal(res.status,401)
            console.log(res.body);
            done()
        })
    })
})
