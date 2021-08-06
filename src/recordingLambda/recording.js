const { "v4": uuidv4 } = require('uuid');
var AWS = require('aws-sdk');
const chime = new AWS.Chime({ region: 'us-east-1' });
chime.endpoint = new AWS.Endpoint('https://service.chime.aws.amazon.com/console');
const region = 'us-east-1'

const mediaCaptureBucket = process.env['MEDIA_CAPTURE_BUCKET']
const aws_account_id = process.env['ACCOUNT_ID']

exports.handler = async (event, context) => {
    const body = JSON.parse(event.body)
    console.log(body)
    const setRecording = body.setRecording

    if (setRecording) {
        const deleteRequest = {
            "MediaPipelineId": body.mediaPipeLine
        }
        const deleteInfo = await chime.deleteMediaCapturePipeline(deleteRequest).promise()
        console.log(deleteInfo)
        const response = {
            statusCode: 200,
            body: JSON.stringify(deleteInfo),
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Content-Type': 'application/json'
            }
        }
        return response
    } else {
        const meetingId = body.meetingId
        const organizationId = body.organizationId
        const eventId = body.eventId
        const roomId = body.roomId
        const captureRequest = {
            "SourceType": "ChimeSdkMeeting",
            "SourceArn": "arn:aws:chime::" + aws_account_id + ":meeting:" + meetingId,
            "SinkType": "S3Bucket",
            "SinkArn": "arn:aws:s3:::" + mediaCaptureBucket + "/captures/" + organizationId + "/" + eventId + "/" + roomId + "/" + meetingId,
        }
        try {
            const captureInfo = await chime.createMediaCapturePipeline(captureRequest).promise()
            console.log(captureInfo)
            const response = {
                statusCode: 200,
                body: JSON.stringify(captureInfo),
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Headers': '*',
                    'Access-Control-Allow-Methods': 'POST, OPTIONS',
                    'Content-Type': 'application/json'
                }
            }
            return response
        } catch (err) {
            console.log(err)
            return err
        }
    }
}


