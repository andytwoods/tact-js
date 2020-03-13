/* eslint-disable indent */
import Tacsocket from './Tacsocket';
import EventEmitter from './EventEmitter';

export default class hapticPlayer extends EventEmitter {
    constructor() {
        super();
        this.socket = new Tacsocket();
        this.message = {};

        this.socket.on('change', (message) => {
            this.message = message;
            this.emit('change', this.message);
        });
    }

    turnOff(position) {
        const request = {
            Submit: [{
                Type: 'turnOff',
                Key: position,
            }],
        };
        this.socket.send(JSON.stringify(request));
    }

    turnOffAll() {
        const request = {
            Submit: [{
                Type: 'turnOffAll',
            }],
        };
        this.socket.send(JSON.stringify(request));
    }

    submitDot(key, pos, dotPoints, durationMillis) {
        const request = {
            Submit: [{
                Type: 'frame',
                Key: key,
                Frame: {
                    Position: pos,
                    PathPoints: [],
                    DotPoints: dotPoints,
                    DurationMillis: durationMillis,
                },
            }],
        };
        this.socket.send(JSON.stringify(request, (k, val) =>
            val.toFixed ? Number(val.toFixed(3)) : val
        ));
    }

    submitPath(key, pos, pathPoints, durationMillis) {
        const request = {
            Submit: [{
                Type: 'frame',
                Key: key,
                Frame: {
                    Position: pos,
                    PathPoints: pathPoints,
                    DotPoints: [],
                    DurationMillis: durationMillis,
                },
            }],
        };
        this.socket.send(JSON.stringify(request, (k, val) =>
            val.toFixed ? Number(val.toFixed(3)) : val
        ));
    }

    register(key, fileDirectory) {
        var loader = new FileLoader();
        loader.load(fileDirectory, function (text) {

            const json_data = JSON.parse(text);
            const project = json_data["project"];
            const request = {
                "Register": [{
                    "Key": key,
                    "Project": {
                        "Tracks": project["tracks"],
                        "Layout": project["layout"]
                    }
                }]
            };
            const json_str = JSON.stringify(request);
            this.socket.send(json_str);

        },);
    }

    submitRegistered(key) {
        const submit = {
            "Submit": [{
                "Type": "key",
                "Key": key,
            }]
        };
        this.socket.send(JSON.stringify(submit));


    }


}
