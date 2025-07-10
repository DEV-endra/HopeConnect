import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../styles/philosophy.module.css';
import { MessageSquarePlus, House, Send, UserRound, Search } from 'lucide-react';
import bg from "../assets/bg.png"
import { v4 as uuidv4 } from 'uuid';
import Box from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress';

export default function philosophy() {
    const [progress, setProgress] = useState(0);
    const [buffer, setBuffer] = useState(10);
    const query = useRef(null);
    const [submitted, setSubmitted] = useState(false);
    const [searchChat, setSearchChat] = useState('');
    const [messages, setmessages] = useState([]);
    const [isSearchExpanded, setIsSearchExpanded] = useState(false);
    const chatContentRef = useRef(null);
    const token = localStorage.getItem("token");
    const current_user = localStorage.getItem("username");
    const messagesEndRef = useRef(null)
    const navigate = useNavigate();
    const role = localStorage.getItem('role');


    // for loading symbol
    const progressRef = useRef(() => { });
    useEffect(() => {
        progressRef.current = () => {
            if (progress === 100) {
                setProgress(0);
                setBuffer(10);
            } else {
                setProgress(progress + 1);
                if (buffer < 100 && progress % 5 === 0) {
                    const newBuffer = buffer + 1 + Math.random() * 10;
                    setBuffer(newBuffer > 100 ? 100 : newBuffer);
                }
            }
        };
    });

    useEffect(() => {
        const timer = setInterval(() => {
            progressRef.current();
        }, 100);

        return () => {
            clearInterval(timer);
        };
    }, []);


    // for back button
    const onBack = () => {

        if (role === 'helpee')
            navigate('/HelpeeDashboard');
        else
            navigate('/HelperDashboard');
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }

    useEffect(() => {
        scrollToBottom()
    }, [messages]);

    useEffect(() => {
        async function fun() {
            try {
                const response = await fetch("/https://hopeconnect-backend.onrender.com//users/history", {
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "application/json"
                    },
                });
                const res = await response.json();
                console.log(res);
                setmessages(res);
            } catch (error) {
                console.error("Error:", error);
            }
        }
        fun();
    }, [])


    const handleQuery = () => {
        const querr = query.current.value;
        setmessages(messages => [...messages, {
            id: uuidv4(),
            username: current_user,
            text: querr,
            time: new Date().toISOString(),
        }]);
        query.current.value = '';

        // Add temporary loading message
        const loadingId = uuidv4();
        const loadingMessage = {
            id: loadingId,
            username: "system",
            text: "!@#$%^&*",
            time: new Date().toISOString(),
        };
        setmessages(messages => [...messages, loadingMessage]);

        async function fun() {
            try {
                const response = await fetch(`/https://hopeconnect-backend.onrender.com//users/philosophy?query=${encodeURIComponent(querr)}`, {
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "application/json"
                    },
                });
                const res = await response.json();
                console.log(res);

                // Replace loading message with response
                setmessages(messages => messages.map(msg =>
                    msg.id === loadingId ? res : msg
                ));
                setBuffer(10);
                setProgress(0);
            } catch (error) {
                console.error("Error:", error);
            }
        }
        fun();

    }

    const filteredMessages = (messages || []).filter(msg => msg.text.toLowerCase().includes(searchChat.toLowerCase()))

    return (
        submitted ? (

            < div className={styles.page1} >

                {/* SIDE BAR COMPONENTS */}
                <div className={styles.homeButton}>
                    <button className={styles.button} type='submit' onClick={onBack}>
                        <House size={20} />
                    </button>
                </div>

                <div className={styles.newChat}>
                    <button className={styles.button} type='submit'>
                        <MessageSquarePlus size={20} />
                    </button>
                </div>

                <div className={styles.profile}>
                    <button className={styles.button} type='submit'>
                        <UserRound size={20} />
                    </button>
                </div>


                {/* SEARCH OPTION */}
                <div className={styles.seachOption}>
                    <div className={styles.searchContainer}>
                        {isSearchExpanded ? (
                            <input
                                type="text"
                                placeholder="Search older chats"
                                value={searchChat}
                                onChange={(e) => setSearchChat(e.target.value)}
                                className={styles.search}
                                onFocus={() => setIsSearchExpanded(true)}
                                onBlur={() => {
                                    if (!searchChat) setIsSearchExpanded(false);
                                }}
                                autoFocus
                            />
                        ) : (
                            <button
                                className={styles.open}
                                onClick={() => setIsSearchExpanded(true)}
                            >
                                <Search className={styles.searchIcon} size={18} />
                            </button>
                        )}
                    </div>
                </div>

                <div className={styles.chatContent}>
                    <div className={styles.messagesList} >
                        {filteredMessages.map(message => (
                            message.text === "!@#$%^&*" ?
                                (<Box sx={{ width: '100%' }}>
                                    <LinearProgress variant="buffer" value={progress} valueBuffer={buffer} sx={{
                                        '& .MuiLinearProgress-bar1': {
                                            backgroundColor: '#5fc6a6', // main progress bar (was blue)
                                        }
                                    }} />
                                </Box>) :
                                <div
                                    key={message.id}
                                    className={`${styles.message} ${message.username === current_user ? styles.sentMessage : styles.receivedMessage}`}>
                                    <div className={styles.messageContent}>
                                        {message.text}
                                    </div>
                                </div>
                        ))}
                        <div ref={messagesEndRef} />
                    </div>
                </div>

                <div className={styles.querycontent}>
                    <form className={styles.inputBox} onSubmit={(e) => { e.preventDefault(); handleQuery() }}>
                        <input
                            type="text"
                            placeholder='Express yourself'
                            ref={query}
                            className={styles.queryBox}
                        >
                        </input>
                        <button className={styles.button} type='submit'>
                            <Send size={20} />
                        </button>
                    </form>
                </div>

            </div >


        ) :
            (< div className={styles.page2} >

                <div className={styles.homeButton}>
                    <button className={styles.button} type='submit' onClick={onBack}>
                        <House size={20} />
                    </button>
                </div>

                <div className={styles.newChat}>
                    <button className={styles.button} type='submit'>
                        <MessageSquarePlus size={20} />
                    </button>
                </div>

                <div className={styles.profile}>
                    <button className={styles.button} type='submit'>
                        <UserRound size={20} />
                    </button>
                </div>

                <div className={styles.content}>
                    <form className={styles.inputBox} onSubmit={(e) => { e.preventDefault(); setSubmitted(true); handleQuery() }}>
                        <input
                            type="text"
                            placeholder='Express yourself'
                            ref={query}
                            className={styles.queryBox}
                        >
                        </input>
                        <button className={styles.button} type='submit'>
                            <Send size={20} />
                        </button>
                    </form>
                </div>

            </div >)
    );
} 