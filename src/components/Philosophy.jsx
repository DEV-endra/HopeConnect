import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../styles/philosophy.module.css';
import { MessageSquarePlus, House, Send, UserRound, Search } from 'lucide-react';
import bg from "../assets/bg.png"
import { v4 as uuidv4 } from 'uuid';

export default function philosophy() {
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

    const onBack = () => {

        if (role === 'helpee')
            navigate('/HelpeeDashBoard');
        else
            navigate('/HelperDashBoard');
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
                const response = await fetch("/api/users/history", {
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
        async function fun() {
            try {
                const response = await fetch(`/api/users/philosophy?query=${encodeURIComponent(querr)}`, {
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "application/json"
                    },
                });
                const res = await response.json();
                console.log(res);
                setmessages(messages => [...messages, res]);
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
                    <button className={styles.button} type='submit'>
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