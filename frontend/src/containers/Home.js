import React, {Component} from "react";
import {Label, ListGroup, ListGroupItem, PageHeader} from "react-bootstrap";
import "./Home.css";
import {API} from "aws-amplify";
import {Link} from "react-router-dom";

export default class Home extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isLoading: true,
            notes: []
        };
    }

    async componentDidMount() {
        if (!this.props.isAuthenticated) {
            return;
        }

        try {
            const notes = await this.notes();
            this.setState({notes});
        } catch (e) {
            alert(e);
        }

        this.setState({isLoading: false});
    }

    notes() {
        return API.get("aws-bookmarks", "/bookmarks");
    }

    renderNotesList(bookmarks) {
        return [{}].concat(bookmarks).map(
            (bookmark, i) =>
                i !== 0
                    ? <div className="margin-top">
                        <a href={`${bookmark.url}`} target="_blank" rel="noopener noreferrer">
                            <ListGroupItem header={bookmark.name.trim()}>
                                {/*{"Created: " + new Date(bookmark.createdAt).toLocaleString()}*/}
                                {/*{"URL: " + bookmark.url }*/}
                                {bookmark.labels.map((label) => <Label> {label} </Label>)}
                            </ListGroupItem>
                        </a>
                    </div>
                    : <Link
                        key="new"
                        to="/bookmarks/new"
                    >
                        <ListGroupItem>
                            <h4>
                                <b>{"\uFF0B"}</b> Create a new Bookmark
                            </h4>
                        </ListGroupItem>
                    </Link>
        );
    }

    renderLander() {
        return (
            <div className="lander">
                <h1>Scratch</h1>
                <p>A simple note taking app</p>
            </div>
        );
    }

    renderNotes() {
        return (
            <div className="notes">
                <PageHeader>Your Notes</PageHeader>
                <ListGroup>
                    {!this.state.isLoading && this.renderNotesList(this.state.notes)}
                </ListGroup>
            </div>
        );
    }

    render() {
        return (
            <div className="Home">
                {this.props.isAuthenticated ? this.renderNotes() : this.renderLander()}
            </div>
        );
    }
}