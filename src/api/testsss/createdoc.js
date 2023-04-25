const mocha=require('mocha')
const chai=require('chai')
const chaitHttp=require('chai-http')
const server=require('../../index')
const { log } = require('@grpc/grpc-js/build/src/logging')
const assert=chai.assert
chai.use(chaitHttp)
let num=5
let accessToken=""

describe("",()=>{
    console.log("desc 1");
    before(()=>{
        console.log("before 1");
    })
    describe("",()=>{
        console.log("desc 2");
        before(()=>{
            console.log("before 2");
        })
        it("",()=>{
            console.log("it 1");
        })
    })


})