import { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Search, MessageCircle, Video, Clock, Send } from 'lucide-react';
import { Navigate, useNavigate } from 'react-router-dom';
import styles from '../styles/connect.module.css';

export default function Connect() {

    const [tab, settab] = useState('Peoples');
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');
    const [chat, setchat] = useState(false);
    const [conv_id, setconv_id] = useState(1);
    const [messageInput, setMessageInput] = useState('');
    const [conversations, setconversations] = useState([
        {
            id: 1,
            user2_id: 12,
            user1_id: 14,
            another_user: "dev",
            last_text: "Hey Welcome connect",
        },
        {
            id: 2,
            user2_id: 12,
            user1_id: 14,
            another_user: "dev3",
            last_text: "Hello world",
        }

    ]);
    const [messages, setmessages] = useState([
        {
            id: 1,
            senderid: 1,
            username: "dev2005",
            time: '2:00 PM',
            text: "Hey Welnect",
            avatar: "sc",
        },
        {
            id: 1,
            senderid: 2,
            username: "dev",
            time: '3:10 PM',
            text: "Hey Welcome to Hopeconnect",
            avatar: "sc",
        },
        {
            id: 1,
            senderid: 1,
            username: "dev2005",
            time: '3:30 PM',
            text: "Hey Welconnect",
            avatar: "sc",
        },
        {
            id: 1,
            senderid: 2,
            username: "dev",
            time: '4:00 PM',
            text: "Hey Welcome connect",
            avatar: "sc",
        },
        {
            id: 2,
            senderid: 1,
            username: "dev",
            time: '2:00 PM',
            text: "Hey Welcome to Hopeconnect",
            avatar: "sc",
        },
    ]);
    const [peoples, setpeoples] = useState([
        {
            id: 1,
            name: 'John Doe',
            username: '@johndoe',
            role: 'Student',
            avatar: 'https://via.placeholder.com/40',
            status: 'online',
            description: 'Passionate about mental health advocacy and peer support. Currently pursuing psychology studies.'
        },
        {
            id: 2,
            name: 'Jane Smith',
            username: '@janesmith',
            role: 'Counselor',
            avatar: 'https://via.placeholder.com/40',
            status: 'offline',
            description: 'Licensed counselor with 5 years of experience in anxiety and stress management.'
        },
        {
            id: 3,
            name: 'Mike Johnson',
            username: '@mikej',
            role: 'Student',
            avatar: 'https://via.placeholder.com/40',
            status: 'online',
            description: 'Active member of the peer support community. Interested in mindfulness and meditation.'
        },
        {
            id: 4,
            name: 'Sarah Wilson',
            username: '@sarahw',
            role: 'Counselor',
            avatar: 'https://via.placeholder.com/40',
            status: 'offline',
            description: 'Specialized in adolescent counseling and family therapy. Available for group sessions.'
        }
    ]);

    const filteredPeoples = peoples.filter(person =>
        (person.name?.toLowerCase() || "").includes(searchQuery?.toLowerCase() || "") ||
        (person.username?.toLowerCase() || "").includes(searchQuery?.toLowerCase() || "")
    );

    const filteredconversations = conversations.filter(session =>
        (session.another_user?.toLowerCase() || "").includes(searchQuery?.toLowerCase() || "") ||
        (session.last_text?.toLowerCase() || "").includes(searchQuery?.toLowerCase() || "")
    );

    const filteredMessages = messages
        .filter(msg => msg.id === conv_id) // Filter messages with id = 1
        .sort((a, b) => new Date(`1970/01/01 ${a.time}`) - new Date(`1970/01/01 ${b.time}`)); // Sort by time

    const openchat = (id) => {
        setchat(true);
        setconv_id(id);
    };

    const handleSendMessage = () => {

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

                                <div className={styles.body1}>

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

                                    <button className={styles.messageButton}>
                                        <MessageCircle size={20} />
                                    </button>

                                </div>
                            ))}

                        </div>
                    ) : (

                        (chat === false) ? (<div className={styles.conversations}>

                            {filteredconversations.map(conversation => (

                                <button className={styles.body2} onClick={() => openchat(conversation.id)}>
                                    <div key={conversation.id} className={styles.conversationCard}>
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
                                                    {conversation.last_text}
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
                                                key={message.id}
                                                className={`${styles.message} ${message.username === current_user ? styles.sentMessage : styles.receivedMessage}`}>
                                                <div className={styles.messageContent}>
                                                    <p>{message.text}</p>
                                                    <span className={styles.messageTime}>{message.time}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* FOR MESSAGING */}
                                    <form className={styles.messageInput} onSubmit={handleSendMessage}>
                                        <input
                                            type="text"
                                            placeholder="Type a message..."
                                            value={messageInput}
                                            onChange={(e) => setMessageInput(e.target.value)}
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
        </div>


    )
}
