# Diamond compare
Compares diamonds files

## How it works

Given a file and it's previous version:

### Before
```json
{
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
```

### After
```json
{
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
```

It tells you which diamond's functions to update, remove, replace and which contracts to deply

```bash
$ node main.js

Diamonds:
        Add:  [ { test2Func1: 'Test2Facet' } ]
        Remove:  [ { test3Func1: 'Test1Facet' } ]
        Replace:  [ { test1Func1: 'Test3Facet' } ]

Contracts to deploy:
[
  {
    Test2Facet: {
      name: 'Test2Facet',
      type: 'local',
      path: 'facets/Test2Facet.sol'
    }
  },
  {
    Test3Facet: {
      name: 'Test3Facet',
      type: 'local',
      path: 'facets/Test3Facet.sol'
    }
  }
]
```

## Install
```bash
yarn install
```

## Running
```bash
node main.js
```
