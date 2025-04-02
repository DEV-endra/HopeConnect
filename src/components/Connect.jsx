import { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Search, MessageCircle, Video, Clock, Send } from 'lucide-react';
import { Navigate, useNavigate } from 'react-router-dom';
import styles from '../styles/connect.module.css';

export default function Connect() {

    const [tab, settab] = useState('Peoples');
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');

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
    const [sessions, setsessions] = useState([
        {
            id: 1,
            title: 'Stress Management Workshop',
            host: 'Dr. Sarah Wilson',
            participants: 12,
            time: '2:00 PM',
            duration: '1 hour'
        },
        {
            id: 2,
            title: 'Peer Support Group',
            host: 'Mike Johnson',
            participants: 8,
            time: '3:30 PM',
            duration: '45 mins'
        },
    ]);

    const filteredPeoples = peoples.filter(person =>
        (person.name?.toLowerCase() || "").includes(searchQuery?.toLowerCase() || "") ||
        (person.username?.toLowerCase() || "").includes(searchQuery?.toLowerCase() || "")
    );

    const filteredSessions = sessions.filter(session =>
        (session.title?.toLowerCase() || "").includes(searchQuery?.toLowerCase() || "") ||
        (session.host?.toLowerCase() || "").includes(searchQuery?.toLowerCase() || "")
    );


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
                        placeholder="Search people or sessions..."
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
                <button onClick={() => settab('Sessions')}>
                    Sessions
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

                        <div className={styles.sessions}>

                            {filteredSessions.map(session => (

                                <div className={styles.body2}>
                                    <div key={session.id} className={styles.sessionCard}>
                                        <div className={styles.sessionInfo}>
                                            <div className={styles.sessionHeader}>
                                                <Video className={styles.videoIcon} size={20} />
                                                <h3>{session.title}</h3>
                                            </div>
                                            <p className={styles.host}>Hosted by {session.host}</p>
                                            <div className={styles.sessionDetails}>
                                                <span className={styles.participants}>
                                                    {session.participants} participants
                                                </span>
                                                <span className={styles.time}>
                                                    <Clock size={16} />
                                                    {session.time} ({session.duration})
                                                </span>
                                            </div>
                                        </div>
                                        <button className={styles.joinButton}>
                                            Join
                                        </button>
                                    </div>

                                </div>
                            ))}

                        </div>
                    )
                }

            </div>
        </div>


    )
}
