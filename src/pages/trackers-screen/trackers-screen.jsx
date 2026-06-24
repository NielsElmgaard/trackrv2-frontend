
function TrackersScreen({onLogout}) {

    return (<>
        <div className="trackers-screen-container">
            <h1>Trackers</h1>
            <div className="logout-button">
                <button onClick={onLogout}>Log ud</button>
            </div>
        </div>
    </>);
}

export default TrackersScreen;