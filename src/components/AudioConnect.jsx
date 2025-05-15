import { useEffect, useState } from 'react';
import { Navigate, useNavigate } from "react-router-dom";
import socket from '../socket';
import { motion } from 'framer-motion';
import styles from "../styles/AudioConnect.module.css";
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
// async function textToSpeechBrowser(text, voiceId = 'JBFqnCBsd6RMkjVDRZzb') {      // eleven labs
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

async function textToSpeechBrowser(text, voice = 'alloy') {   //OPEN AI
    const API_KEY = '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';
    try {
        // OpenAI API endpoint for text-to-speech
        const response = await fetch('https://api.openai.com/v1/audio/speech', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${API_KEY}`
            },
            body: JSON.stringify({
                model: 'tts-1', // Free TTS model from OpenAI
                input: text,
                voice: voice, // Available voices: alloy, echo, fable, onyx, nova, shimmer
                response_format: 'mp3'
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
