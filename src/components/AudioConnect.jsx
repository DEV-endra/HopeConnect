import { useEffect, useState } from 'react';
import { Navigate, useNavigate } from "react-router-dom";
import socket from '../socket';
import { motion } from 'framer-motion';
import styles from "../styles/AudioConnect.module.css";
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
// async function textToSpeechBrowser(text, voiceId = 'JBFqnCBsd6RMkjVDRZzb') {
//     const API_KEY = import.meta.env.VITE_ELEVENLABS_API_KEY;
//     try {
//         // ElevenLabs API endpoint for text-to-speech
//         const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
//             method: 'POST',
//             headers: {
//                 'Accept': 'audio/mpeg',
//                 'Content-Type': 'application/json',
//                 'xi-api-key': API_KEY
//             },
//             body: JSON.stringify({
//                 text: text,
//                 model_id: 'eleven_multilingual_v2',
//                 voice_settings: {
//                     stability: 0.5, 
//                     similarity_boost: 0.5
//                 }
//             })
//         });

//         if (!response.ok) {
//             throw new Error(`HTTP error! status: ${response.status}`);
//         }

//         // Get the audio blob
//         const audioBlob = await response.blob();

//         // Create an audio context
//         const audioContext = new (window.AudioContext || window.webkitAudioContext)();

//         // Convert blob to array buffer
//         const arrayBuffer = await audioBlob.arrayBuffer();

//         // Decode the audio data
//         const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

//         // Create a source buffer
//         const source = audioContext.createBufferSource();
//         source.buffer = audioBuffer;

//         // Connect to the audio output
//         source.connect(audioContext.destination);

//         // Play the audio
//         source.start(0);

//         return source;
//     } catch (error) {
//         console.error('Error converting text to speech:', error);
//         throw error;
//     }
// }

async function textToSpeechBrowser(text, voiceId = 'Ruth') {
    const AWS_REGION = import.meta.env.VITE_AWS_REGION || 'us-east-1';
    const AWS_ACCESS_KEY = import.meta.env.VITE_AWS_ACCESS_KEY;
    const AWS_SECRET_KEY = import.meta.env.VITE_AWS_SECRET_KEY;

    try {
        // Amazon Polly uses the /v1/speech endpoint for real-time synthesis
        // For larger text, the /v1/synthesiztask async API would be better

        // Create AWS Polly parameters
        const params = {
            OutputFormat: 'mp3',
            Text: text,
            VoiceId: voiceId,
            Engine: 'neural', // or 'standard' for non-neural voices
            TextType: 'text'  // 'text' or 'ssml'
        };

        // Use AWS SDK Polly client if available
        if (typeof AWS !== 'undefined' && AWS.Polly) {
            // AWS SDK approach
            AWS.config.update({
                region: AWS_REGION,
                accessKeyId: AWS_ACCESS_KEY,
                secretAccessKey: AWS_SECRET_KEY
            });

            const polly = new AWS.Polly();
            const synthesizeResponse = await polly.synthesizeSpeech(params).promise();

            // Convert audio data to a buffer for audio playback
            const audioBuffer = synthesizeResponse.AudioStream.buffer;
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const decodedData = await audioContext.decodeAudioData(audioBuffer);

            // Create audio source
            const source = audioContext.createBufferSource();
            source.buffer = decodedData;
            source.connect(audioContext.destination);
            source.start(0);

            return source;
        }

        // Manual approach using fetch and signature v4
        // Create authorization headers for AWS Signature Version 4
        const service = 'polly';
        const host = `${service}.${AWS_REGION}.amazonaws.com`;
        const endpoint = `https://${host}/v1/speech`;
        const date = new Date();
        const amzDate = date.toISOString().replace(/[:\-]|\.\d{3}/g, '');
        const dateStamp = amzDate.substring(0, 8);

        // Create canonical request
        const method = 'POST';
        const canonicalUri = '/v1/speech';
        const canonicalQueryString = '';
        const canonicalHeaders =
            'content-type:application/json\n' +
            'host:' + host + '\n' +
            'x-amz-date:' + amzDate + '\n';
        const signedHeaders = 'content-type;host;x-amz-date';
        const payloadHash = await sha256(JSON.stringify(params));
        const canonicalRequest = method + '\n' +
            canonicalUri + '\n' +
            canonicalQueryString + '\n' +
            canonicalHeaders + '\n' +
            signedHeaders + '\n' +
            payloadHash;

        // Create string to sign
        const algorithm = 'AWS4-HMAC-SHA256';
        const credentialScope = dateStamp + '/' + AWS_REGION + '/' + service + '/aws4_request';
        const stringToSign = algorithm + '\n' +
            amzDate + '\n' +
            credentialScope + '\n' +
            await sha256(canonicalRequest);

        // Calculate signature
        const signingKey = await getSignatureKey(AWS_SECRET_KEY, dateStamp, AWS_REGION, service);
        const signature = await hmacSha256(signingKey, stringToSign, 'hex');

        // Create authorization header
        const authorizationHeader = algorithm + ' ' +
            'Credential=' + AWS_ACCESS_KEY + '/' + credentialScope + ', ' +
            'SignedHeaders=' + signedHeaders + ', ' +
            'Signature=' + signature;

        // Make the API request
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Amz-Date': amzDate,
                'Authorization': authorizationHeader
            },
            body: JSON.stringify(params)
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Polly API error (${response.status}): ${errorText}`);
        }

        // Get the audio blob and process audio
        const audioBlob = await response.blob();

        // Check if we have a valid audio blob
        if (audioBlob.size === 0) {
            throw new Error('Received empty audio response from Polly');
        }

        // Create an audio context
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();

        // Convert blob to array buffer
        const arrayBuffer = await audioBlob.arrayBuffer();

        // Decode the audio data
        const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

        // Create a source buffer
        const source = audioContext.createBufferSource();
        source.buffer = audioBuffer;

        // Connect to the audio output
        source.connect(audioContext.destination);

        // Play the audio
        source.start(0);

        return source;
    } catch (error) {
        console.error('Error converting text to speech with Amazon Polly:', error);
        throw error;
    }
}

// Helper function for creating SHA-256 hash
async function sha256(message) {
    // Use the Web Crypto API
    const msgBuffer = new TextEncoder().encode(message);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);

    // Convert to hex string
    return Array.from(new Uint8Array(hashBuffer))
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');
}

// Helper function for creating HMAC-SHA256
async function hmacSha256(key, message, format = '') {
    let keyData;

    // Make sure we have the right format for the key
    if (key instanceof Uint8Array) {
        keyData = key;
    } else {
        keyData = new TextEncoder().encode(key);
    }

    // Import the key for HMAC usage
    const cryptoKey = await crypto.subtle.importKey(
        'raw',
        keyData,
        { name: 'HMAC', hash: { name: 'SHA-256' } },
        false,
        ['sign']
    );

    // Sign the message
    const messageData = new TextEncoder().encode(message);
    const signature = await crypto.subtle.sign(
        'HMAC',
        cryptoKey,
        messageData
    );

    // Return appropriate format
    if (format === 'hex') {
        return Array.from(new Uint8Array(signature))
            .map(b => b.toString(16).padStart(2, '0'))
            .join('');
    }

    return new Uint8Array(signature);
}

// Helper function for AWS Signature Version 4
async function getSignatureKey(key, dateStamp, region, service) {
    // This is AWS's standard key derivation algorithm for Signature V4
    const kDate = await hmacSha256('AWS4' + key, dateStamp);
    const kRegion = await hmacSha256(kDate, region);
    const kService = await hmacSha256(kRegion, service);
    const kSigning = await hmacSha256(kService, 'aws4_request');
    return kSigning;
}

// Utility function to check if AWS SDK is available and properly loaded
function isAWSSDKAvailable() {
    return typeof AWS !== 'undefined' &&
        typeof AWS.Polly === 'function' &&
        typeof AWS.config === 'object';
}

export default function AudioConnect() {

    const role = localStorage.getItem('role');
    const token = localStorage.getItem('token');
    const [isActive, setIsActive] = useState(false);
    const [response, setResponse] = useState('');
    const [input, setInput] = useState('');
    const navigate = useNavigate();
    // ACTIVATING USER BY SENDING TOKEN
    useEffect(() => {
        if (!socket) return;

        if (token) {
            socket.emit("token", token);
            //  console.log("token emitted to server:", token);
        }
    }, [token]);

    const {
        transcript,
        listening,
        resetTranscript,
        browserSupportsSpeechRecognition
    } = useSpeechRecognition();

    useEffect(() => {   // FOR CHECKING WHEN TO SEND INPUT TO THE GEMINI
        if (listening === false) {
            setIsActive(false);
            console.log('Speech recognition stopped with transcript:', transcript);
            handleSendMessage();
        }
    }, [listening]);

    if (!browserSupportsSpeechRecognition) {
        return <span>Browser doesn't support speech recognition.</span>;
    }

    // RECEVING MESSAGES
    useEffect(() => {
        if (!socket) return;

        socket.on('sora_says', ({ reply }) => {
            if (reply.length > 0) {
                textToSpeechBrowser(reply);
                console.log(reply);
                setResponse(reply);
            }
        });
        // Cleanup to avoid duplicate listeners on re-renders
        return () => {
            socket.off('sora_says');
        };
    }, [socket]);

    //SENDING
    const handleSendMessage = () => {
        console.log(transcript);
        if (transcript.length > 0) {
            setInput(transcript);
            socket.emit('sora', { transcript });
            resetTranscript();
        }
    };

    const toggleVoiceChat = () => {

        const newActiveState = !isActive;
        setIsActive(newActiveState);
        if (newActiveState) {
            console.log("Starting voice recording...");
            SpeechRecognition.startListening({
                continuous: false,
                language: 'en-US',
                interimResults: false
            });
        } else {
            SpeechRecognition.stopListening();
            console.log("Stopping voice recording...");
        }
    }

    const onBack = () => {

        if (role === 'helpee')
            navigate('/HelpeeDashboard');
        else
            navigate('/HelperDashboard');
    };

    return (

        // back button
        <div className={styles.container}>
            <div className={styles.header}>
                <button className={styles.backButton} onClick={onBack} aria-label="Go back to home">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="#00C9A7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-arrow-left" viewBox="0 0 24 24">
                        <line x1="19" y1="12" x2="5" y2="12" />
                        <polyline points="12 19 5 12 12 5" />
                    </svg>
                </button>
                <div className={styles.headerTitle}>HopeConnect</div>
            </div>

            {/* // response and input  */}
            <div className={styles.chatArea}>
                <p className={`${styles.message} ${styles.userMessage}`}>{input}</p>
                <p className={`${styles.message} ${styles.aiMessage}`}>{response}</p>
            </div>

            <div className={styles.controls}>
                <motion.button
                    className={styles.voiceButton}
                    whileTap={{ scale: 0.95 }}
                    onClick={toggleVoiceChat}
                    animate={{
                        boxShadow: isActive ? '0 0 15px rgba(0, 201, 167, 0.6)' : 'none',
                        backgroundColor: isActive ? '#00C9A7' : '#fff',
                        color: isActive ? '#fff' : '#00C9A7'
                    }}
                    transition={{ duration: 0.3 }}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z" />
                        <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z" />
                    </svg>
                </motion.button>
                <div className={styles.statusText}>
                    {isActive ? "Listening..." : "Tap to speak"}
                </div>
            </div>
        </div>
    );

}
