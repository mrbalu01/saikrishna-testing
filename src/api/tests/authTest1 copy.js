// const mocha=require('mocha')
// const chai=require('chai')
// const chaitHttp=require('chai-http')
// const server=require('../../index')
// const assert=chai.assert
// chai.use(chaitHttp)

// let accessToken="lll";

//     const login= (done)=>{
//         console.log("11");
//         let data={
//             "mobile": {
//                 "countryCode":"91",
//                 "number":"9849808098"
//             }
//         }
//         chai.request(server)
//         .post("/v1/doctor/auth/login")
//         .send(data)
//         .end((err,res)=>{
//             console.log(res.body);
//             assert.equal(res.status,"200")
//             accessToken=res.body.accessToken
//             done()
//         })
//         console.log("22");
//     }
// login()
// module.exports=accessToken
