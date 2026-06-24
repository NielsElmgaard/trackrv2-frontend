function HomeScreen({onLogout}) {
    const username = JSON.parse(localStorage.getItem("username"));
    return (
        <>
            <div className="home-screen-container">
                <h1>TrackrV2</h1>
                <h3>Hello, {username}!</h3>
                <div className="logout-button">
                    <button onClick={onLogout}>Log ud</button>
                </div>
            </div>
        </>
    );
}

export default HomeScreen;
