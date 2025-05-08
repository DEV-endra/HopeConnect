import { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Search, MessageCircle, Video, Clock, Send } from 'lucide-react';
import { Navigate, useNavigate } from 'react-router-dom';
import styles from '../styles/connect.module.css';
import { io } from 'socket.io-client';
import { v4 as uuidv4 } from 'uuid';
import socket from '../socket';

export default function Connect() {

    const token = localStorage.getItem('token');
    const inputRef = useRef(null);
    const [tab, settab] = useState('Peoples');
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');
    const [chat, setchat] = useState(false);
    const [conv_id, setconv_id] = useState(1);
    const [messageInput, setMessageInput] = useState('');
    const [conversations, setconversations] = useState([]);
    const [messages, setmessages] = useState([]);
    const [newconv, setnewconv] = useState({});
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        if (chat) {
            // Small timeout to ensure DOM is updated after state changes
            setTimeout(() => {
                scrollToBottom();
            }, 100);
        }
    }, [chat, conv_id]);

    const [peoples, setpeoples] = useState([
        {
            id: 1,
            name: 'John Doe',
            username: '@johndoe',
            role: 'Student',
            avatar: 'http://via.placeholder.com/40',
            description: 'Passionate about mental health advocacy and peer support. Currently pursuing psychology studies.'
        },
        {
            id: 2,
            name: 'Jane Smith',
            username: '@janesmith',
            role: 'Counselor',
            avatar: 'http://via.placeholder.com/40',
            description: 'Licensed counselor with 5 years of experience in anxiety and stress management.'
        },
        {
            id: 3,
            name: 'Mike Johnson',
            username: '@mikej',
            role: 'Student',
            avatar: 'http://via.placeholder.com/40',
            description: 'Active member of the peer support community. Interested in mindfulness and meditation.'
        },
        {
            id: 4,
            name: 'Sarah Wilson',
            username: '@sarahw',
            role: 'Counselor',
            avatar: 'http://via.placeholder.com/40',
            description: 'Specialized in adolescent counseling and family therapy. Available for group sessions.'
        }
    ]);

    const username = localStorage.getItem('username');
    const Id = localStorage.getItem('Id');

    //// IMPORTING CHATS
    useEffect(() => {
        async function fun() {
            const token = localStorage.getItem("token");
            try {
                const response = await fetch(`/api/users/chats?username=${encodeURIComponent(username)}`, {
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "application/json"
                    },
                });
                const { updatedConversations, updatedMessages, Peoples } = await response.json();
                setmessages(updatedMessages);
                setconversations(updatedConversations);
                setpeoples(Peoples);
            } catch (error) {
                console.error("Error:", error);
            }
        }

        fun();
    }, []);

    const filteredPeoples = (peoples || []).filter(person =>
        (person.name?.toLowerCase() || "").includes(searchQuery?.toLowerCase() || "") ||
        (person.username?.toLowerCase() || "").includes(searchQuery?.toLowerCase() || "")
    );

    const filteredconversations = (conversations || []).filter(session =>
        (session.another_user?.toLowerCase() || "").includes(searchQuery?.toLowerCase() || "") ||
        (session.lastText?.toLowerCase() || "").includes(searchQuery?.toLowerCase() || "")
    );

    const filteredMessages = (messages || []).filter(msg => msg.id === conv_id).sort((a, b) => new Date(`1970/01/01 ${a.time}`) - new Date(`1970/01/01 ${b.time}`)); // Sort by time

    //console.log(filteredMessages);

    const openchat = (id) => {
        setchat(true);
        setconv_id(id);
    };

    // ACTIVATING USER BY SENDING TOKEN
    useEffect(() => {
        if (!socket) return;

        if (token) {
            socket.emit("token", token);
            console.log("token emitted to server:", token);
        }
    }, [token]);

    // RECEVING MESSAGES
    useEffect(() => {
        if (!socket) return;

        socket.on('receiveMessage', ({ senderId, msg, username }) => {
            const filteredconversatt = conversations.find(
                conv =>
                    (conv.user1_id === senderId && conv.user2_id === Id) ||
                    (conv.user1_id === Id && conv.user2_id === senderId)
            );

            if (filteredconversatt) {
                const newReceivedMessage = {
                    senderid: senderId,
                    username: username,
                    avatar: null,
                    text: msg,
                    time: new Date().toISOString(),
                    id: filteredconversatt.id,
                    uniq: uuidv4()
                };
                setmessages(prev => [...prev, newReceivedMessage]);
            }
            else {

                console.log("didn't find conv id");
            }

        });

        // Cleanup to avoid duplicate listeners on re-renders
        return () => {
            socket.off('receiveMessage');
        };
    }, [socket, conversations, Id]);


    const handleSendMessage = () => {

        //Sending
        const inputValue = inputRef.current.value;
        const filteredconversat = filteredconversations.find(conv => conv.id === conv_id);
        const user1 = filteredconversat.user1_id;
        const user2 = filteredconversat.user2_id;
        const rec = (user1 === Id) ? user2 : user1;

        if (inputValue) {
            socket.emit('message', {
                senderId: Id,
                receiverId: rec,
                msg: inputValue,
                conversationId: conv_id,
                username: username
            });

            const newMessage = {
                senderid: Id,
                username: username,
                avatar: null,
                text: inputValue,
                time: new Date().toISOString(),
                id: conv_id,
                uniq: uuidv4()
            };

            setmessages((messages) => [...messages, newMessage]);
            inputRef.current.value = '';
        }

    };

    const newConversations = (peopleId) => {

        const check = conversations.some(conv =>
            (conv.user1_id === Id && conv.user2_id === peopleId) ||
            (conv.user2_id === Id && conv.user1_id === peopleId)
        );

        // console.log(check);
        if (check === false) {
            async function fun() {
                const token = localStorage.getItem("token");
                try {
                    const response = await fetch(`/api/users/newconversation?peopleId=${encodeURIComponent(peopleId)}`, {
                        method: "GET",
                        headers: {
                            "Authorization": `Bearer ${token}`,
                            "Content-Type": "application/json"
                        },
                    });
                    const newConversation = await response.json();
                    setconversations((convs) => [...convs, newConversation]);
                    settab('Messages');
                    setchat(true);
                    setconv_id(newConversation.id);
                } catch (error) {
                    console.error("Error:", error);
                }
            }
            fun();
        }
        else {
            const existingConv = conversations.find(conv =>
                (conv.user1_id === Id && conv.user2_id === peopleId) ||
                (conv.user2_id === Id && conv.user1_id === peopleId)
            );
            settab('Messages');
            setchat(true);
            setconv_id(existingConv.id);
        }
        // console.log(conversations);
    }

    const current_user = localStorage.getItem('username');
    return (

        <div className={styles.container}>

            {/* NAVBAR */}
            <div className={styles.nav}>
                <button onClick={() => navigate('/SeekerDashboard')}>
                    <ArrowLeft />
                </button>

                <div className={styles.heading}>HopeConnect</div>

                <div>
                    <input
                        type="text"
                        placeholder="Search people or messages..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className={styles.search}
                    />
                </div>

            </div>

            <div className={styles.tabs}>
                <button onClick={() => settab('Peoples')}>
                    People
                </button>
                <button onClick={() => settab('Messages')}>
                    Messages
                </button>
            </div>

            <div className={styles.content}>
                {
                    tab === 'Peoples' ? (

                        <div className={styles.people}>

                            {filteredPeoples.map(people => (

                                <div className={styles.body1} key={people.id || people.username}>

                                    <div className={styles.peopleinfo}>
                                        <div className={styles.avatarcontainer}>
                                            <img
                                                src={people.avatar}
                                                alt={people.name}
                                                className={styles.avatar}
                                            />
                                        </div>

                                        <div className={styles.name}>
                                            {people.name}
                                        </div>

                                        <div className={styles.username}>
                                            {people.username}
                                        </div>

                                        <div className={styles.description}>
                                            {people.description}
                                        </div>
                                    </div>

                                    <button className={styles.messageButton} onClick={() => newConversations(people.id)}>
                                        <MessageCircle size={20} />
                                    </button>

                                </div>
                            ))}

                        </div>
                    ) : (

                        (chat === false) ? (<div className={styles.conversations}>

                            {filteredconversations.map(conversation => (

                                <button key={conversation.id} className={styles.body2} onClick={() => { openchat(conversation.id); scrollToBottom() }}>
                                    <div className={styles.conversationCard}>
                                        <div className={styles.conversationInfo}>
                                            <div className={styles.conversationHeader}>
                                                <div className={styles.avatarcontainer}>
                                                    <img
                                                        src={conversation.avatar}
                                                        alt={conversation.another_user}
                                                        className={styles.avatar}
                                                    />
                                                </div>
                                                <h3>{conversation.another_user}</h3>
                                            </div>
                                            <div className={styles.conversationDetails}>
                                                <span className={styles.participants}>
                                                    {conversation.lastText}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                </button>
                            ))}

                        </div>) :
                            (
                                <div className={styles.chatContainer}>
                                    <button className={styles.backButton} onClick={() => setchat(false)}>
                                        <ArrowLeft size={20} />
                                    </button>

                                    {/* displaying older chats */}
                                    <div className={styles.messagesList}>
                                        {filteredMessages.map(message => (
                                            <div
                                                key={message.uniq}
                                                className={`${styles.message} ${message.username === current_user ? styles.sentMessage : styles.receivedMessage}`}>
                                                <div className={styles.messageContent}>
                                                    <p>{message.text}</p>
                                                    <span className={styles.messageTime}>{message.time}</span>
                                                </div>
                                            </div>
                                        ))}
                                        <div ref={messagesEndRef} />
                                    </div>

                                    {/* FOR MESSAGING */}
                                    <form className={styles.messageInput} onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }}>
                                        <input
                                            type="text"
                                            placeholder="Type a message..."
                                            ref={inputRef}
                                        />
                                        <button type="submit">
                                            <Send size={20} />
                                        </button>
                                    </form>
                                </div>
                            )
                    )
                }

            </div>
        </div >


    )
}
