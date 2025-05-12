import { useEffect } from 'react';
import socket from '../socket';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
async function textToSpeechBrowser(text, voiceId = 'JBFqnCBsd6RMkjVDRZzb') {
    const API_KEY = import.meta.env.VITE_ELEVENLABS_API_KEY;
    try {
        // ElevenLabs API endpoint for text-to-speech
        const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
            method: 'POST',
            headers: {
                'Accept': 'audio/mpeg',
                'Content-Type': 'application/json',
                'xi-api-key': API_KEY
            },
            body: JSON.stringify({
                text: text,
                model_id: 'eleven_multilingual_v2',
                voice_settings: {
                    stability: 0.5,
                    similarity_boost: 0.5
                }
            })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        // Get the audio blob
        const audioBlob = await response.blob();

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
        console.error('Error converting text to speech:', error);
        throw error;
    }
}

export default function AudioConnect() {

    const token = localStorage.getItem('token');
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

    useEffect(() => {
        if (listening === false) {
            console.log('Speech recognition stopped with transcript:', transcript);
            handleSendMessage();
        }
    }, [listening]);

    if (!browserSupportsSpeechRecognition) {
        return <span>Browser doesn't support speech recognition.</span>;
    }
    const startListening = () => SpeechRecognition.startListening({
        continuous: false,
        language: 'en-US',
        interimResults: false
    });

    // RECEVING MESSAGES
    useEffect(() => {
        if (!socket) return;

        socket.on('sora_says', ({ reply }) => {
            if (reply.length > 0) {
                console.log(reply);
                textToSpeechBrowser(reply);
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
            socket.emit('sora', { transcript });
            resetTranscript;
        }
    };

    return (
        <div>
            <p>Microphone: {listening ? 'on' : 'off'}</p>
            <button onClick={startListening}>Start</button>
            <button onClick={SpeechRecognition.stopListening}>Stop</button>
            <button onClick={resetTranscript}>Reset</button>
            <p>{transcript}</p>
        </div>
    );

}
