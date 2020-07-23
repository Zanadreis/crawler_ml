'use strict'
var axios = require('axios')
var cheerio = require('cheerio')
const { response } = require('express')
var mongoose = require('mongoose'),
Logs = mongoose.model('Logs')


exports.listAllLogs = async function(req, res) {
    var logs = await Logs.find({});
    res.json(logs)
}

exports.fetchResult = async function(req, res, result){
    if(typeof result == 'function'){
        var result = []
    }
    var url = "https://lista.mercadolivre.com.br/" + req.body.search
    if(result.length != 0){
        var pagina = result.length + 1
        var url = "https://lista.mercadolivre.com.br/" + req.body.search + "/_Desde_" + pagina
    }
    await fetchData(url).then( (data) => {
        var html = data.data
        var $ = cheerio.load(html)
        var crawledInfo = $('.search-results > li')
        var forceSkip = false

        crawledInfo.each(function() {
            var temp = null
            var temp = {}
            var link = $(this).find('.item__info-link')
            temp.name = $(this).find('.main-title').text()
            temp.link = $(link).attr('href')
            temp.price = $(this).find('.item__price').text()
            temp.store = $(this).find('.item__brand-title-tos').text()
            temp.state = $(this).find('.item__condition').text()
            if(temp == {}){
                forceSkip = true
            }
            if (result.length < req.body.limit){
                result.push(temp)
            }
        })
        if(result.length != req.body.limit && !forceSkip){
            exports.fetchResult(req, res, result)
        }
        else{
            var new_log = new Logs(req.body)
            new_log.save()
            res.json(result)
        }
    })
}


async function fetchData(url){
    let response = await axios(url).catch((err) => console.log(err))

    if(response.status !== 200){
        console.log("Error occurred while fetching data")
        return
    }
    return response
}