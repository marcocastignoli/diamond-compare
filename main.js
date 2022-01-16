import { diff } from 'json-diff';

const diamond0 = {
    "diamond": {
        "test1Func1": "Test1Facet",
        "test3Func1": "Test1Facet"
    },
    "contracts": {
        "Test1Facet": {
            "name": "Test1Facet",
            "type": "remote",
            "address": "0x12301230912309..."
        },
        "Test3Facet": {
            "name": "Test3Facet",
            "type": "remote",
            "address": "0x12301230912309..."
        },
    }
}

const diamond1 = {
    "diamond": {
        "test1Func1": "Test3Facet",
        "test2Func1": "Test2Facet"
    },
    "contracts": {
        "Test1Facet": {
            "name": "Test1Facet",
            "type": "remote",
            "address": "0x12301230912309..."
        },
        "Test3Facet": {
            "name": "Test3Facet",
            "type": "local",
            "path": "facets/Test3Facet.sol"
        },
        "Test2Facet": {
            "name": "Test2Facet",
            "type": "local",
            "path": "facets/Test2Facet.sol"
        },
    }
}

const d = diff(diamond0, diamond1)

//console.log(d);

function getFunctionsFacetsToAdd(d) {

    let functionsToAdd = Object.keys(d.diamond).filter(fn => {
        return fn.endsWith('__added')
    })
    
    let functionsFacetsToAdd = functionsToAdd.map(fn => {
        let obj = {}
        obj[`${fn.substring(0, fn.length - '__added'.length)}`] = d.diamond[fn]
        return obj
    })
    
    return functionsFacetsToAdd
}

function getFunctionsFacetsToRemove(d) {

    let functionsToAdd = Object.keys(d.diamond).filter(fn => {
        return fn.endsWith('__deleted')
    })
    
    let functionsFacetsToAdd = functionsToAdd.map(fn => {
        let obj = {}
        obj[`${fn.substring(0, fn.length - '__deleted'.length)}`] = d.diamond[fn]
        return obj
    })
    
    return functionsFacetsToAdd
}

function getFunctionFacetsToReplace(d) {
    let functionsToReplace = Object.keys(d.diamond).filter(fn => {
        const facet = d.diamond[fn]
        return typeof facet === 'object'
    })

    let functionsFacetsToReplace = functionsToReplace.map(fn => {
        let obj = {}
        obj[fn] = d.diamond[fn].__new
        return obj
    })
    
    return functionsFacetsToReplace
}

function getContractsToReplace(d) {

    let contractsToReplace = Object.keys(d.contracts).filter(fn => {
        return d.contracts[fn].hasOwnProperty('address__deleted') && d.contracts[fn].hasOwnProperty('path__added')
    })
    
    let contractsInfoToReplace = contractsToReplace.map(fn => {
        let obj = {}
        obj[fn] = {
            name: fn,
            type: 'local',
            path: d.contracts[fn].path__added
        }
        return obj
    })
    
    return contractsInfoToReplace
}

function getContractsToDeploy(d) {

    let contractsToDeploy = Object.keys(d.contracts).filter(fn => {
        return fn.endsWith('__added') && d.contracts[fn].type === 'local'
    })
    
    let contractsInfoToDeploy = contractsToDeploy.map(fn => {
        let obj = {}
        obj[`${fn.substring(0, fn.length - '__added'.length)}`] = d.contracts[fn]
        return obj
    })
    
    return contractsInfoToDeploy.concat(getContractsToReplace(d))
}


console.log('\nDiamonds:')
console.log('\tAdd: ', getFunctionsFacetsToAdd(d))
console.log('\tRemove: ', getFunctionsFacetsToRemove(d))
console.log('\tReplace: ', getFunctionFacetsToReplace(d))
console.log('\nContracts to deploy:')
console.log(getContractsToDeploy(d))