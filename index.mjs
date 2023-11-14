import https from 'https';

const handler = async(event) => {

    let card_view_request = JSON.parse(event.body);

    // Prepare API headers
    let headers = {
        'x-api-key': process.env.MORPH_API_KEY,
        'x-api-secret': process.env.MORPH_API_SECRET,
        'Content-Type': 'application/json'
    }

    // Prepare the card view to be sent
    let body = JSON.stringify({
        "card_view": {
            "cards": [
                {
                    "title": "My First Node.js Card 🐣",
                    "contents": [
                        {
                            "type": "text",
                            "label": "Environment",
                            "value": "AWS Lambda"
                        },
                        {
                            "type": "text",
                            "label": "Language",
                            "value": "Node.js"
                        },
                        {
                            "type": "status",
                            "label": "System",
                            "value": "Operational",
                            "color": "SUCCESS"
                        }
                    ],
                    "actions": [
                        {
                            "type": "OPEN_URL_IN_IFRAME",
                            "label": "Open Morph in iFrame",
                            "url": "https://runmorph.dev/"
                        }
                    ]
                }
            ]
        }
    });

    let options = {
        hostname: 'api.runmorph.dev',
        port: 443,
        path: `/v0/requests/${card_view_request.id}/response`,
        method: 'POST',
        headers: headers
    };

    // Return new promise
    return new Promise(function(resolve, reject) {
        // Do async job
        let req = https.request(options, function(res) {
            res.setEncoding('utf8');
            res.on('data', (chunk) => {

                // Check if the HTTP status code indicates an error
                if (res.statusCode >= 200 && res.statusCode < 300) {
                    resolve({
                        'statusCode': res.statusCode,
                        'body': 'Card created',
                    });
                } else {
                    resolve({
                        'statusCode': res.statusCode,
                        'body': 'Error from Morph endpoint',
                    });
                }
            });
        })

        req.on('error', (e) => {
            reject({
                'statusCode': 500,
                'body': `Problem with request: ${e.message}`,
            });
        });

        // Write data to request body
        req.write(body);
        req.end();
    });
}

export { handler };
