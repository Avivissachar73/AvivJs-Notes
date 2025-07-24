export default {
    "mainSite": {
        "_id": "main-site-id",
        "width": 1250,
        "height": 1000,
        "things": [],
        "passages": [
            {
                "_id": "top_road",
                "style": { "fillStyle": "blue" },
                "geoShape": [
                    {
                        "x": 0,
                        "y": 150
                    },
                    {
                        "x": 1250,
                        "y": 150
                    },
                    {
                        "x": 1250,
                        "y": 200
                    },
                    {
                        "x": 0,
                        "y": 200
                    },
                    {
                        "x": 0,
                        "y": 150
                    }
                ]
            },
            {
                "_id": "left_road",
                "style": { "fillStyle": "blue" },
                "geoShape": [
                    {
                        "x": 0,
                        "y": 0
                    },
                    {
                        "x": 0,
                        "y": 1000
                    },
                    {
                        "x": 50,
                        "y": 1000
                    },
                    {
                        "x": 50,
                        "y": 0
                    },
                    {
                        "x": 0,
                        "y": 0
                    }
                ],
            },
            {
                "_id": "bottom_road",
                "style": { "fillStyle": "blue" },
                "geoShape": [
                    {
                        "x": 0,
                        "y": 650
                    },
                    {
                        "x": 1250,
                        "y": 650
                    },
                    {
                        "x": 1250,
                        "y": 700
                    },
                    {
                        "x": 0,
                        "y": 700
                    },
                    {
                        "x": 0,
                        "y": 650
                    }
                ],
            },
            {
                "_id": "right_road",
                "style": { "fillStyle": "blue" },
                "geoShape": [
                    {
                        "x": 500,
                        "y": 200
                    },
                    {
                        "x": 500,
                        "y": 700
                    },
                    {
                        "x": 550,
                        "y": 700
                    },
                    {
                        "x": 550,
                        "y": 200
                    },
                    {
                        "x": 500,
                        "y": 200
                    }
                ]
            },
            {
                "_id": "diagonal_road",
                "style": { "fillStyle": "blue" },
                "geoShape": [
                    {
                        "x": 625,
                        "y": 175
                    },
                    {
                        "x": 675,
                        "y": 175
                    },
                    {
                        "x": 50,
                        "y": 375
                    },
                    {
                        "x": 0,
                        "y": 375
                    },
                    {
                        "x": 625,
                        "y": 175
                    }
                ]
            }

        ],
        "polygons": [
            {
                "_id": "green3",
                "x": 900,
                "y": 850,
                "w": 200,
                "h": 100,
                "style": {
                    "fillStyle": "green",

                }
                // rotate: 45
            },
            {
                "_id": "green1",
                "x": 525,
                "y": 850,
                "w": 100,
                "h": 100,
                rotate: 45,
                // isCenterPos: true,
                "style": {
                    "fillStyle": "red",
                }
            },
            {
                "_id": "green2",
                "x": 675,
                "y": 850,
                "w": 100,
                "h": 100,
                "style": {
                    "fillStyle": "green"
                }
            },
            {
                "_id": "right_red",
                "x": 1130,
                "y": 540,
                "w": 175,
                "h": 50,
                "rotate": 45,
                // "rotate": 60,
                zIndex: 1,
                "style": {
                    "fillStyle": "red"
                },
                // isCenterPos: true
            },
            {
                "_id": "yellow",
                "x": 200,
                "y": 450,
                "w": 100,
                "h": 50,
                "rotate": 90,
                "style": {
                    "fillStyle": "yellow"
                }
            },
            {
                "_id": "top_blue",
                "style": {
                    "fillStyle": "blue"
                },
                "x": 600,
                "y": 50,
                "w": 600,
                "h": 100,
                "rotate": 0,
                "isCenterPos": true,
            },
            {
                "_id": "green4",
                "x": 1150,
                "y": 900,
                "w": 200,
                "h": 200,
                "style": {
                    "fillStyle": "green",
                },
                // "hide": true
            },
            {
                "_id": "right_black",
                "x": 1350,
                "y": 425,
                "w": 325,
                "h": 325,
                "rotate": 45,
                "style": {
                    "fillStyle": "black"
                },
                "isCenterPos": true,
            },
            {
                "_id": "middle_black",
                "style": {
                    "fillStyle": "black"
                },
                "geoShape": [
                    {
                        "x": 650,
                        "y": 350
                    },
                    {
                        "x": 800,
                        "y": 350
                    },
                    {
                        "x": 850,
                        "y": 450
                    },
                    {
                        "x": 800,
                        "y": 550
                    },
                    {
                        "x": 650,
                        "y": 550
                    },
                    {
                        "x": 600,
                        "y": 450
                    },
                    {
                        "x": 650,
                        "y": 350
                    }
                ],
            },
            {
                "_id": "middle_red",
                "x": 625,
                "y": 500,
                "circleDegries": 360,
                // "circleDegries": [0, 90],
                // closeCircle: true,
                // rotate: 90,
                w: 10,
                h: 10,
                "style": {
                    "fillStyle": "red"
                },
                // "isCenterPos": true,
            },
            { zIndex: 10, x: 900, y: 450, w: 200, h: 100, rotate: 45, style: { fillStyle: 'rgb(42,119,137)', strokeStyle: 'white', lineWidth: 3 } }, // '#D8D8D8'
            { zIndex: 10, x: 900, y: 450, w: 200, h: 100, rotate: 45, grid: { x: { space: 10, rotate: 45, style: { strokeStyle: 'white', lineWidth: 3 } } } } // '#D8D8D8'
            // [
            // ]
        ]
    },
    "shapedSite": {
        "w": 800,
        "h": 500,
        "things": [],
        "passages": [
            [
                {
                    "x": 200,
                    "y": 0
                },
                {
                    "x": 650,
                    "y": 0
                },
                {
                    "x": 675,
                    "y": 13
                },
                {
                    "x": 675,
                    "y": 50
                },
                {
                    "x": 175,
                    "y": 50
                },
                {
                    "x": 175,
                    "y": 8.5
                },
                {
                    "x": 200,
                    "y": 0
                }
            ],
            [
                {
                    "x": 625,
                    "y": 50
                },
                {
                    "x": 625,
                    "y": 450
                },
                {
                    "x": 675,
                    "y": 450
                },
                {
                    "x": 675,
                    "y": 50
                },
                {
                    "x": 625,
                    "y": 50
                }
            ],
            [
                {
                    "x": 175,
                    "y": 50
                },
                {
                    "x": 175,
                    "y": 450
                },
                {
                    "x": 225,
                    "y": 450
                },
                {
                    "x": 225,
                    "y": 50
                },
                {
                    "x": 175,
                    "y": 50
                }
            ],
            [
                {
                    "x": 175,
                    "y": 450
                },
                {
                    "x": 675,
                    "y": 450
                },
                {
                    "x": 675,
                    "y": 480
                },
                {
                    "x": 650,
                    "y": 500
                },
                {
                    "x": 200,
                    "y": 500
                },
                {
                    "x": 175,
                    "y": 487
                },
                {
                    "x": 175,
                    "y": 450
                }
            ],
            [
                {
                    "x": 13,
                    "y": 125
                },
                {
                    "x": 200,
                    "y": 125
                },
                {
                    "x": 200,
                    "y": 175
                },
                {
                    "x": 0,
                    "y": 175
                },
                {
                    "x": 0,
                    "y": 150
                },
                {
                    "x": 13,
                    "y": 125
                }
            ],
            [
                {
                    "x": 625,
                    "y": 350
                },
                {
                    "x": 787.5,
                    "y": 350
                },
                {
                    "x": 775,
                    "y": 400
                },
                {
                    "x": 625,
                    "y": 400
                },
                {
                    "x": 625,
                    "y": 350
                }
            ]
        ],
        "polygons": [],
        "mainSiteShape": [
            {
                "x": 200,
                "y": 0
            },
            {
                "x": 650,
                "y": 0
            },
            {
                "x": 750,
                "y": 50
            },
            {
                "x": 800,
                "y": 150
            },
            {
                "x": 800,
                "y": 300
            },
            {
                "x": 775,
                "y": 400
            },
            {
                "x": 650,
                "y": 500
            },
            {
                "x": 200,
                "y": 500
            },
            {
                "x": 100,
                "y": 450
            },
            {
                "x": 0,
                "y": 250
            },
            {
                "x": 0,
                "y": 150
            },
            {
                "x": 50,
                "y": 50
            },
            {
                "x": 200,
                "y": 0
            }
        ]
    }
}