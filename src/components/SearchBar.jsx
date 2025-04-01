import React from "react";
import { MDBContainer } from "mdb-react-ui-kit";
import styles from '../styles/searchbar.module.css';

export default function SearchBar() {
    return (
        <MDBContainer className="py-5">
            <input
                type="text"
                className={styles.search}
                placeholder="search here..."
            />
        </MDBContainer>
    );
}