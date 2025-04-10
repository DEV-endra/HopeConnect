import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../styles/philosophy.module.css';
import { MessageSquarePlus, House, Send, UserRound, Search } from 'lucide-react';
// import bg from "../assets/bg.png"

export default function philosophy() {
    const query = useRef(null);
    const [submitted, setSubmitted] = useState(false);
    const [searchChat, setSearchChat] = useState('');
    const [messages, setmessages] = useState([]);
    const [isSearchExpanded, setIsSearchExpanded] = useState(false);

    useEffect(() => {
        console.log("Dev");
        setmessages([{
            id: 137,
            username: 'dev',
            text: 'Hi soumya',
            time: '2025-04 -09T12: 27:08.036Z',
        },
        {
            id: 138,
            username: '82904a2a-5aee-471d-a4ec-37b53b736e57',
            text: 'hi dev',
            time: '2025-04 -09T12: 27: 11.677Z',
        },
        {
            id: 139,
            username: 'dev',
            text: 'how doing',
            time: '2025-04 -09T12: 27: 18.847Z',
        }])
    }, [])

    const handleQuery = () => {
        setSubmitted(true)
    }

    // const filteredMessages = (messages || []).filter(msg => msg.id === conv_id).sort((a, b) => new Date(`1970/01/01 ${a.time}`) - new Date(`1970/01/01 ${b.time}`)); // Sort by time
    const filteredMessages = [
        {
            id: 137,
            username: 'dev',
            text: 'Hi soumya',
            time: '2025-04 -09T12: 27:08.036Z',
        },
        {
            id: 138,
            username: '82904a2a-5aee-471d-a4ec-37b53b736e57',
            text: 'hi dev',
            time: '2025-04 -09T12: 27: 11.677Z',
        },
        {
            id: 139,
            username: 'dev',
            text: 'how doing',
            time: '2025-04 -09T12: 27: 18.847Z',
        }
    ];

    const current_user = "dev";

    return (
        submitted ? (
            <div>

                < div className={styles.page1} >
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


                    <div className={styles.seachOption}>
                        <div className={styles.searchContainer}>
                            {isSearchExpanded ? (
                                <input
                                    type="text"
                                    placeholder="Search chats"
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
                        <div className={styles.messagesList}>
                            {filteredMessages.map(message => (
                                <div
                                    key={message.id}
                                    className={`${styles.message} ${message.username === current_user ? styles.sentMessage : styles.receivedMessage}`}>
                                    <div className={styles.messageContent}>
                                        {message.text}
                                    </div>
                                </div>
                            ))}
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
                    <form className={styles.inputBox} onSubmit={(e) => { e.preventDefault(); setSubmitted(true) }}>
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